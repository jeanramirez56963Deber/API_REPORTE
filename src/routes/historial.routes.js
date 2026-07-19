import { Router } from 'express';
import { registrarSolucion, getHistorialPorPersonal } from '../controladores/historialCtrl.js';
import multer from 'multer';
const router = Router();
const upload = multer({ dest: 'uploads/' });
// La ruta será POST /api/historial/registrar
router.post('/registrar', upload.single('file'), registrarSolucion);
router.get('/historial-personal/:id_personal', getHistorialPorPersonal);
export default router;