export interface BasicMessage {
    text: string
}

export interface AuthMessage extends BasicMessage {
    token: string
}

export interface WildMessage extends AuthMessage {
    numOfUsers: number
}