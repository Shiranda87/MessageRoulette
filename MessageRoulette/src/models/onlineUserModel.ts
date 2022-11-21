
import { IOnlineUser } from "../interfaces/onlineUserInterface"
import { model, Schema } from "mongoose"

const OnlineUserSchema = new Schema({
    socketId: { type: String, required: true },
})

export const OnlineUser = model<IOnlineUser>("OnlineUser", OnlineUserSchema)