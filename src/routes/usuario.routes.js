import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.js';
import { login } from '../controladores/authCtrl.js';
import { getUsuario, getUsuarioxid, postInsertarUsuario, putUsuario, deleteUsuario,getUsuariosConRoles } from '../controladores/usuarioCtrl.js';
const router = Router();
router.post('/login', login);
router.post('/usuarios', postInsertarUsuario);
router.get('/usuarios', verificarToken, getUsuario);
router.get('/usuarios/:id', verificarToken, getUsuarioxid);
router.put('/usuarios/:id', verificarToken, putUsuario);

router.delete('/usuarios/:id', verificarToken, deleteUsuario);
router.get('/usuarios-roles', verificarToken, getUsuariosConRoles);
export default router;