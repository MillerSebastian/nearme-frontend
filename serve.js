import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos desde la carpeta dist
app.use(express.static(join(__dirname, "dist")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Servir el index.html para todas las rutas (SPA)
app.get("*", (req, res) => {
  try {
    const indexPath = join(__dirname, "dist", "index.html");
    const indexContent = readFileSync(indexPath, "utf8");
    res.send(indexContent);
  } catch (error) {
    console.error("Error serving index.html:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor NearMe ejecutándose en puerto ${PORT}`);
  console.log(`📱 Aplicación disponible en: http://localhost:${PORT}`);
  console.log(`🏥 Health check en: http://localhost:${PORT}/health`);
});

// Manejo de señales de terminación
process.on("SIGTERM", () => {
  console.log("🛑 Recibida señal SIGTERM, cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Recibida señal SIGINT, cerrando servidor...");
  process.exit(0);
});
