import Ginecologo from "../models/Ginecologo.js";
import generarJWT from "../helpers/generarJWT.js";
import GenerarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    const exiteGinecologo = await Ginecologo.findOne({email});
    if(exiteGinecologo){
        const error = new Error("Ginecologo ya registrado");
        return res.status(400).json({msg: error.message});
    }

    try {
        const ginecologo = new Ginecologo(req.body);
        const ginecologoGuardado = await ginecologo.save();

        // Enviar el Email
        emailRegistro({
            email,
            nombre,
            token: ginecologoGuardado.token
        });

        res.json(ginecologoGuardado);
    } catch (error) {
        console.log(`error: ${error}`);
    }
};

const perfil = (req, res) => {

    const {ginecologo} = req;
    
    res.json(ginecologo);
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioEncontrado = await Ginecologo.findOne({token});

    if(!usuarioEncontrado){
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }

    try { 
        usuarioEncontrado.token = null;
        usuarioEncontrado.confirmado = true;
        await usuarioEncontrado.save();

        res.json({msg: "Ginecologo Confirmado Correctamente"});
    } catch (error) {
        console.log(`error: ${error}`);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuarioExiste = await Ginecologo.findOne({email});
    
    // Comprobar si existe
    if(!usuarioExiste){
        const error = new Error('El Usuario No Existe');
        return res.status(403).json({msg: error.message});
    }

    // Comprobar si esta confirmado
    if(!usuarioExiste.confirmado){
        const error = new Error('Usuario no ha sido confirmado');
        return res.status(403).json({msg: error.message});
    }

    // Autenticar el usuario
    if(await usuarioExiste.comprobarPassword(password)){
        res.json({
            _id: usuarioExiste._id,
            nombre: usuarioExiste.nombre,
            email: usuarioExiste.email,
            token: generarJWT(usuarioExiste.id)
        });
    }else{
        const error = new Error('Password Incorrecto');
        return res.status(403).json({msg: error.message});
    }
};

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const existeGinecologo = await Ginecologo.findOne({email});

    if(!existeGinecologo){
        const error = new Error('El Ginecologo No Existe');
        return res.status(403).json({msg: error.message});
    }

    try {
        existeGinecologo.token = GenerarId();
        await existeGinecologo.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeGinecologo.nombre,
            token: existeGinecologo.token
        })

        res.json({msg: 'Le enviamos al email instrucciones para su cambio de password'});
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};

const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const validarToken = await Ginecologo.findOne({token});

    if(validarToken){
        res.json({msg: 'Token Valido'});
    }else{
        const error = new Error('Token No Valido');
        res.status(400).json({msg: error.message});
    }
};

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const ginecologo = await Ginecologo.findOne({token});

    if(!ginecologo){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        ginecologo.token = null;
        ginecologo.password = password;
        await ginecologo.save();
        res.json({msg: 'Nueva Password modificada correctamente'});
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};

const actualizarPerfil = async (req, res) => {
    const ginecologo = await Ginecologo.findById(req.params.id);

    if(!ginecologo){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    const {email} = req.body;
    if(ginecologo.email !== req.body.email){
        const existeEmail = await Ginecologo.findOne({email});

        if(existeEmail){
            const error = new Error('Email ya está en uso');
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        ginecologo.nombre = req.body.nombre || ginecologo.nombre;
        ginecologo.email = req.body.email || ginecologo.email;
        ginecologo.web = req.body.web;
        ginecologo.telefono = req.body.telefono;

        const ginecologoActualizado = await ginecologo.save();
        res.json(ginecologoActualizado);
    } catch (error) {
        conole.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const {id} = req.ginecologo;
    const {pwd_actual, pwd_nuevo} = req.body;

    // Comprobar que el ginecologo existe
    const ginecologo = await Ginecologo.findById(id);

    if(!ginecologo){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    // Comprobar su password
    if(await ginecologo.comprobarPassword(pwd_actual)){
        // Almacenar el nuevo password
        ginecologo.password = pwd_nuevo;
        await ginecologo.save();
        res.json({msg: 'Password Almacenado Correctamente'})
    }else{
        const error = new Error('El Password actual es incorrecto');
        return res.status(400).json({msg: error.message});
    }   
}

export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword };