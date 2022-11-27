import { uuid } from './utils';

export enum ChatEvent {
    Connection = 'connection',
    Disconnect = 'disconnect',
    Auth = 'auth',
    Message = 'message',
    Notification = 'notification'
}

export interface IncomingMessage {
    text: string;
}

export interface IChatMessage {
    uuid: string;
    text: string;
    timestamp: Date;
}

export function toChatMessage(data: any): IChatMessage {
    return {
        text: data.text,
        uuid: uuid(),
        timestamp: new Date()
    };
}
