const fetch = require('node-fetch');

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { uuid } from './utils';

const server = createServer();

server.listen(7476, () => {
    console.log('listening on *:7476');
});

const io = new Server(server, {
    serveClient: false,
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
});

enum ChatEvent {
    Connection = 'connection',
    Disconnect = 'disconnect',
    Message = 'message',
    Notification = 'notification'
}

const room = 'room1';

io.on(ChatEvent.Connection, (socket: Socket) => {
    socket.join(room);

    console.log(ChatEvent.Connection, socket.id);

    socket.on(ChatEvent.Disconnect, () => {
        console.log(ChatEvent.Disconnect, socket.id);
    });

    socket.on(ChatEvent.Message, (msg: IncomingMessage, cb) => {
        const preparedMsg: IChatMessage = {
            text: msg.text,
            uuid: uuid(),
            timestamp: new Date()
        };

        cb(preparedMsg);

        if (!msg.text) {
            setTimeout(() => {
                socket.emit(ChatEvent.Notification, {
                    data: msg,
                    message: 'Invalid message',
                    status: 'fail'
                });
            }, 2000);

            return;
        }

        saveMessage(preparedMsg).then(
            () => socket.to(room).emit(ChatEvent.Message, preparedMsg)
        );
    });
});

interface IncomingMessage {
    text: string;
}

interface IChatMessage {
    uuid: string;
    text: string;
    timestamp: Date;
}

function saveMessage(message: IChatMessage): Promise<void> {
    return fetch('http://localhost:7374/messages', {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {'Content-Type': 'application/json'}
    })
        .then((res) => res.json())
        .then((response) => {
            console.info('Saved', response);
        });
}
