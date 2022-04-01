const nodemailer = require('nodemailer');
const { htmlP } = require('./htmlcorreo');
exports.recuperarcontraseña = async(data)=>{
    const configurarCorreo ={
        from:process.env.APP_CORREO,
        to:data.correo,
        subject: "Recuperar Contraseña",
        html: htmlP(data.contraseña)
    }
    const transporte = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: process.env.APP_CORREO,
            pass: process.env.CORREO_CONTRASENA,
        }
    })

    transporte.verify(function(error, success){
        if(error){
            console.log(error)
            return
        } else{
            console.log("El servidor puede enviar mensajes")
            return
        }
    })
    return await transporte.sendMail(configurarCorreo)
}