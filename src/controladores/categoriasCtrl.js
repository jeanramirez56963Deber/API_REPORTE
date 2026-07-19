import { conmysql } from "../db.js";

// 1. Obtener todas las categorías para listarlas en el Frontend
// 1. Obtener todas las categorías para listarlas en el Frontend
export const getCategorias = async (req, res) => {
    try {
        // 🌟 CORRECCIÓN: Traemos los datos de la categoría y sumamos 'departamento_id' y el nombre del departamento
        const query = `
            SELECT 
                c.id, 
                c.nombre_categoria, 
                c.descripcion, 
                c.departamento_id, 
                d.nombre_dep
            FROM categorias c
            INNER JOIN departamentos d ON c.departamento_id = d.id
        `;
        
        const [categorias] = await conmysql.query(query);
        res.json(categorias);
    } catch (error) {
        console.error('Error en getCategorias:', error);
        res.status(500).json({ mensaje: 'Error al obtener las categorías de la base de datos' });
    }
};

export const postCategoria = async (req, res) => {
    try {
        const { nombre_categoria, descripcion, departamento_id } = req.body;

        if (!nombre_categoria) {
            return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio' });
        }

        const nuevaCategoria = {
            nombre_categoria,
            descripcion: descripcion || null,
            departamento_id: departamento_id || null // Así evitamos fallos si se envía vacío
        };

        const [resultado] = await conmysql.query('INSERT INTO categorias SET ?', [nuevaCategoria]);

        res.status(201).json({
            mensaje: '¡Nueva categoría añadida con éxito!',
            id_categoria: resultado.insertId
        });
    } catch (error) {
        console.error('Error en postCategoria:', error);
        res.status(500).json({ mensaje: 'Error interno al crear la categoría' });
    }
};