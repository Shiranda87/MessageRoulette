import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../constants/constants"

export class AuthService {
    public generateJWT(socketId: string) {
        const payload = {
            socketId,
        }

        return jwt.sign(payload, SECRET_KEY, { expiresIn: '900s' })
    }

    public verifyToken(token: string, socketId: string) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload

            // Revoke previous tokens or other users' tokens
            if (decoded.socketId === socketId) {
                return true
            }
            return false

        } catch (error) {
            return false
        }
    }
}

interface JwtPayload {
    socketId: string,
}