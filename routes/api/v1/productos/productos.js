const express = require('express');
const router = express.Router();

const Productos = new require('../../../../dao/productos/productos.model');
const productosModel = new Productos();

//POST NEW
router.post('/new', async (req,res)=>{
    const {
        productoNombre, 
        productoDescripcion,
        productoPrecio,
        productoImagen,
        laboratorioId,
        presentacionId
    } = req.body;
    const productoActivo="True"
    try{
        rslt = await productosModel.new(
            productoNombre, 
            productoDescripcion,
            productoPrecio,
            productoActivo,
            productoImagen,
            laboratorioId,
            presentacionId
        );
        res.status(200).json({status:'ok', result:rslt});

    }catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed', result:{} });
    }
});

//GET ALL
router.get('/all', async (req, res)=>{
    try{
        const rows = await productosModel.getAll();
        res.status(200).json({status:'ok', productos: rows});

    }catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed'});
    }

});

//GET BY ID
router.get('/byid/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const row = await productosModel.getById(id);
        res.status(200).json({status:'ok', producto: row});
    }catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed'});
    }
});

//FACET SEARCH
const allowedItems = [10,15,20];
//
router.get('/facet/:page/:items', async (req, res)=>{
    const page = parseInt(req.params.page, 10);
    const items = parseInt(req.params.items, 10); 
    if(allowedItems.includes(items)){
        try{
            const pacientes = await productosModel.getFaceted(page, items);
            res.status(200).json({status:'ok', docs:pacientes});
        }catch(ex){
            console.log(ex);
            res.status(500).json({status:'failed'});
        }

    }else{
        res.status(403).json({status:'error', msg:'Bad Request'});
    }
});

//PUT UPDATE
router.put('/update/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const {
            productoNombre, 
            productoDescripcion,
            productoPrecio,
            productoActivo,
            productoImagen,
            laboratorioId,
            presentacionId
        } = req.body;
        const rslt = await productosModel.updateOne(id,productoNombre, 
            productoDescripcion,
            productoPrecio,
            productoActivo,
            productoImagen,
            laboratorioId,
            presentacionId);
        res.status(200).json({status:'ok', result: rslt});
    }catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed'});
    }
});

//UPDATE ADD TAG
router.put('/addtag/:id', async(req, res)=>{
    try{
        const {tag} = req.body;
        const {id} = req.params;
        const result = await productosModel.updateAddTag(id, tag);
        res.status(200).json({status:'ok', result});
    }
    catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed'});
    }

});

//UPDATE ADD TAG SET
router.put('/addtagset/:id', async(req, res)=>{
    try{
        const {tag} = req.body;
        const {id} = req.params;
        const result = await productosModel.updateAddTagSet(id, tag);
        res.status(200).json({status:'ok', result});
    }
    catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed'});
    }

});

//DELETE
router.delete('/delete/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const rslt = await productosModel.deleteOne(id);
        res.status(200).json({status:'ok', result: rslt});
    }catch(ex){
        console.log(ex);
        res.status(500).json({status: 'failed'});
    }
});

router.delete('/deleteName', async (req, res)=>{
    const {productoNombre} = req.body;
    if(productoNombre){
      try{
        const result = await productosModel.deleteOneName(productoNombre);
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