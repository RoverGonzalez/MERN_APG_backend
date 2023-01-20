import express from "express";
import {
    agregarPaciente, 
    obtenerPacientes, 
    obtenerPaciente, 
    actualizarPaciente, 
    eliminarPaciente
} from "../controllers/PacienteControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.route('/')
    .post(authMiddleware, agregarPaciente)
    .get(authMiddleware, obtenerPacientes);

router.route('/:id')
    .get(authMiddleware, obtenerPaciente)
    .put(authMiddleware, actualizarPaciente)
    .delete(authMiddleware, eliminarPaciente)

export default router;