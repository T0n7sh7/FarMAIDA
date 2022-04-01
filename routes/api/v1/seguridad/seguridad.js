const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuarios = require('../../../../dao/usuario/usuarios.model');
const usuariosModel = new Usuarios();
const nodemailer = require("../../../../config/correo");

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

router.post('/recuperarcontraseña', async(req, res)=>{
    const {email} = req.body;
    if(!email){
        res.status(400).json({status:'failed', msg:"No se a ingresado un correo"})
    } else{
        const buscarCliente = await usuariosModel.getByEmail(email);
        const temppass='123456'
        if(buscarCliente){
            const rls = await usuariosModel.updatePassword(email,temppass);
            const data = {correo: buscarCliente.usuarioCorreo, contraseña:temppass}
            nodemailer.recuperarcontraseña(data);
            return res.status(200).json({status:'sucess', msg:"Correo enviado"});
        } else{
            res.status(400).json({status:'failed', msg:"No se a encontrado el correo"})
        }
    }
})
module.exports = router;