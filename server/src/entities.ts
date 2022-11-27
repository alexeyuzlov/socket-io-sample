import { uuid } from './utils';

export enum ChatEvent {
    Connection = 'connection',
    Disconnect = 'disconnect',
    Auth = 'auth',
    Message = 'message',
    Notification = 'notification'
}

export interface IChatMessage {
    uuid: string;
    text: string;
    timestamp: Date;
}

export function toChatMessage(data: any): IChatMessage {
    return {
        uuid: uuid(),
        text: data.text,
        timestamp: new Date()
    };
}
