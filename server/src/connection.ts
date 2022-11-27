import { Server, Socket } from 'socket.io';
import { ChatEvent, IChatMessage, toChatMessage } from './entities';
import { saveMessage } from './api';

export class Connection {
    constructor(
        private _io: Server,
        private _socket: Socket,
        private _room: string,
        private _userName: string
    ) {
    }

    public onConnection() {
        console.log(ChatEvent.Connection, this._userName, 'roomId:', this._room);

        this._socket.join([this._room, this._userName]);

        this._io.to(this._room).emit(ChatEvent.Notification, {
            message: 'new user connected',
            room: this._room,
            userName: this._userName,
        });

        this._socket.on(ChatEvent.Disconnect, this.onDisconnect.bind(this));
        this._socket.on(ChatEvent.Message, this.onMessage.bind(this));
    }

    public onMessage(msgRaw, cb: (msg: IChatMessage) => void) {
        const preparedMsg: IChatMessage = toChatMessage(msgRaw);

        if (cb) {
            cb(preparedMsg);
        }

        saveMessage(preparedMsg).then(
            () => this._socket.to(this._room).emit(ChatEvent.Message, preparedMsg)
        );
    }

    public onDisconnect() {
        console.log(ChatEvent.Disconnect, this._socket.id);

        this._io.to(this._room).emit(ChatEvent.Notification, {
            message: 'user disconnected',
            room: this._room,
            userName: this._userName,
        });
    }
}
