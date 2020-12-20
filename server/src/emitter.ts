import { ChatEvent, toChatMessage } from './entities';
import { Server } from 'socket.io';

export class LiveEmitter {
    constructor(
        private _io: Server,
        private _rooms: string[]
    ) {
    }

    public init() {
        return;

        setInterval(() => {
            this._io.to('ivan').emit(ChatEvent.Message, toChatMessage({text: 'Only for ivan'}));
            this._io.to('alexey').emit(ChatEvent.Message, toChatMessage({text: 'Only for alexey'}));
        }, 2000);

        this._rooms.forEach((room, i) => {
            setInterval(() => {
                this._io.to(room).emit(ChatEvent.Message, toChatMessage({text: `to ${room}`}));
            }, 2000 + i * 1000);
        });

        setInterval(() => {
            this._io.emit(ChatEvent.Message, toChatMessage({text: 'To all rooms'}));
        }, 7000);
    }
}
