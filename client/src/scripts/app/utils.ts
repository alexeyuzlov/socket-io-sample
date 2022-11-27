export function getRandom(list: any[]) {
    return list[generateIndex(list.length)];
}

function generateIndex(listSize: number): number {
    return Math.floor(Math.random() * listSize);
}
