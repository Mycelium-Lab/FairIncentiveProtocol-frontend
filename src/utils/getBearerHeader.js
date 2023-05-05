import { getCookie } from "./cookie";

export function getBearerHeader() {
    const token = getCookie('token')
    console.log(token)
    return `Bearer ${token}`
}