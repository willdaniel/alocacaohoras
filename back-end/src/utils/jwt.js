import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

if (!SECRET) {
    throw new Error('SECRET não definido nas variáveis de ambiente (.env)');
}

// Função para gerar um token JWT
export const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, SECRET, { expiresIn });
};

// Função para verificar e decodificar um token JWT
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        // Mantém o tipo de erro para tratamento específico no middleware
        if (error.name === "TokenExpiredError") {
            error.statusCode = 401;
            error.message = "Token expirado";
            throw error;
        }
        error.statusCode = 401;
        error.message = "Token inválido ou expirado";
        throw error;
    }
};
