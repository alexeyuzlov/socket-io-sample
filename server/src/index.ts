import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

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
            ...msg,
            timestamp: new Date()
        };

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

        socket.to(room).emit(ChatEvent.Message, preparedMsg);
        cb(preparedMsg);
    });
});

interface IncomingMessage {
    text: string;
}

interface IChatMessage {
    text: string;
    timestamp: Date;
}
