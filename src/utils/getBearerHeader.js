import { getCookie } from "./cookie";

export function getBearerHeader() {
    const token = getCookie('token')
    return `Bearer ${token}`
}