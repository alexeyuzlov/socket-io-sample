import { IChatMessage } from './entities';
import { state } from './state';

export function saveMessage(message: IChatMessage): Promise<void> {
    state.push(message);
    return Promise.resolve();
    // return fetch(`${config.apiUrl}/messages`, {
    //     method: 'POST',
    //     body: JSON.stringify(message),
    //     headers: {'Content-Type': 'application/json'}
    // })
    //     .then((res) => res.json())
    //     .then((response) => {
    //         console.info('Saved', response);
    //     });
}
