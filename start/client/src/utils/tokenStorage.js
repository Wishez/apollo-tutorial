const tokenKey = 'access_token'
const TokenStorage = {
    get() {
        return localStorage.getItem(tokenKey)
    },

    set(token) {
        localStorage.setItem(tokenKey, token)
    },

    remove() {
        localStorage.removeItem(tokenKey)
    },

    isLoggedIn() {
        return Boolean(TokenStorage.get())
    }
}

export default TokenStorage
