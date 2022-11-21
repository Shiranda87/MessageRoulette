import { Document } from "mongoose"

export interface IOnlineUser extends Document {
    socketId: string
}