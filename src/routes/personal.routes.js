import { Router } from "express";
// Importa TODAS las funciones que creaste
import { 
    getPersonal, 
    postInsertarPersonal, 
    putPersonal, 
    deletePersonal, 
    loginPersonal, 
    getPersonalById,    // Nueva
    putEditarPerfil     // Nueva
} from "../controladores/personalCtrl.js";

const router = Router();

// Rutas generales
router.get("/personal", getPersonal);
router.post("/personal", postInsertarPersonal);
router.delete("/personal/:id", deletePersonal);
router.post("/login-personal", loginPersonal);

// NUEVAS RUTAS
router.get("/personal/:id", getPersonalById); // Para ver los datos de uno solo
router.put("/personal/:id", putPersonal);     // Edición general (admin)
router.put("/editar-perfil/:id", putEditarPerfil); // Edición de perfil (personal)

export default router;