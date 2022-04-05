const express = require('express');
const router = express.Router();

const Laboratorios = new require('../../../../dao/laboratorios/laboratorios.model');
const laboratorioModel = new Laboratorios();

//GET ALL
router.get('/all', async (req, res)=>{
  try{
      const rows = await laboratorioModel.getAll();
      res.status(200).json({status:'ok', ordenes: rows});

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
      const laboratorios = await laboratorioModel.getFaceted(page, items);
      res.status(200).json({docs: laboratorios});
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
      const ilaboratorios = await laboratorioModel.getFaceted(page, items, {Laboratorio:name});
      res.status(200).json({docs: inventarios});
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
        const row = await laboratorioModel.getById(id);
        res.status(200).json({status:'ok', laboratorio: row});
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
  const { LaboratorioNombre, LaboratorioDescripcion } = req.body;
  if(LaboratorioNombre, LaboratorioDescripcion){
    try{
      rslt = await laboratorioModel.new(LaboratorioNombre, LaboratorioDescripcion);
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
    if(!LaboratorioNombre){
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio el nombre del Laboratorio"
    });
    }else{
      return res.status(400).json({
        status: 'failed',
        result: "No se ingreso la descripcion del Laboratorio"
    });
  }
  }
}); 

//PUT UPDATE
router.put('/update/:id', async (req, res)=>{
  const { LaboratorioNombre, LaboratorioDescripcion } = req.body;
  const {id} = req.params;  
  if(id,LaboratorioNombre, LaboratorioDescripcion){
    try{
      const result = await laboratorioModel.updateOne(id, LaboratorioNombre, LaboratorioDescripcion);
      res.status(200).json({
        status:'ok', 
        result: result
    });
    
    }catch (ex){
      console.log(ex);
      res.status(500).json({status: 'failed'})
    }
  } else{
    if(!LaboratorioNombre){
        return res.status(400).json({
          status: 'failed',
          result: "No se escribio el nombre del Laboratorio"
      });
      }else{
        return res.status(400).json({
          status: 'failed',
          result: "No se ingreso la descripcion del Laboratorio"
      });
    }
  }
});

//DELETE 
router.delete('/delete/:id', async (req, res)=>{
  const {id} = req.params;
  if(id){
    try{
      const result = await laboratorioModel.deleteOne(id);
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
      result: "No se Ingreso el id del Laboratorio"
  });
  }
  });

  router.delete('/deleteName', async (req, res)=>{
    const {LaboratorioNombre} = req.body;
    if(LaboratorioNombre){
      try{
        const result = await inventarioModel.deleteOneName(LaboratorioNombre);
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