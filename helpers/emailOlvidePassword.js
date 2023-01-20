import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
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
        subject: "Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `<p>Hola ${nombre}, has solicitado reestablecer tu passwrod</p>
                <p> Sigue el siguiente enlance para generar un nuevo password: <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password </p>
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
              `

      });
    console.log("Mnesaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;