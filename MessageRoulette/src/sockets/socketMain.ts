import socketIO, { Socket } from 'socket.io'
import { AuthService } from '../services/authService'
import { MessageRouletteService } from "../services/messageRouletteService"
import { ClientEvent, ServerEvent } from './eventsEnums'
import { AuthMessage, WildMessage } from './messageTypes'

export class SocketMain {
    private io: socketIO.Server
    private socket: Socket
    private messageRouletteService: MessageRouletteService
    private authService: AuthService

    public constructor(
        io: socketIO.Server,
        socket: Socket,
        messageRouletteService: MessageRouletteService,
        authService: AuthService
    ) {
        this.io = io
        this.socket = socket
        this.messageRouletteService = messageRouletteService
        this.authService = authService
    }

    public async createNewUser(
    ) {
        await this.messageRouletteService.createUser(this.socket.id)
        this.socket.emit(ClientEvent.ServerMessage, 'Welcome to Message Roulette')
        this.emitNewToken()
    }

    public socketMassageRouletteHandler(
    ) {
        this.socket.on(ServerEvent.CreateSessionToken, async () => {
            this.emitNewToken()
        })

        this.socket.on(ServerEvent.Spin, async (msg: AuthMessage) => {
            if (this.verifyToken(msg.token)) {
                await this.messageRandomUsers(1, msg.text)
            }
        })

        this.socket.on(ServerEvent.Wild, async (msg: WildMessage) => {
            if (this.verifyToken(msg.token)) {
                await this.messageRandomUsers(msg.numOfUsers, msg.text)
            }
        })

        this.socket.on(ServerEvent.Blast, async (msg: AuthMessage) => {
            if (this.verifyToken(msg.token)) {
                this.socket.broadcast.emit(ClientEvent.Message, msg.text)
            }
        })

        this.socket.on(ServerEvent.Disconnect, () => {
            this.messageRouletteService.deleteUser(this.socket.id)
            // Token is revoked because the socketId is changing in every connection
        })
    }

    private emitNewToken() {
        const token = this.authService.generateJWT(this.socket.id)
        this.socket.emit(ClientEvent.ServerMessage, `Your token is: ${token}`)
    }

    private verifyToken(token: string) {
        const isVerified = this.authService.verifyToken(token, this.socket.id)

        const message = isVerified ? 'Authenticated' : 'Invalid token'
        this.socket.emit(ClientEvent.ServerMessage, message)

        return isVerified
    }

    private async messageRandomUsers(
        numOfUsers: number,
        messageText: string
    ) {
        const randomUsers = await this.messageRouletteService.selectRandomUsers(numOfUsers, this.socket.id)

        if (randomUsers) {
            for (const user of randomUsers) {
                this.socket.to(user).emit(ClientEvent.Message, messageText)
            }
        }
        else {
            this.socket.emit(ClientEvent.ServerMessage, 'No other online users')

        }
    }
}


