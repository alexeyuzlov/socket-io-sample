import { Server, Socket } from 'socket.io';
import { ChatEvent } from './entities';
import { Connection } from './connection';

export class ChatServer {
    constructor(
        private _io: Server,
    ) {
    }

    public init() {
        this._io.on(ChatEvent.Connection, (socket: Socket) => {
            socket.on(ChatEvent.Auth, (userName: string) => {
                const room: string = 'room1';
                const connection: Connection = new Connection(this._io, socket, room, userName);
                connection.onConnection();
            });
        });
    }
}
