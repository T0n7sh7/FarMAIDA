const express = require('express');
const router = express.Router();
const {verifyApiHeaderToken} = require('./headerVerifyMiddleware')
const {passport, jwtMiddleware} = require('./seguridad/jwtHelper');

const presentacionesRoutes = require('./presentaciones/presentaciones');
const seguridadRouter = require('./seguridad/seguridad')
const inventariosRoutes = require('./inventarios/inventarios');
const laboratoriosRoutes = require('./laboratorios/laboratorios');
const ordenesRoutes = require('./ordenes/ordenes');
const productosRoutes = require('./productos/productos');
const farmaceuticasRoutes = require('./farmaceuticas/farmaceuticas');


router.use(passport.initialize());
//Public
router.use('/seguridad', seguridadRouter);
//middlewares
router.use('/inventarios',verifyApiHeaderToken,jwtMiddleware, inventariosRoutes);
router.use('/laboratorios',verifyApiHeaderToken,jwtMiddleware, laboratoriosRoutes);
router.use('/ordenes',verifyApiHeaderToken,jwtMiddleware, ordenesRoutes);
router.use('/productos',verifyApiHeaderToken,jwtMiddleware, productosRoutes);
router.use('/presentaciones',verifyApiHeaderToken,jwtMiddleware,presentacionesRoutes);
router.use('/farmaceuticas',verifyApiHeaderToken,jwtMiddleware,farmaceuticasRoutes);
module.exports = router;