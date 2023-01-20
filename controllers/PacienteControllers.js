import Paciente from "../models/Paciente.js"

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.ginecologo = req.ginecologo._id;

    try {
        const pacienteAlmacenado = await paciente.save();

        console.log(pacienteAlmacenado);
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where("ginecologo").equals(req.ginecologo);

    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(400).json({msg: 'Paciente No Encontrado'});
    }

    if(paciente.ginecologo._id.toString() !== req.ginecologo._id.toString()){
        return res.json({msg: 'Accion No Valida'});
    }

    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(400).json({msg: 'Paciente No Encontrado'});
    }

    if(paciente.ginecologo._id.toString() !== req.ginecologo._id.toString()){
        return res.json({msg: 'Accion No Valida'});
    }

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado); 
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

const eliminarPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(400).json({msg: 'Paciente No Encontrado'});
    }

    if(paciente.ginecologo._id.toString() !== req.ginecologo._id.toString()){
        return res.json({msg: 'Accion No Valida'});
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado Correctamente'});
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

export {agregarPaciente, 
        obtenerPacientes, 
        obtenerPaciente, 
        actualizarPaciente, 
        eliminarPaciente}