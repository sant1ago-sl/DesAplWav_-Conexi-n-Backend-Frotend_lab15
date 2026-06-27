const sequelize = require("../config/database");
const Role = require("./Role");
const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");

Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

module.exports = { sequelize, Role, User, Category, Product };
