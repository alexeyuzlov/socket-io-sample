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

            socket.on('echo', (data) => {
                console.info('From echo', data);
            })

            socket.on(ChatEvent.Auth, (userName: string) => {
                const connection: Connection = new Connection(socket, room, userName);
                connection.onConnection();
            });
        });
    }
}
