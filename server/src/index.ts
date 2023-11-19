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

io.listen(80);
console.info('server start on port 80');

new ChatServer(io).init();
