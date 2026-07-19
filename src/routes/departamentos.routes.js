import { Router } from "express";
import { 
    getDepartamentos, 
    postDepartamento, 
    putDepartamento, 
    deleteDepartamento 
} from "../controladores/departamentoCtrl.js"; // Asegúrate de que la ruta del import sea la correcta

const router = Router();

router.get("/departamentos", getDepartamentos);
router.post("/departamentos", postDepartamento);
router.put("/departamentos/:id", putDepartamento);
router.delete("/departamentos/:id", deleteDepartamento);

export default router;