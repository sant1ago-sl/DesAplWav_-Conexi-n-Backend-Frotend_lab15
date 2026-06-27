const { Op } = require("sequelize");
const { Product, Category } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const where = {};
    if (req.query.categoryId) {
      where.categoryId = req.query.categoryId;
    }
    if (req.query.search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${req.query.search}%` } },
        { descripcion: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const products = await Product.findAll({
      where,
      include: { model: Category, as: "category" },
    });
    res.json({
      success: true,
      message: "Productos obtenidos correctamente",
      data: products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      data: null,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: Category, as: "category" },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Producto obtenido correctamente",
      data: product,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener producto",
      data: null,
    });
  }
};

const validateCategory = async (categoryId) => {
  if (!categoryId) return true;
  const category = await Category.findByPk(categoryId);
  return Boolean(category);
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoryId, imageUrl } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: "Nombre y precio son requeridos",
        data: null,
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0",
        data: null,
      });
    }

    if (!(await validateCategory(categoryId))) {
      return res.status(400).json({
        success: false,
        message: "La categoría indicada no existe",
        data: null,
      });
    }

    const product = await Product.create({
      nombre,
      precio,
      descripcion,
      categoryId: categoryId || null,
      imageUrl: imageUrl || null,
    });

    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      data: product,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
      data: null,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoryId, imageUrl } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
        data: null,
      });
    }

    if (precio && precio <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0",
        data: null,
      });
    }

    if (!(await validateCategory(categoryId))) {
      return res.status(400).json({
        success: false,
        message: "La categoría indicada no existe",
        data: null,
      });
    }

    await product.update({
      nombre,
      precio,
      descripcion,
      categoryId: categoryId || null,
      imageUrl: imageUrl || null,
    });

    res.json({
      success: true,
      message: "Producto actualizado correctamente",
      data: product,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar producto",
      data: null,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
        data: null,
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: "Producto eliminado correctamente",
      data: null,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar producto",
      data: null,
    });
  }
};
