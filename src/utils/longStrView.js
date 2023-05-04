export function createLongStrView(str) {
    return str.slice(0, 6) + '...' + str.slice(str.length - 4, str.length)
}