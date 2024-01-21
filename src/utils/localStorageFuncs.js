import { typesOfLocalStorageNames } from "./constants"

export function setIsWalletInjectedLS(isInjected = false) {
    localStorage.setItem(typesOfLocalStorageNames.IS_WALLET_INJECTED, isInjected)
}

export function setWalletAddressLS(address) {
    localStorage.setItem(typesOfLocalStorageNames.WALLET_ADDRESS, address)
}

export function getIsWalletInjectedLS() {
    return localStorage.getItem(typesOfLocalStorageNames.IS_WALLET_INJECTED)
}

export function getWalletAddressLS() {
    return localStorage.getItem(typesOfLocalStorageNames.WALLET_ADDRESS)
}

export function removeIsWalletInjectedLS() {
    localStorage.removeItem(typesOfLocalStorageNames.IS_WALLET_INJECTED)
}

export function removeWalletAddressLS() {
    localStorage.removeItem(typesOfLocalStorageNames.WALLET_ADDRESS)
}