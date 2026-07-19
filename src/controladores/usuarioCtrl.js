import { conmysql } from "../db.js";
import crypto from 'crypto';

// GET: Obtener todos los usuarios sin join
export const getUsuario = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT id, cedula, nombre, apellido, correo, telefono, direccion_residencial, id_rol, fecha_registro FROM usuarios');
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al consultar usuarios" });
    }
};

// GET: Obtener usuario por ID
export const getUsuarioxid = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT id, cedula, nombre, apellido, correo, telefono, direccion_residencial, id_rol, fecha_registro FROM usuarios WHERE id = ?', [req.params.id]);
        if (result.length <= 0) return res.json({
            cant: 0,
            message: "Usuario no encontrado"
        });
        res.json({
            cantidad: result.length,
            informacion: result[0]
        });
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" });
    }
};

// POST: Registrar un nuevo usuario
export const postInsertarUsuario = async (req, res) => {
    try {
        const { cedula, nombre, apellido, correo, contrasena, telefono, direccion_residencial, id_rol } = req.body;

        // Validar campos requeridos
        if (!cedula || !nombre || !apellido || !correo || !contrasena || !direccion_residencial || !id_rol) {
            return res.status(400).json({
                message: 'Faltan campos requeridos',
                required: ['cedula', 'nombre', 'apellido', 'correo', 'contrasena', 'direccion_residencial', 'id_rol']
            });
        }

        // Encriptar la contraseña en SHA-256
        const hashContrasena = crypto
            .createHash('sha256')
            .update(contrasena)
            .digest('hex');

        const [result] = await conmysql.query(
            'INSERT INTO usuarios(cedula, nombre, apellido, correo, contrasena, telefono, direccion_residencial, id_rol) VALUES(?,?,?,?,?,?,?,?)',
            [cedula, nombre, apellido, correo, hashContrasena, telefono || null, direccion_residencial, id_rol]
        );
        res.send({ id: result.insertId });

    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "La cédula o el correo ya existen en el sistema" });
        }
        return res.status(500).json({ message: "error en el servidor" });
    }
};

// PUT: Actualizar datos de usuario
export const putUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula, nombre, apellido, correo, telefono, direccion_residencial, id_rol } = req.body;

        const [usuarioExiste] = await conmysql.query(
            'SELECT id FROM usuarios WHERE id = ?',
            [id]
        );

        if (usuarioExiste.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const [result] = await conmysql.query(
            `UPDATE usuarios 
             SET cedula=?, nombre=?, apellido=?, correo=?, telefono=?, direccion_residencial=?, id_rol=? 
             WHERE id=?`,
            [cedula, nombre, apellido, correo, telefono, direccion_residencial, id_rol, id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No se pudo actualizar el usuario' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// DELETE: Eliminar un usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM usuarios WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se pudo eliminar: El usuario no existe" });
        }

        return res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor al intentar eliminar" });
    }
};

// GET: Obtener todos los usuarios asociados a su Rol (Muestra nombre de rol)
export const getUsuariosConRoles = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.cedula,
        u.nombre,
        u.apellido,
        u.correo,
        u.telefono,
        u.direccion_residencial,
        u.id_rol,
        r.nombre_rol,
        u.fecha_registro
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol = r.id
      ORDER BY u.nombre ASC, u.apellido ASC;
    `;

    const [rows] = await conmysql.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios con roles:', error);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al cargar los usuarios del servidor' 
    });
  }
};