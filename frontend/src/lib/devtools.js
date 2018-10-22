export function getLocalStorageConfig() {
    if (localStorage.config) {
        return JSON.parse(localStorage.config)
    }
    return {}
}

if (/\?dev/.test(window.location.href)) {
    let localStorageConfig = getLocalStorageConfig()
    localStorageConfig.dev = true
    localStorage.config = JSON.stringify(localStorageConfig)
}