import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { conmysql } from '../db.js';

export const login = async (req, res) => {
    try {
        // En tu nuevo diseño manejas 'correo' en lugar de un nickname de usuario
        const { correo, password } = req.body;

        console.log("Correo recibido:", correo);
        console.log("Password recibida:", password);

        const [rows] = await conmysql.query(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const usuarioDB = rows[0];

        console.log("Password enviada:", password);
        console.log("Password BD:", usuarioDB.contrasena);

        // Comparación directa usando tu método SHA-256
        const hashIngresado = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        if (hashIngresado !== usuarioDB.contrasena) {
            return res.status(401).json({
                mensaje: 'Contraseña incorrecta'
            });
        }

        const payload = {
            id: usuarioDB.id,
            nombre: usuarioDB.nombre,
            apellido: usuarioDB.apellido,      // 🌟 Agregado
            cedula: usuarioDB.cedula,          // 🌟 Agregado
            correo: usuarioDB.correo,
            telefono: usuarioDB.telefono,      // 🌟 Agregado
            direccion: usuarioDB.direccion_residencial, // 🌟
            id_rol: usuarioDB.id_rol // Guardamos el rol aquí para control de Ionic
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return res.json({
            mensaje: 'Login correcto',
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Error en el servidor'
        });
    }
};
