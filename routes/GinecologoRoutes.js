import express from "express";
const router = express.Router();
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from "../controllers/GinecologoControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Area publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// Area privada
router.get("/perfil", authMiddleware, perfil);
router.put("/perfil/:id", authMiddleware, actualizarPerfil);
router.put("/actualizar-password", authMiddleware, actualizarPassword);

export default router;