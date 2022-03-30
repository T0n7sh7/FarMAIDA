const express = require('express');
const router = express.Router();
const {verifyApiHeaderToken} = require('./headerVerifyMiddleware')
const {passport, jwtMiddleware} = require('./seguridad/jwtHelper');

const presentacionesRoutes = require('./presentaciones/presentaciones');
const seguridadRouter = require('./seguridad/seguridad')
const carritosRoutes = require('./carritos/carritos');
const inventariosRoutes = require('./inventarios/inventarios');
const laboratoriosRoutes = require('./laboratorios/laboratorios');
const ordenesRoutes = require('./ordenes/ordenes');
const productosRoutes = require('./productos/productos');


router.use(passport.initialize());
//Public
router.use('/seguridad', seguridadRouter);
//middlewares
router.use('/carritos',verifyApiHeaderToken,jwtMiddleware, carritosRoutes);
router.use('/inventarios',verifyApiHeaderToken,jwtMiddleware, inventariosRoutes);
router.use('/laboratorios',verifyApiHeaderToken,jwtMiddleware, laboratoriosRoutes);
router.use('/ordenes',verifyApiHeaderToken,jwtMiddleware, ordenesRoutes);
router.use('/productos',verifyApiHeaderToken,jwtMiddleware, productosRoutes);
router.use('/presentaciones',verifyApiHeaderToken,jwtMiddleware,presentacionesRoutes);

module.exports = router;