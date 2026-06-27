const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const { signToken } = require("../utils/jwt");

const toUserDTO = (user, roleName) => ({
  id: user.id,
  nombre: user.nombre,
  email: user.email,
  role: roleName,
});

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nombre, email y contraseña son requeridos",
        data: null,
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una cuenta con ese email",
        data: null,
      });
    }

    const role = await Role.findOne({ where: { name: "CUSTOMER" } });
    if (!role) {
      return res.status(500).json({
        success: false,
        message: "El rol CUSTOMER no está configurado. Ejecuta el seed primero.",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      roleId: role.id,
    });

    const token = signToken({ id: user.id, role: role.name });

    res.status(201).json({
      success: true,
      message: "Cuenta creada correctamente",
      data: { token, user: toUserDTO(user, role.name) },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      data: null,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
        data: null,
      });
    }

    const user = await User.findOne({ where: { email }, include: Role });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
        data: null,
      });
    }

    const token = signToken({ id: user.id, role: user.Role.name });

    res.json({
      success: true,
      message: "Sesión iniciada correctamente",
      data: { token, user: toUserDTO(user, user.Role.name) },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      data: null,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: Role });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Usuario obtenido correctamente",
      data: toUserDTO(user, user.Role.name),
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      data: null,
    });
  }
};
