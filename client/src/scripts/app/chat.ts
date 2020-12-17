import { io } from 'socket.io-client';

const socket = io('//localhost:7476', {
    autoConnect: false
});

socket.connect();

let messages: IChatMessage[] = [];

interface IChatMessage {
    text: string;
    clientUuid?: string;
    timestamp: Date;
    status: MessageStatus;
}

enum MessageStatus {
    Pending = 'pending',
    Success = 'success',
    Failed = 'failed',
}

interface MessageRequest {
    text: string;
}

enum ChatEvent {
    Connect = 'connect',
    Disconnect = 'disconnect',
    Message = 'message',
    Notification = 'notification',
}

let formEl = document.querySelector('form');
let inputEl: HTMLInputElement = document.querySelector('#m');
let messagesEl = document.querySelector('#messages');

formEl.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents page reloading

    const fastMessage: IChatMessage = {
        clientUuid: uuid(),
        text: inputEl.value,
        timestamp: new Date(),
        status: MessageStatus.Pending
    };

    send(inputEl.value, () => {
        patchMessage(fastMessage.clientUuid, {
            status: MessageStatus.Success
        });
    });

    messages.push(fastMessage);
    render();

    inputEl.value = '';
    return false;
});

socket.on(ChatEvent.Connect, () => console.info('Chat: connected'));
socket.on(ChatEvent.Disconnect, () => console.info('Chat: disconnect'));

socket.on(ChatEvent.Notification, (note) => console.info('note', note));

socket.on(ChatEvent.Message, (msgRaw: any) => {
    console.info('incoming', msgRaw);

    messages.push({
        ...msgRaw,
        timestamp: new Date(msgRaw.timestamp),
        status: MessageStatus.Success
    });

    render();
});

function send(text: string, successFn) {
    const newMessage: MessageRequest = {
        text: inputEl.value
    };

    socket.emit(ChatEvent.Message, newMessage, () => {
        successFn();
    });
}

function uuid() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function patchMessage(msgUuid, msg: Partial<IChatMessage>) {
    messages = messages.map((message: IChatMessage) => {
        if (message?.clientUuid === msgUuid) {
            return {
                ...message,
                ...msg
            };
        }

        return message;
    });

    render();
}

function render() {
    console.info(messages);

    messagesEl.innerHTML = '';

    messages
        .sort((a: IChatMessage, b: IChatMessage) => +a.timestamp - +b.timestamp)
        .forEach((msg: IChatMessage) => {
            let item = generateMessage(msg);
            messagesEl.appendChild(item);
        });
}

function generateMessage(msg: IChatMessage): HTMLElement {
    let li = document.createElement('li');
    li.innerText = `${msg.text} time: ${+msg.timestamp} status: ${msg.status}`;

    return li;
}
