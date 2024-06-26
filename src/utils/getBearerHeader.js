import { getCookie } from "./cookie";

export function getBearerHeader() {
    const token = getCookie('token')
    return `Bearer ${token}`
}

export function getBearerHeaderReset() {
    const token = getCookie('tokenreset')
    return `Bearer ${token}`
}