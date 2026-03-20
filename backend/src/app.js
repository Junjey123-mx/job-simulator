const express = require("express");
const dotenv = require("dotenv");
const { testConnection, initializeSchema, closePool } = require("./db");
const productsRouter = require("./routes/products");

dotenv.config();

const APP_PORT = Number(process.env.APP_PORT || 8080);

const app = express();

// CORS — permite que el frontend (cualquier origen) consuma la API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Parseo de JSON — Express maneja bodies malformados y devuelve 400
app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
    next();
  });
});

// Rutas del recurso
app.use("/products", productsRouter);

// 404 para rutas no reconocidas
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

async function startServer() {
  try {
    await testConnection();
    await initializeSchema();
    app.listen(APP_PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${APP_PORT}`);
    });
  } catch (error) {
    const msg = error.message || error.code || String(error);
    console.error("No se pudo iniciar la aplicación:", msg);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  console.log("\nCerrando aplicación...");
  await closePool();
  process.exit(0);
});
