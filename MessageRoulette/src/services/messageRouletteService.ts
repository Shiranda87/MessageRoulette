
import { IOnlineUser } from "../interfaces/onlineUserInterface"
import { OnlineUser } from "../models/onlineUserModel"

export class MessageRouletteService {
    public async createUser(socketId: string): Promise<IOnlineUser> {

        const onlineUser = {
            socketId
        }

        const newAUser = new OnlineUser(onlineUser)
        return await newAUser.save()
    }

    public async deleteUser(socketId: string) {
        await OnlineUser.findOneAndRemove(
            { socketId }
        ).exec()
    }

    public async selectRandomUsers(numOfUsers: number, currSocketId: string): Promise<Set<string> | undefined> {
        const allUsers = await this.getAll()
        const allSocketIds = allUsers.map(user => { return user.socketId })
        let randomUsers = new Set<string>()


        if (allUsers.length === 1) { //only current user is online
            return
        }

        if (allUsers.length <= numOfUsers) {
            randomUsers = new Set(allSocketIds)
        }
        else {
            let i = 0
            while (i < numOfUsers) {
                const random = Math.floor(Math.random() * allUsers.length)
                const socketId = allSocketIds[random]

                if (!randomUsers.has(socketId) && socketId !== currSocketId) {
                    randomUsers.add(socketId)
                    i++
                }
            }
        }

        return randomUsers
    }

    public async getAll() {
        return await OnlineUser.find({}).exec()
    }

    public async deleteAll() {
        await OnlineUser.deleteMany({}).exec()
    }
}