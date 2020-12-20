import { config } from './config';
import { Server } from 'socket.io';
import cluster from 'cluster';
import { LiveEmitter } from './emitter';
import { ChatServer } from './chat-server';

import { createAdapter } from 'socket.io-redis';
import { RedisClient } from 'redis';

const rooms: string[] = [
    'room1',
    'room2'
];

const pubClient = new RedisClient(config.redis);
const subClient = pubClient.duplicate();

const io = new Server({
    serveClient: false,
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    },
    adapter: createAdapter({
        pubClient,
        subClient
    })
});

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < config.totalThreads; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died!`);
    });

    new LiveEmitter(io, rooms).init();
}

if (cluster.isWorker) {
    const port = config.chatPort + cluster.worker.id;
    io.listen(port);

    console.log(`workerId: ${cluster.worker.id} listen on port: ${port}`);

    new ChatServer(io, rooms).init();
}
