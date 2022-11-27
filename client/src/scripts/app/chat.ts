import { io } from 'socket.io-client';
import { ChatEvent, IChatMessage, MessageRequest, toChatMessage } from './entities';
import { getRandom } from './utils';

const users = [
    'user1',
    'user2'
];

const user = getRandom(users);

const socket = io(`//localhost:3000`, {
    transports: ['websocket'],
    autoConnect: false
});

let messages: IChatMessage[] = [];

const formEl: HTMLFormElement = document.querySelector('form');
const inputEl: HTMLInputElement = document.querySelector('#m');
const messagesEl: HTMLElement = document.querySelector('#messages');

formEl.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents page reloading

    send(inputEl.value, (msgRaw) => {
        messages.push(toChatMessage(msgRaw));
        render();
    });

    inputEl.value = '';
    return false;
});

socket.on(ChatEvent.Connect, () => {
    console.info('Chat connected', user);
    socket.emit(ChatEvent.Auth, user);
});

socket.on(ChatEvent.Disconnect, () => console.info('Chat: disconnect'));

socket.on(ChatEvent.Notification, (notification: any) => {
    console.info('Notification', notification);
});

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
    const message: HTMLElement = document.createElement('div');

    message.innerHTML = `
        <div class="message__text">${msg.text}</div>
        <div class="message__time">${msg.timestamp}</div>
    `;

    message.classList.add('message');

    return message;
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
