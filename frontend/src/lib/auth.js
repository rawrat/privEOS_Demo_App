export function loggedIn() {
    return localStorage.privateKey ? true : false
}

export default {
    loggedIn
}