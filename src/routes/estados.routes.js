import { Router } from "express";
import { 
    getEstados, 
    postEstado, 
    putEstado, 
    deleteEstado 
} from "../controladores/estadoCtrl.js";

const router = Router();

router.get("/estados", getEstados);
router.post("/estados", postEstado);
router.put("/estados/:id", putEstado);
router.delete("/estados/:id", deleteEstado);

export default router;