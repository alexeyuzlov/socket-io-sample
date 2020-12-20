import { io } from 'socket.io-client';
import { ChatEvent, IChatMessage, MessageRequest, toChatMessage } from './entities';

const port = +localStorage.getItem('port') || 3001;

const socket = io(`//localhost:${port}`, {
    transports: ['websocket'],
    autoConnect: false
});

let messages: IChatMessage[] = [];

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

socket.on(ChatEvent.Connect, () => console.info('Chat: connected on', port));
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
    messagesEl.innerHTML = '';

    messages
        .sort((a: IChatMessage, b: IChatMessage) => +a.timestamp - +b.timestamp)
        .forEach((msg: IChatMessage) => {
            let item = generateMessage(msg);
            messagesEl.appendChild(item);
        });

    messagesEl.scrollTop = messagesEl.scrollHeight;
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

// init();

socket.connect();
