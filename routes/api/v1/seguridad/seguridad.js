const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuarios = require('../../../../dao/usuario/usuarios.model');
const usuariosModel = new Usuarios();

router.post('/signin', async (req, res)=>{
    try{
        const {usuarioNombre, usuarioTelefono, usuarioCorreo, usuarioContraseña, usuarioDireccion, usuarioFechaNacimiento, usuarioSexo, usuarioAdmin, usuarioRegistrado, usuarioUltimoLog} = req.body;
        //TODO: realizar validaciones de entrada de datos
        let rslt= await usuariosModel.new(usuarioNombre, usuarioTelefono, usuarioCorreo, usuarioContraseña, usuarioDireccion, usuarioFechaNacimiento, usuarioSexo, usuarioAdmin, usuarioRegistrado, usuarioUltimoLog);
        res.status(200).json({status:'success', result: rslt});
    }catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed', error:ex});
    }
});

router.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        let userInDb = await usuariosModel.getByEmail(email);
        if(userInDb){
            console.log(userInDb)
            const isPasswordValid = await usuariosModel.comparePassword(password, userInDb.usuarioContrasena);
            if(isPasswordValid){
                const {email, roles, _id} = userInDb;
                const payload = {
                    jwt: jwt.sign({email, roles, _id}, process.env.JWT_SECRET),
                    user: {email, roles, _id}
                }
                res.status(200).json(payload);
            } else{
                res.status(400).json({status:'failed', error:2});
            }
        } else {
            res.status(400).json({status:'failed', error:1});
        }

    }catch(ex){
        console.log(ex);
        res.status(500).json({status:'failed'});
    }
});

module.exports = router;