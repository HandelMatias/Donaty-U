import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    secure: true,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    },
});

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"DONATY-EC" <no-reply@donaty.ec>',
            to,
            subject,
            html,
        });

        console.log("Email enviado:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error enviando email:", error.message);
        throw error;
    }
};

export const sendMailToRecoveryPassword = (userMail, token) => {
    return sendMail(
        userMail,
        "Recupera tu contraseña - DONATY-EC",
        `
            <h1>DONATY-EC</h1>
            <p>Has solicitado restablecer tu contraseña.</p>

            <a href="${process.env.URL_FRONTEND}reset/${token}">
                Clic para restablecer tu contraseña
            </a>

            <hr>
            <footer>
                El equipo de DONATY-EC está aquí para ayudarte.
            </footer>
        `
    );
};

export default sendMail;
