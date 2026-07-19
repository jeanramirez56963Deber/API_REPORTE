import { conmysql } from '../db.js'; 

// 🌟 1. GET: Obtener todos los reportes para pintar marcadores en Ionic (Mapa)
export const getReportes = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id,
        r.id_usuario,
        r.id_categoria,
        c.nombre_categoria,
        r.id_estado,
        e.nombre_estado,
        r.id_departamento,
        r.descripcion,
        r.latitud,
        r.longitud,
        r.url_imagen,
        r.fecha_creacion
      FROM reportes r
      INNER JOIN categorias c ON r.id_categoria = c.id
      INNER JOIN estados e ON r.id_estado = e.id
      ORDER BY r.fecha_creacion DESC
    `;

    const [rows] = await conmysql.query(query);

    // Mandamos el arreglo directo para evitar el error .forEach del frontend
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al cargar los reportes del servidor' 
    });
  }
};

// 🌟 2. POST: Crear un nuevo reporte desde el celular
export const crearReporte = async (req, res) => {
  try {
    // Extraer campos de req.body
    let { id_usuario, id_categoria, id_estado, id_departamento, descripcion, latitud, longitud } = req.body;

    // Validación de presencia antes de transformar
    if (!id_usuario || !id_categoria || !descripcion || !latitud || !longitud) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Faltan campos obligatorios.' 
      });
    }

    // Convertir explícitamente a números para evitar que MySQL proteste si está en modo estricto
    const usuarioId = Number(id_usuario);
    const categoriaId = Number(id_categoria);
    const estadoFormateado = id_estado ? Number(id_estado) : 1;
    const deptoFormateado = (id_departamento === '' || !id_departamento || id_departamento === 'null') ? null : Number(id_departamento);

    // Ruta de la imagen
    const url_imagen = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';

    const query = `
      INSERT INTO reportes (id_usuario, id_categoria, id_estado, id_departamento, descripcion, latitud, longitud, url_imagen) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Ejecutamos con los valores numéricos ya listos
    const [resultado] = await conmysql.query(query, [
      usuarioId, 
      categoriaId, 
      estadoFormateado, 
      deptoFormateado, 
      descripcion, 
      latitud, 
      longitud, 
      url_imagen 
    ]);

    res.status(201).json({
      ok: true,
      mensaje: 'Reporte comunitario creado con éxito',
      id_reporte: resultado.insertId
    });

  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Fallo en la BD: ' + error.message
    });
  }
};

// 🌟 3. GET: Obtener reportes creados por un usuario específico
export const obtenerReportesPorUsuario = async (req, res) => {
    // Capturamos el id del usuario que viene en la URL
    const { id_usuario } = req.params; 

    try {
        const query = `
          SELECT 
            r.id,
            r.id_usuario,
            r.id_categoria,
            c.nombre_categoria,
            r.id_estado,
            e.nombre_estado,
            r.id_departamento,
            r.descripcion,
            r.latitud,
            r.longitud,
            r.url_imagen,
            r.fecha_creacion
          FROM reportes r
          INNER JOIN categorias c ON r.id_categoria = c.id
          INNER JOIN estados e ON r.id_estado = e.id
          WHERE r.id_usuario = ?
          ORDER BY r.fecha_creacion DESC
        `;
        
        const [rows] = await conmysql.query(query, [id_usuario]);

        res.status(200).json({
            ok: true,
            total: rows.length,
            reportes: rows
        });

    } catch (error) {
        console.error('Error al obtener reportes por usuario:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error del servidor al obtener los reportes del usuario.'
        });
    }
};

// 🌟 4. GET: Obtener todos los reportes para la tabla de administración con LEFT JOIN seguro
export const getTodosReportes = async (req, res) => {
    try {
        const query = `
            SELECT 
                r.id, 
                r.descripcion, 
                r.fecha_creacion, 
                r.id_estado, 
                e.nombre_estado, 
                c.nombre_categoria
            FROM reportes r
            LEFT JOIN estados e ON r.id_estado = e.id
            LEFT JOIN categorias c ON r.id_categoria = c.id
            ORDER BY r.fecha_creacion DESC
        `;
        const [reportes] = await conmysql.query(query);
        res.json(reportes);
    } catch (error) {
        console.error('Error detallado en getTodosReportes:', error);
        res.status(500).json({ 
            mensaje: 'Error al obtener los reportes del servidor',
            error: error.message 
        });
    }
};

// 🌟 5. PUT: Cambiar el estado de un reporte de forma segura (con bypass si no existe tabla de historial)
export const cambiarEstadoReporte = async (req, res) => {
    try {
        const { id } = req.params; // ID del reporte
        const { id_estado } = req.body; // Nuevo ID del estado

        if (!id_estado) {
            return res.status(400).json({ mensaje: 'El ID del estado es obligatorio' });
        }

        // 1. Actualizar el reporte en la tabla principal
        const [resultado] = await conmysql.query(
            'UPDATE reportes SET id_estado = ? WHERE id = ?', 
            [id_estado, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }

        // 2. Intentar registrar en el historial si la tabla existe
        try {
            const queryHistorial = `
                INSERT INTO historial_reportes (id_reporte, id_estado, fecha_cambio) 
                VALUES (?, ?, NOW())
            `;
            await conmysql.query(queryHistorial, [id, id_estado]);
        } catch (errHistorial) {
            console.warn('Nota: No se pudo registrar en historial_reportes (posiblemente la tabla no existe):', errHistorial.message);
        }

        res.json({ mensaje: '¡Estado del reporte actualizado con éxito!' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ mensaje: 'Error interno al actualizar el estado del reporte' });
    }
};
export const obtenerReportesPorDepartamento = async (req, res) => {
    const { id_departamento } = req.params;

    try {
        const query = `
            SELECT 
                r.*, 
                c.nombre_categoria, 
                e.nombre_estado
            FROM reportes r
            INNER JOIN categorias c ON r.id_categoria = c.id
            INNER JOIN estados e ON r.id_estado = e.id
            WHERE r.id_departamento = ?
            ORDER BY r.fecha_creacion DESC
        `;
        
        const [rows] = await conmysql.query(query, [id_departamento]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener reportes por departamento:', error);
        res.status(500).json({ 
            ok: false, 
            mensaje: 'Error al cargar los reportes del departamento' 
        });
    }
};
    export const obtenerReportesPorPersonal = async (req, res) => {
        // Recibe el ID del personal logueado (el que guardaste en localStorage)
        console.log("ENTRÓ A LA FUNCIÓN CORRECTA");
        const { id_personal } = req.params;

        try {
            const query = `
                SELECT 
                    p.nombre AS nombre_personal, 
                    d.nombre_dep, 
                    c.nombre_categoria, 
                    r.*,
                    e.nombre_estado
                FROM personal_departamento p 
                JOIN departamentos d ON p.departamento_id = d.id 
                JOIN categorias c ON d.id = c.departamento_id 
                JOIN reportes r ON c.id = r.id_categoria 
                JOIN estados e ON r.id_estado = e.id
                WHERE p.id = ?
                ORDER BY r.fecha_creacion DESC
            `;
            
            const [rows] = await conmysql.query(query, [id_personal]);
            console.log("CAMPOS RECIBIDOS:", Object.keys(rows[0]));
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error al obtener reportes por personal:', error);
            res.status(500).json({ ok: false, mensaje: 'Error al obtener reportes' });
        }
    };
    // Agrega esta función en tu controlador
export const getReportePorId = async (req, res) => {
    try {
        const { id } = req.params; // Capturamos el ID de la URL
        const query = `
            SELECT r.*, c.nombre_categoria, e.nombre_estado 
            FROM reportes r
            INNER JOIN categorias c ON r.id_categoria = c.id
            INNER JOIN estados e ON r.id_estado = e.id
            WHERE r.id = ?
        `;
        const [rows] = await conmysql.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Reporte no encontrado' });
        }
        
        res.json(rows[0]); // Retorna el objeto único del reporte
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        res.status(500).json({ mensaje: 'Error al obtener el detalle' });
    }
};
export const getHistorialPorReporte = async (req, res) => {
    try {
        const { id } = req.params;
        // Prueba con esta consulta básica para descartar errores de columnas
        const query = "SELECT * FROM historial_reportes WHERE id_reporte = ?";
        const [rows] = await conmysql.query(query, [id]);
        res.json(rows);
    } catch (error) {
        console.error('Error detallado:', error); // <--- ESTO TE DARA LA PISTA EN LA CONSOLA
        res.status(500).json({ error: error.message });
    }
};
export const getDetalleCompleto = async (req, res) => {
    try {
        const { id } = req.params; // ID del reporte
        
        // 1. Obtenemos el reporte base
        const [reporte] = await conmysql.query('SELECT * FROM reportes WHERE id = ?', [id]);
        
        // 2. Obtenemos todo su historial
        const [historial] = await conmysql.query(`
            SELECT comentario, url_imagen_evidencia, fecha_cambio 
            FROM historial_reportes 
            WHERE id_reporte = ? 
            ORDER BY fecha_cambio DESC`, [id]);
        
        // 3. Unimos todo en un solo objeto
        if (reporte.length > 0) {
            const resultado = {
                ...reporte[0],
                historial: historial
            };
            res.json(resultado);
        } else {
            res.status(404).json({ mensaje: "Reporte no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};