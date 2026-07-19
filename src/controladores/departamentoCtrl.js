import { conmysql } from '../db.js';

export const getDepartamentos = async (req, res) => {
    try {
        const [rows] = await conmysql.query('SELECT * FROM departamentos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener departamentos', error: error.message });
    }
};

export const postDepartamento = async (req, res) => {
    try {
        const { nombre } = req.body;
        const [result] = await conmysql.query('INSERT INTO departamentos (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ id: result.insertId, mensaje: 'Departamento registrado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
    }
};

export const putDepartamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        await conmysql.query('UPDATE departamentos SET nombre = ? WHERE id = ?', [nombre, id]);
        res.json({ mensaje: 'Departamento actualizado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
    }
};

export const deleteDepartamento = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM departamentos WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Departamento no encontrado' });
        }
        res.json({ mensaje: 'Departamento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error: error.message });
    }
};