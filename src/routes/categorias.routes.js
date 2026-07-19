// src/routes/categorias.routes.js
import { Router } from 'express';
import { getCategorias, postCategoria } from '../controladores/categoriasCtrl.js';
import { verificarToken } from '../middlewares/auth.js'; // Opcional para proteger la creación

const router = Router();

// Endpoint público para que Ionic descargue las opciones del formulario
router.get('/categorias', getCategorias);

// Endpoint protegido para cuando implementes la creación desde el rol admin
router.post('/categorias', verificarToken, postCategoria);

export default router;