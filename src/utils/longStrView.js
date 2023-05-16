export function createLongStrView(str) {
    try {
        return str.slice(0, 6) + '...' + str.slice(str.length - 4, str.length)
    } catch (error) {
        return ''
    }
}