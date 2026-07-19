import { Router } from "express";
import { crearReporte, getReportes, obtenerReportesPorUsuario, getTodosReportes, cambiarEstadoReporte, obtenerReportesPorDepartamento, obtenerReportesPorPersonal,getReportePorId,getHistorialPorReporte } from "../controladores/reporteCtrl.js";
import upload from "../middlewares/uploads.js";

const router = Router();
router.get("/reportes", getReportes);
router.get('/reportes/usuario/:id_usuario', obtenerReportesPorUsuario);
router.post('/reportes', upload.single('url_imagen'), crearReporte);
router.get("/reportes-admin", getTodosReportes);
router.put("/reportes/:id/estado", cambiarEstadoReporte);
router.get('/reportes-departamento/:id_departamento', obtenerReportesPorDepartamento);
router.get('/reportes/personal/:id_personal', obtenerReportesPorPersonal);
// Asegúrate de importar getReportePorId y luego:
router.get('/reportes/:id', getReportePorId);
router.get('/reportes/:id/historial', getHistorialPorReporte);
export default router;