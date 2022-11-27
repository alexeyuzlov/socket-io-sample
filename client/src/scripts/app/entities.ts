export interface IChatMessage {
    text: string;
    uuid: string;
    timestamp: Date;
    status: MessageStatus;
}

export function toChatMessage(data): IChatMessage {
    return {
        ...data,
        timestamp: new Date(data.timestamp),
        status: MessageStatus.Success
    };
}

export enum MessageStatus {
    Pending = 'pending',
    Success = 'success',
    Failed = 'failed',
}

export interface MessageRequest {
    text: string;
}

export enum ChatEvent {
    Auth = 'auth',
    Connect = 'connect',
    Disconnect = 'disconnect',
    Message = 'message',
    Notification = 'notification',
}
