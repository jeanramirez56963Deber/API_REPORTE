import express from 'express';
import path from 'path';
import cors from 'cors'; 
import { fileURLToPath } from 'url';
import usuarioRoutes from './routes/usuario.routes.js';      // <--- Usa "routes"
import reporteRoutes from './routes/reporte.routes.js';      // <--- Usa "routes"
import categoriasRoutes from './routes/categorias.routes.js';  // <--- Usa "routes"
import departamentosRoutes from "./routes/departamentos.routes.js";
import estadosRoutes from "./routes/estados.routes.js";
import personalRoutes from './routes/personal.routes.js';
import historialRoutes from './routes/historial.routes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Configuración de Middlewares (SIEMPRE PRIMERO) 🌟
app.use(cors()); 
app.use(express.json()); // Permite leer JSON
app.use(express.urlencoded({ extended: true })); // ¡Mover aquí para que lea los formularios! 🌟

// 2. Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Enrutadores de la API (AL FINAL)
app.use('/api', usuarioRoutes);
app.use('/api', reporteRoutes);
app.use('/api', categoriasRoutes);
app.use("/api", departamentosRoutes);
app.use("/api", estadosRoutes);
app.use("/api", personalRoutes);
app.use('/api', historialRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
export default app;