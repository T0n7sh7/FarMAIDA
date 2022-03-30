const express = require('express');
const router = express.Router();

const Carritos = new require('../../../../dao/carritos/carritos.model');
const carritosModel = new Carritos();

//POST NEW
router.post('/new', async(req, res)=>{
    const {id, carritoEstado, createdAt, updatedAt, usuarioId} = req.body;
    try{
        const rslt = await carritosModel.new(id, carritoEstado, createdAt, updatedAt, usuarioId);
        res.status(200).json({status:'ok', result: rslt});
    } catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed', result: {}});
    }
});


//GET ALL
router.get('/all', async (req, res)=>{
    try{
        const rows = await carritosModel.getAll();
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
        const row = await carritosModel.getById(id);
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
            const pacientes = await pacienteModel.getFaceted(page, items);
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
        const rslt = await carritosModel.updateOne(id);
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
        const result = await pacienteModel.updateAddTag(id, tag);
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
        const result = await pacienteModel.updateAddTagSet(id, tag);
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
        const rslt = await carritosModel.deleteOne(id);
        res.status(200).json({status:'ok', result: rslt});
    }catch(ex){
        console.log(ex);
        res.status(500).json({status: 'failed'});
    }
});

module.exports = router;