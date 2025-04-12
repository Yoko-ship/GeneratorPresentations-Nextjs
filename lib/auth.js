'use client'
export function getAuthToken(){
    const token = localStorage.getItem("token")
    return token
}
export function tokenLoader(){
    return getAuthToken()
}
export function removeToken(){
    localStorage.removeItem("token")
    window.dispatchEvent(new Event("storage"))
}