export const config = {
    apiUrl: 'http://localhost:7374',
    chatPort: 3000,
    redis: {
        host: '192.168.20.20',
        port: 6379
    },
    totalThreads: process.env.TOTAL_THREADS || require('os').cpus().length
};
