export function minLength(password){
    return password.length > 7
}
export function checkEmail(email){
    return email.includes("@")
}
export function isValid(value){
    return value != ""
}