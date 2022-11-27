import { Server } from 'socket.io';
import { ChatServer } from './chat-server';

const io = new Server({
    serveClient: false,
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
});

// new LiveEmitter(io).init();

io.listen(3000);

new ChatServer(io).init();
