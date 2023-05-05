import { config } from "./config"
import { getBearerHeader } from "./getBearerHeader"

export async function checkAuth() {
    try {
        const res = await fetch(`${config.api}/company`, {
          headers: {Authorization: getBearerHeader()}
        })
        if (res.status === 200) return await res.json()
        else return false
    } catch (error) {
        return false
    }
}