import { ChatEvent, toChatMessage } from './entities';
import { Server } from 'socket.io';

export class LiveEmitter {
    constructor(
        private _io: Server,
    ) {
    }

    public init() {
        setInterval(() => {
            this._io.emit(ChatEvent.Message, toChatMessage({text: 'To all rooms'}));
        }, 5000);
    }
}
