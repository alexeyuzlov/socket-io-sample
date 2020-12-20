export function uuid() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function getRandom(list: any[]) {
    return list[generateIndex(list.length)];
}

function generateIndex(listSize: number): number {
    return Math.floor(Math.random() * listSize);
}
