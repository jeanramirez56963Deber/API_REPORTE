import { conmysql } from "../db.js";

export const registrarSolucion = async (req, res) => {
    // 1. Obtenemos los datos del body y el archivo de req.file
    const { id_reporte, id_usuario_cambio, comentario } = req.body;
    
    // Si multer procesó el archivo, req.file.filename tendrá el nombre generado
    const url_imagen = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // 2. Insertar en el historial usando la variable 'url_imagen'
        const queryHistorial = `
            INSERT INTO historial_reportes (id_reporte, id_usuario_cambio, comentario, url_imagen_evidencia) 
            VALUES (?, ?, ?, ?)
        `;
        await conmysql.query(queryHistorial, [id_reporte, id_usuario_cambio, comentario, url_imagen]);

        // 3. Actualizar el estado en la tabla reportes
        const queryUpdate = "UPDATE reportes SET id_estado = 4 WHERE id = ?";
        await conmysql.query(queryUpdate, [id_reporte]);

        res.status(200).json({ message: "Solución registrada correctamente" });
    } catch (error) {
        console.error("Error al registrar:", error);
        res.status(500).json({ error: error.message });
    }
};
export const getHistorialPorPersonal = async (req, res) => {
    const { id_personal } = req.params;
    try {
        const query = `
            SELECT 
                p.nombre AS nombre_personal, 
                d.nombre_dep, 
                c.nombre_categoria, 
                r.*, 
                h.*,
                e.nombre_estado  -- <--- ESTO ES LO QUE FALTABA
            FROM personal_departamento p 
            JOIN departamentos d ON p.departamento_id = d.id 
            JOIN categorias c ON d.id = c.departamento_id 
            JOIN reportes r ON c.id = r.id_categoria 
            LEFT JOIN historial_reportes h ON r.id = h.id_reporte 
            JOIN estados e ON r.id_estado = e.id  -- <--- ESTE JOIN UNE LA TABLA ESTADOS
            WHERE p.id = ? 
            ORDER BY r.fecha_creacion DESC, h.fecha_cambio DESC
        `;
        const [rows] = await conmysql.query(query, [id_personal]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};