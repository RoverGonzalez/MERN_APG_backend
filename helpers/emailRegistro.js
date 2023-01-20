import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      const {email, nombre, token} = datos;

      const info = await transport.sendMail({
        from: "APG - Administrador de Pacientes Ginecológicos",
        to: email,
        subject: "Comprueba tu cuenta APG",
        text: "Comprueba tu cuenta APG",
        html: `<p>Hola ${nombre}, comprueba tu cuenta en APG</p>
                <p> Tu cuenta ya está lista, solo debes comprobar en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta </p>
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
              `

      });
    console.log("Mnesaje enviado: %s", info.messageId);
};

export default emailRegistro;