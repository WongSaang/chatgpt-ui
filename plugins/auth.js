
const AUTH_ROUTE = {
    home: '/',
    login: '/login'
}

const COOKIE_OPTIONS = {
    prefix: '_Secure-auth',
    path: '/',
    tokenName: 'access-token',
    refreshTokenName: 'refresh-token',
}

const ENDPOINTS = {
    login: {
        url: '/api/auth/signin'
    },
    refresh: {
        url: '/api/auth/token/refresh'
    },
    user: {
        url: '/api/auth/session'
    }
}


export default defineNuxtPlugin(() => {
    const tokenKey = COOKIE_OPTIONS.prefix + '.' + COOKIE_OPTIONS.tokenName
    const refreshTokenKey = COOKIE_OPTIONS.prefix + '.' + COOKIE_OPTIONS.refreshTokenName
    const tokenOptions = {
        maxAge: 60 * 5,
    }
    const refreshTokenOptions = {
        maxAge: 60 * 60 * 24,
    }
    const token = useCookie(tokenKey, tokenOptions)
    const refreshToken = useCookie(refreshTokenKey, refreshTokenOptions)

    class Auth {
        constructor() {
            this.loginIn = useState('loginIn', () => false)
            this.user = useState('user')
        }

        async login (username, password) {
            const { data, error } = await useFetch(ENDPOINTS.login.url, {
                method: 'POST',
                body: {
                    username,
                    password
                }
            })
            if (!error.value) {
                token.value = data.value.access
                refreshToken.value = data.value.refresh
                return null
            }
            if (error.value.status === 401) {
                return error.value.data.detail
            }
            return 'Request failed, please try again.'
        }

        async logout () {
            this.loginIn.value = false
            this.user.value = null
            await this.redirectToLogin()
        }

        async fetchUser () {
            const { data, error } = await useAuthFetch(ENDPOINTS.user.url)
            if (!error.value) {
                this.user = data.value
                this.loginIn.value = true
                return null
            }
            return error
        }

        async refresh () {
            const { data, error } = await useFetch(ENDPOINTS.refresh.url, {
                method: 'POST',
                body: {
                    'refresh': refreshToken.value
                }
            })
            if (!error.value) {
                token.value = data.value.access
                return data.value.access
            }
            return null
        }

        async callback () {
            return await navigateTo(AUTH_ROUTE.home)
        }

        async redirectToLogin () {
            return await navigateTo(AUTH_ROUTE.login)
        }

        async retrieveToken () {
            const token = useCookie(tokenKey, tokenOptions)
            const refreshToken = useCookie(refreshTokenKey, refreshTokenOptions)
            if (!refreshToken.value) {
                return null
            }
            if (!token.value) {
                return await this.refresh()
            }
            return token.value
        }

    }

    const auth = new Auth()

    addRouteMiddleware('auth', async (to, from) => {
        if (!auth.loginIn.value) {
            const token = await auth.retrieveToken()
            if (!token) {
                return await auth.redirectToLogin()
            }
            const error = await auth.fetchUser()
            if (error) {
                return await auth.redirectToLogin()
            }
        }
    })

    return {
        provide: {
            auth
        }
    }
})