import '../styles/style.scss';
import { DateUtils } from './app/utils/date/date';
import { io } from 'socket.io-client';

const date = DateUtils.now();
console.info(date);

const socket = io('//localhost:3000');

let formEl = document.querySelector('form');
let inputEl: HTMLInputElement = document.querySelector('#m');
let messagesEl = document.querySelector('#messages');

formEl.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', inputEl.value);
    inputEl.value = '';
    return false;
});

socket.on('chat message', (msg) => {
    let li = document.createElement('li');
    li.innerText = msg;
    messagesEl.appendChild(li);
});
