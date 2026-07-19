import { conmysql } from '../db.js'; // Usamos conmysql
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Obtener todo el personal
export const getPersonal = async (req, res) => {
    try {
        const [rows] = await conmysql.query('SELECT * FROM personal_departamento');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener personal', error: error.message });
    }
};

// 2. Insertar personal
export const postInsertarPersonal = async (req, res) => {
    try {
        const { cedula, nombre, apellido, correo, contrasena, departamento_id } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashContrasena = await bcrypt.hash(contrasena, salt);

        const [result] = await conmysql.query(
            'INSERT INTO personal_departamento (cedula, nombre, apellido, correo, contrasena, departamento_id) VALUES (?, ?, ?, ?, ?, ?)',
            [cedula, nombre, apellido, correo, hashContrasena, departamento_id]
        );

        res.status(201).json({ id: result.insertId, mensaje: 'Personal registrado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar personal', error: error.message });
    }
};

// 3. Editar personal
export const putPersonal = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, departamento_id } = req.body;
        
        await conmysql.query(
            'UPDATE personal_departamento SET nombre = ?, apellido = ?, correo = ?, departamento_id = ? WHERE id = ?',
            [nombre, apellido, correo, departamento_id, id]
        );
        res.json({ mensaje: 'Personal actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar personal', error: error.message });
    }
};

// 4. Eliminar personal
export const deletePersonal = async (req, res) => {
    try {
        const { id } = req.params;
        await conmysql.query('DELETE FROM personal_departamento WHERE id = ?', [id]);
        res.json({ mensaje: 'Personal eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar personal', error: error.message });
    }
};
export const loginPersonal = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        const [rows] = await conmysql.query('SELECT * FROM personal_departamento WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const personal = rows[0];

        // AQUÍ ESTÁ EL CAMBIO: Usamos bcrypt.compare
        const esValida = await bcrypt.compare(contrasena, personal.contrasena);

        if (!esValida) {
            console.log('Error: Contraseña incorrecta');
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        // Si todo es correcto
        console.log('Login exitoso');
        return res.status(200).json({ message: "Login exitoso", personal });

    } catch (error) {
        console.error("Error en servidor:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const getPersonalById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await conmysql.query('SELECT id, cedula, nombre, apellido, correo, departamento_id FROM personal_departamento WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Personal no encontrado" });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos del personal', error: error.message });
    }
};
// Editar perfil del personal (propio)
export const putEditarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        // Agregamos departamento_id aquí también
        const { nombre, apellido, correo, departamento_id } = req.body; 
        
        const [result] = await conmysql.query(
            'UPDATE personal_departamento SET nombre = ?, apellido = ?, correo = ?, departamento_id = ? WHERE id = ?',
            [nombre, apellido, correo, departamento_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }

        res.json({ mensaje: 'Perfil actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message });
    }
};