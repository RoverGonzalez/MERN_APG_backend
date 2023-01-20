import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import routerGinecologos from "./routes/GinecologoRoutes.js";
import routerPacientes from "./routes/PacienteRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = ["http://localhost:5173"];

const corsOptions = {
    origin: function (origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true);
        }else{
            callback(new Error('No permitido por CORS'));
        }
    },
};

app.use(cors(corsOptions));

app.use("/api/ginecologos", routerGinecologos);
app.use("/api/pacientes", routerPacientes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando tranquilamente en el puerto ${PORT} *-*`);
});