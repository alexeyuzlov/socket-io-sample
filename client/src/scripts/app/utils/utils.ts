export function uuid() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function getRandom(list: any[]) {
    return list[generateIndex(list.length)];
}

function generateIndex(listSize: number): number {
    return Math.floor(Math.random() * listSize);
}

/**
 * get port from 3001 to 3008
 */
export function getRandomPort() {
    const total = 8;
    const port = 3000;

    return getRandom(
        new Array(total).fill(0).map((item, index) => (index + 1) + port)
    );
}
