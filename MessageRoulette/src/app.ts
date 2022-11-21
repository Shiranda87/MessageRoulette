import express from "express"
import http from 'http'
import mongoose from "mongoose"
import socketIO, { Socket } from 'socket.io'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'
import { MONGO_URL, REDIS_URL, PORT } from "./constants/constants"
import { SocketMain } from "./sockets/socketMain"
import { ServerEvent } from "./sockets/eventsEnums"
import { MessageRouletteService } from "./services/messageRouletteService"
import { AuthService } from "./services/authService"

class App {
    private server: http.Server
    public io: socketIO.Server
    private port: number
    constructor(port: number) {
        this.port = port

        const app = express()
        this.server = new http.Server(app)

        this.setMongoConfig()
        this.setSocketIOConfig()
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}`)
    }

    private setMongoConfig() {
        mongoose.connect(MONGO_URL)
    }

    private setSocketIOConfig() {
        this.io = new socketIO.Server(this.server, {
            allowEIO3: true
        })

        const pubClient = createClient({ url: REDIS_URL })
        const subClient = pubClient.duplicate()

        Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
            this.io.adapter(createAdapter(pubClient, subClient))
        })

        const messageRouletteService = new MessageRouletteService()
        const authService = new AuthService()

        this.io.on(ServerEvent.Connection, async (socket: Socket) => {
            const socketMain = new SocketMain(this.io, socket, messageRouletteService, authService)
            await socketMain.createNewUser()
            socketMain.socketMassageRouletteHandler()
        })
    }
}

export default new App(PORT)