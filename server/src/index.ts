import { config } from './config';
import { Server, Socket } from 'socket.io';
import { getRandom } from './utils';
import cluster from 'cluster';
import { ChatEvent, IChatMessage, IncomingMessage, toChatMessage } from './entities';

const redisAdapter = require('socket.io-redis');
// const Redis = require('ioredis');

const cpuCount = require('os').cpus().length;
// const cpuCount = 2;

const io = new Server({
    serveClient: false,
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
});

io.adapter(redisAdapter({
    host: '192.168.20.20',
    port: 6379
}));

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died!`);
    });

    liveEmitter();
}

if (cluster.isWorker) {
    const port = config.chatPort + cluster.worker.id;
    io.listen(port);

    console.log(`workerId: ${cluster.worker.id} listen on port: ${port}`);

    io.on(ChatEvent.Connection, handleConnection);
}

function handleConnection(socket: Socket) {
    const room = 'room' + getRandom([1, 2, 1, 2, 1, 2]);

    socket.emit(ChatEvent.Notification, {
        room
    })

    console.log(ChatEvent.Connection, 'workerId', cluster.worker.id, 'roomID', room);

    socket.join(room);

    socket.on(ChatEvent.Disconnect, () => handleDisconnect(socket));

    socket.on(ChatEvent.Message, (msg: IncomingMessage, cb) => handleMessage(socket, room, msg, cb));
}

function handleDisconnect(socket: Socket) {
    console.log(ChatEvent.Disconnect, socket.id);
}

function handleMessage(socket: Socket, room, msg: IncomingMessage, cb) {
    const preparedMsg: IChatMessage = toChatMessage(msg);

    cb(preparedMsg);

    socket.to(room).emit(ChatEvent.Message, preparedMsg);
}

function liveEmitter() {
    setInterval(() => {
        io.to('room1').emit(ChatEvent.Message, toChatMessage({text: 'room#1'}));
    }, 2000);

    setInterval(() => {
        io.to('room2').emit(ChatEvent.Message, toChatMessage({text: 'room#2'}));
    }, 5000);

    setInterval(() => {
        io.emit(ChatEvent.Message, toChatMessage({text: 'to All'}));
    }, 10000);
}
