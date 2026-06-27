const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");

const app = express();

// Middlewares
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("No permitido por CORS"));
  },
  credentials: true,
}));
app.use(express.json());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "API E-commerce funcionando" });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
