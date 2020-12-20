import { IChatMessage } from './entities';
import { config } from './config';
import fetch from 'node-fetch';

export function saveMessage(message: IChatMessage): Promise<void> {
    return fetch(`${config.apiUrl}/messages`, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {'Content-Type': 'application/json'}
    })
        .then((res) => res.json())
        .then((response) => {
            console.info('Saved', response);
        });
}
