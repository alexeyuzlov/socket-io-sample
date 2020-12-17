import { io } from 'socket.io-client';

const socket = io('//localhost:7476', {
    autoConnect: false
});

let messages: IChatMessage[] = [];

interface IChatMessage {
    text: string;
    uuid: string;
    timestamp: Date;
    status: MessageStatus;
}

function toChatMessage(data): IChatMessage {
    return {
        ...data,
        timestamp: new Date(data.timestamp),
        status: MessageStatus.Success
    };
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

    send(inputEl.value, (msgRaw) => {
        messages.push(toChatMessage(msgRaw));
        render();
    });

    inputEl.value = '';
    return false;
});

socket.on(ChatEvent.Connect, () => console.info('Chat: connected'));
socket.on(ChatEvent.Disconnect, () => console.info('Chat: disconnect'));

socket.on(ChatEvent.Notification, (note) => console.info('note', note));

socket.on(ChatEvent.Message, (msgRaw: any) => {
    console.info('incoming', msgRaw);

    messages.push(toChatMessage(msgRaw));
    render();
});

function send(text: string, successFn) {
    const newMessage: MessageRequest = {
        text
    };

    socket.emit(ChatEvent.Message, newMessage, (msg: IChatMessage) => {
        successFn(msg);
    });
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

function init() {
    fetch('http://localhost:7374/messages')
        .then((res) => res.json())
        .then((response) => {
            messages = response.map((r) => toChatMessage(r));
            render();

            socket.connect();
        });
}

init();

