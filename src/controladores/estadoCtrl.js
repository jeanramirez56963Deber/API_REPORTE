import { conmysql } from "../db.js";

// Obtener todos los estados disponibles
export const getEstados = async (req, res) => {
    try {
        const query = 'SELECT id, nombre_estado FROM estados';
        const [estados] = await conmysql.query(query);
        res.json(estados);
    } catch (error) {
        console.error('Error en getEstados:', error);
        res.status(500).json({ mensaje: 'Error al obtener los estados de la base de datos' });
    }
};

// Crear un nuevo estado (por si el administrador quiere añadir otro en el futuro)
export const postEstado = async (req, res) => {
    try {
        const { nombre_estado } = req.body;

        if (!nombre_estado) {
            return res.status(400).json({ mensaje: 'El nombre del estado es obligatorio' });
        }

        const [resultado] = await conmysql.query('INSERT INTO estados SET ?', [{ nombre_estado }]);

        res.status(201).json({
            mensaje: '¡Nuevo estado creado con éxito!',
            id: resultado.insertId
        });
    } catch (error) {
        console.error('Error en postEstado:', error);
        res.status(500).json({ mensaje: 'Error interno al crear el estado' });
    }
};

// Actualizar un estado existente
export const putEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_estado } = req.body;

        if (!nombre_estado) {
            return res.status(400).json({ mensaje: 'El nombre del estado es obligatorio' });
        }

        const [resultado] = await conmysql.query('UPDATE estados SET nombre_estado = ? WHERE id = ?', [nombre_estado, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Estado no encontrado' });
        }

        res.json({ mensaje: '¡Estado actualizado con éxito!' });
    } catch (error) {
        console.error('Error en putEstado:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado' });
    }
};

// Eliminar un estado
export const deleteEstado = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conmysql.query('DELETE FROM estados WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Estado no encontrado' });
        }

        res.json({ mensaje: '¡Estado eliminado con éxito!' });
    } catch (error) {
        console.error('Error en deleteEstado:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el estado' });
    }
};