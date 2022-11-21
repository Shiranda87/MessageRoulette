export enum ServerEvent {
    Connection = 'connection',
    Disconnect = 'disconnect',
    CreateSessionToken = 'create-session-token',
    Spin = 'spin',
    Blast = 'blast',
    Wild = 'wild',
}

export enum ClientEvent {
    Message = 'message',
    ServerMessage = 'message-from-server',
}