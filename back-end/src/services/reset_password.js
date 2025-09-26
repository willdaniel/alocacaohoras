import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Carrega as variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const transporter = nodemailer.createTransport({
  host: "smtppro.zoho.com",
  port: 587, // Porta para TLS
  secure: false, // `false` para TLS
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
});

async function sendResetPasswordEmail(to, token) {
  const resetLink = `${process.env.FRONTEND_URL || "http://testrh.axisengenharia.com.br"}/reset-password?token=${token}`;
  const finalHtml = `
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link expirará em 1 hora.</p>
        <p>Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
    `;

  try {
    const info = await transporter.sendMail({
      from: `"Alocação de Horas Axis" <${process.env.ZOHO_USER}>`,
      to: to,
      subject: "Redefinição de Senha",
      html: finalHtml,
    });
    console.log(
      "E-mail de redefinição de senha enviado com sucesso!",
      info.messageId,
    );
  } catch (error) {
    console.error("Erro ao enviar e-mail de redefinição de senha:", error);
    throw new Error("Erro ao enviar e-mail de redefinição de senha.");
  }
}

async function sendPasswordChangedEmail(to) {
  const finalHtml = `
        <p>Sua senha foi alterada recentemente.</p>
        <p>Se você não realizou esta alteração, por favor, entre em contato com o administrador do sistema.</p>
    `;

  try {
    const info = await transporter.sendMail({
      from: `"Alocação de Horas Axis" <${process.env.ZOHO_USER}>`,
      to: to,
      subject: "Senha Alterada",
      html: finalHtml,
    });
    console.log(
      "E-mail de notificação de senha alterada enviado com sucesso!",
      info.messageId,
    );
  } catch (error) {
    console.error("Erro ao enviar e-mail de notificação de senha alterada:", error);
    throw new Error("Erro ao enviar e-mail de notificação de senha alterada.");
  }
}

export { sendResetPasswordEmail, sendPasswordChangedEmail };
