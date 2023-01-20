import mongoose from "mongoose";

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true
    },
    ginecologo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ginecologo'
    }
},
    {
        timestamps: true
    }
);

const Paciente = mongoose.model('Paciente', pacienteSchema);
export default Paciente;