const express = require('express');
const router = express.Router();

const Farmaceuticas = new require('../../../../dao/farmaceuticas/farmaceuticas.model');
const farmaceuticaModel = new Farmaceuticas();

//GET ALL
router.get('/all', async (req, res)=>{
  try{
      const rows = await farmaceuticaModel.getAll();
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
      const farmaceuticas = await farmaceuticaModel.getFaceted(page, items);
      res.status(200).json({docs: farmaceuticas});
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
      const farmaceuticas = await farmaceuticaModel.getFaceted(page, items, {Laboratorio:name});
      res.status(200).json({docs: farmaceuticas});
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
        const row = await farmaceuticaModel.getById(id);
        res.status(200).json({status:'ok', farmaceutica: row});
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
  const { FarmaceuticaNombre, FarmaceuticaDescripcion, FarmaceuticaUbicacion,FarmaceuticaTelefono, FarmaceuticaEmail } = req.body;
  if(FarmaceuticaNombre, FarmaceuticaDescripcion, FarmaceuticaUbicacion,FarmaceuticaTelefono, FarmaceuticaEmail){
    try{
      rslt = await farmaceuticaModel.new(FarmaceuticaNombre, FarmaceuticaDescripcion, FarmaceuticaUbicacion,FarmaceuticaTelefono, FarmaceuticaEmail);
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
    if(!FarmaceuticaNombre){
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio el nombre de la Farmaceutica"
    });
    }else if(FarmaceuticaDescripcion){
      return res.status(400).json({
        status: 'failed',
        result: "No se ingreso la descripcion de la farmaceutica"
    });
  } else if(FarmaceuticaUbicacion){
    return res.status(400).json({
      status: 'failed',
      result: "No se ingreso la ubicacion de la farmaceutica"
  });
  } else if(FarmaceuticaTelefono){
    return res.status(400).json({
      status: 'failed',
      result: "No se ingreso el Telefono de la farmaceutica"
  });
  } else{
    return res.status(400).json({
      status: 'failed',
      result: "No se ingreso el correo electronico de la farmaceutica"
  });
  }
  }
}); 

//PUT UPDATE
router.put('/update/:id', async (req, res)=>{
  const { FarmaceuticaNombre, FarmaceuticaDescripcion, FarmaceuticaUbicacion,FarmaceuticaTelefono, FarmaceuticaEmail } = req.body;
  const {id} = req.params;  
  if(id,FarmaceuticaNombre, FarmaceuticaDescripcion, FarmaceuticaUbicacion,FarmaceuticaTelefono, FarmaceuticaEmail){
    try{
      const result = await farmaceuticaModel.updateOne(id, FarmaceuticaNombre, FarmaceuticaDescripcion, FarmaceuticaUbicacion,FarmaceuticaTelefono, FarmaceuticaEmail);
      res.status(200).json({
        status:'ok', 
        result: result
    });
    
    }catch (ex){
      console.log(ex);
      res.status(500).json({status: 'failed'})
    }
  } else{
    if(!FarmaceuticaNombre){
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio el nombre de la Farmaceutica"
    });
    }else if(FarmaceuticaDescripcion){
      return res.status(400).json({
        status: 'failed',
        result: "No se ingreso la descripcion de la farmaceutica"
    });
  } else if(FarmaceuticaUbicacion){
    return res.status(400).json({
      status: 'failed',
      result: "No se ingreso la ubicacion de la farmaceutica"
  });
  } else if(FarmaceuticaTelefono){
    return res.status(400).json({
      status: 'failed',
      result: "No se ingreso el Telefono de la farmaceutica"
  });
  } else{
    return res.status(400).json({
      status: 'failed',
      result: "No se ingreso el correo electronico de la farmaceutica"
  });
  }
  }
});

//DELETE 
router.delete('/delete/:id', async (req, res)=>{
  const {id} = req.params;
  if(id){
    try{
      const result = await farmaceuticaModel.deleteOne(id);
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
      result: "No se Ingreso el id de la farmaceutica"
  });
  }
  });

  router.delete('/deleteName', async (req, res)=>{
    const {FarmaceuticaNombre} = req.body;
    if(FarmaceuticaNombre){
      try{
        const result = await farmaceuticaModel.deleteOneName(FarmaceuticaNombre);
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