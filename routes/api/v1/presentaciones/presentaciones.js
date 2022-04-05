const express = require('express');
const router = express.Router();

const Presentaciones = new require('../../../../dao/presentaciones/presentaciones.model');
const presentacionModel = new Presentaciones();

//GET ALL
router.get('/all', async (req, res)=>{
  try{
      const rows = await presentacionModel.getAll();
      res.status(200).json({status:'ok', presentaciones: rows});

  }catch(ex){
      console.log(ex);
      res.status(500).json({status:'failed'});
  }

});
//Paginacion
const allowedItemsNumber = [10,15,20];
router.get('/facet/:page/:items', async (req,res)=>{
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items,10);
  if (allowedItemsNumber.includes(items)){
    try{
      const presentaciones = await presentacionModel.getFaceted(page, items);
      res.status(200).json({docs: presentaciones});
    } catch(ex){
      console.log(ex);
      res.status(500).json({status: "faild"});
      
    }

  } else {
    return res.status(403).json({status:"error", msg: "Not a valid item value (10,15,20)"});
  }
});

//Paginacion por Nombre
router.get('/byname/name:/:page/:items', async (req,res)=>{
  const name = req.params.name;
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items,10);
  if (allowedItemsNumber.includes(items)){
    try{
      const pacientes = await presentacionModel.getFaceted(page, items, {PresentacionNombre:name});
      res.status(200).json({docs: pacientes});
    } catch(ex){
      console.log(ex);
      res.status(500).json({status: "faild"});
      
    }

  } else {
    return res.status(403).json({status:"error", msg: "Not a valid item value (10,15,20)"});
  }
});

//GET ONE
router.get('/byid/:id', async (req, res)=>{
  const {id} = req.params;
  if(id){
    try{
        const row = await presentacionModel.getById(id);
        res.status(200).json({status:'ok', paciente: row});
    } catch (ex){
        console.log(ex);
        res.status(500).json({status:'failed'});
    }
  } else{
    return res.status(400).json({
      status: 'failed',
      result: "No se introdujo un ID"
  });
  }
});

//POST NEW
router.post('/new', async (req, res) => {
  const { PresentacionNombre, PresentacionDescripcion } = req.body;
  if(PresentacionNombre, PresentacionDescripcion){
    try{
      rslt = await presentacionModel.new(PresentacionNombre, PresentacionDescripcion);
      res.status(200).json(
        {
          status: 'ok',
          result: rslt
        });
      } catch(ex){
          console.log(ex);
          res.status(500).json({
            status: 'failed',
            result: {}
          });
      }
  }else{
    if(!PresentacionNombre){
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio el nombre de la Presentacion"
    });
    }else{
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio la Descripcion de la Presentacion"
    });
    }
  }
}); 

//PUT UPDATE
router.put('/update/:id', async (req, res)=>{
  const { PresentacionNombre, PresentacionDescripcion } = req.body;
  const {id} = req.params;  
  if(id,PresentacionNombre,PresentacionDescripcion){
    try{
      const result = await presentacionModel.updateOne(id, PresentacionNombre, PresentacionDescripcion);
      res.status(200).json({
        status:'ok', 
        result: result
    });
    
    }catch (ex){
      console.log(ex);
      res.status(500).json({status: 'failed'})
    }
  } else{
    if(!PresentacionNombre){
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio el nombre de la Presentacion"
    });
    }else{
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio la Descripcion de la Presentacion"
    });
    }
  }
});

//DELETE 
router.delete('/delete/:id', async (req, res)=>{
  const {id} = req.params;
  if(id){
    try{
      const result = await presentacionModel.deleteOne(id);
      res.status(200).json({
        status:'ok', 
        result: result
    });
    
    }catch (ex){
      console.log(ex);
      res.status(500).json({status: 'failed'})
    }
  } else{
    return res.status(400).json({
      status: 'failed',
      result: "No se Ingreso el id de la presentacion"
  });
  }
  });

  router.delete('/deleteName', async (req, res)=>{
    const {PresentacionNombre} = req.body;
    if(PresentacionNombre){
      try{
        const result = await presentacionModel.deleteOneName(PresentacionNombre);
        res.status(200).json({
          status:'ok', 
          result: result
      });
      
      }catch (ex){
        console.log(ex);
        res.status(500).json({status: 'failed'})
      }
    } else{
      return res.status(400).json({
        status: 'failed',
        result: "No se Ingreso el id de la presentacion"
    });
    }
    });



module.exports = router;