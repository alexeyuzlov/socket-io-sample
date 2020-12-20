import { Server, Socket } from 'socket.io';
import { ChatEvent } from './entities';
import { Connection } from './connection';
import { getRandom } from './utils';

export class ChatServer {
    constructor(
        private _io: Server,
        private _rooms: string[]
    ) {
    }

    public init() {
        this._io.on(ChatEvent.Connection, (socket: Socket) => {
            const room: string = getRandom(this._rooms);

            const connection: Connection = new Connection(socket, room);
            connection.onConnection();
        });
    }
}
