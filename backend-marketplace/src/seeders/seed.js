const bcrypt = require("bcryptjs");
const { sequelize, Role, User, Product } = require("../models");

const productosDePrueba = [
  { nombre: "Laptop Lenovo ThinkPad", precio: 2899.9, descripcion: "Laptop empresarial, 16GB RAM, 512GB SSD" },
  { nombre: "Mouse Logitech MX Master 3", precio: 249.0, descripcion: "Mouse inalámbrico ergonómico" },
  { nombre: "Teclado Mecánico Redragon", precio: 159.5, descripcion: "Teclado mecánico RGB switches rojos" },
  { nombre: "Monitor Samsung 27 pulgadas", precio: 899.0, descripcion: "Monitor Full HD 75Hz" },
  { nombre: "Audífonos Sony WH-1000XM4", precio: 1199.99, descripcion: "Audífonos con cancelación de ruido" },
  { nombre: "Disco SSD Kingston 1TB", precio: 339.0, descripcion: "Unidad de estado sólido NVMe" },
  { nombre: "Webcam Logitech C920", precio: 219.9, descripcion: "Cámara web Full HD 1080p" },
  { nombre: "Silla Ergonómica Oficina", precio: 749.0, descripcion: "Silla con soporte lumbar ajustable" },
  { nombre: "Router TP-Link Archer C6", precio: 179.0, descripcion: "Router WiFi dual band AC1200" },
  { nombre: "Impresora HP DeskJet", precio: 459.9, descripcion: "Impresora multifuncional a color" },
];

const seedRolesAndAdmin = async () => {
  const [customerRole] = await Role.findOrCreate({ where: { name: "CUSTOMER" } });
  const [adminRole] = await Role.findOrCreate({ where: { name: "ADMIN" } });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@marketplace.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      nombre: "Administrador",
      email: adminEmail,
      password: hashedPassword,
      roleId: adminRole.id,
    });
    console.log(`Usuario admin creado: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Usuario admin ya existía, no se duplicó");
  }

  return { customerRole, adminRole };
};

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida");

    await sequelize.sync({ alter: true });

    await seedRolesAndAdmin();

    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate(productosDePrueba);
      console.log(`${productosDePrueba.length} productos de prueba insertados correctamente`);
    } else {
      console.log("Ya existen productos, no se insertaron productos de prueba");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error al insertar datos de prueba:", error);
    process.exit(1);
  }
};

seed();
