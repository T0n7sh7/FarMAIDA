const express = require('express');
const router = express.Router();

const Inventarios = new require('../../../../dao/inventarios/inventarios.model');
const inventarioModel = new Inventarios();


//Paginacion
const allowedItemsNumber = [10,15,20];
router.get('/facet/:page/:items', async (req,res)=>{
  const page = parseInt(req.params.page, 10);
  const items = parseInt(req.params.items,10);
  if (allowedItemsNumber.includes(items)){
    try{
      const inventarios = await inventarioModel.getFaceted(page, items);
      res.status(200).json({docs: inventarios});
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
      const inventarios = await inventarioModel.getFaceted(page, items, {Producto:name});
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
        const row = await inventarioModel.getById(id);
        res.status(200).json({status:'ok', inventario: row});
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
  const { InventarioExistencia, InventarioFechaCaducidad, Producto } = req.body;
  if(InventarioExistencia, InventarioFechaCaducidad, Producto){
    try{
      rslt = await inventarioModel.new(InventarioExistencia, InventarioFechaCaducidad, Producto);
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
    if(!InventarioExistencia){
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio la cantidad de Existencias"
    });
    }else if(InventarioFechaCaducidad){
      return res.status(400).json({
        status: 'failed',
        result: "No se ingreso la Fecha de Caducidad"
    });
    } else{
      return res.status(400).json({
        status: 'failed',
        result: "No se ingreso el producto del inventario"
    });
  }
  }
}); 

//PUT UPDATE
router.put('/update/:id', async (req, res)=>{
  const { InventarioExistencia, InventarioFechaCaducidad, Producto } = req.body;
  const {id} = req.params;  
  if(id,InventarioExistencia, InventarioFechaCaducidad, Producto){
    try{
      const result = await inventarioModel.updateOne(id, InventarioExistencia, InventarioFechaCaducidad, Producto);
      res.status(200).json({
        status:'ok', 
        result: result
    });
    
    }catch (ex){
      console.log(ex);
      res.status(500).json({status: 'failed'})
    }
  } else{
    if(!InventarioExistencia){
      return res.status(400).json({
        status: 'failed',
        result: "No se escribio la cantidad de Existencias"
    });
    }else if(InventarioFechaCaducidad){
      return res.status(400).json({
        status: 'failed',
        result: "No se ingreso la Fecha de Caducidad"
    });
    } else{
      return res.status(400).json({
        status: 'failed',
        result: "No se ingreso el producto del inventario"
    });
  }
  }
});

//DELETE 
router.delete('/delete/:id', async (req, res)=>{
  const {id} = req.params;
  if(id){
    try{
      const result = await inventarioModel.deleteOne(id);
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
      result: "No se Ingreso el id del inventario"
  });
  }
  });



module.exports = router;