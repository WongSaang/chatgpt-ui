import login from "~/pages/login.vue";

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
    logout: {
        url: '/api/auth/signout'
    },
    user: {
        url: '/api/auth/session'
    }
}


export default defineNuxtPlugin(() => {
    const token = useCookie(COOKIE_OPTIONS.prefix + '.' + COOKIE_OPTIONS.tokenName, {
        maxAge: 60 * 30,
    })
    const refreshToken = useCookie(COOKIE_OPTIONS.prefix + '.' + COOKIE_OPTIONS.refreshTokenName, {
        maxAge: 60 * 60 * 24,
    })
    console.log('token', token.value)
    console.log('refreshToken', refreshToken.value)

    class Auth {
        constructor() {
            this.loginIn = useState('loginIn', () => false)
            this.user = useState('user')
        }

        async login () {
            const { data, error } = await useFetch(ENDPOINTS.login.url, {
                method: 'POST',
                body: {
                    username: 'admin',
                    password: 'admin'
                }
            })
            if (!error.value) {
                token.value = data.value.access
                refreshToken.value = data.value.refresh
            }
            console.log(error.value)
        }

        logout () {
            this.loginIn.value = false
            this.user.value = null
        }

        async fetchUser () {
            const { data, error } = await useFetch(ENDPOINTS.user.url, {
                headers: {
                    'Authorization': 'Bearer ' + token.value
                }
            })
            if (!error.value) {
                this.user = data.value
                this.loginIn.value = true
            }
            console.log('fetchUser', error.value)
        }

        async refresh () {
            const { data, error } = await useFetch(ENDPOINTS.refresh.url, {
                method: 'POST',
                body: {
                    'refresh': refreshToken.value
                }
            })
            console.log('refresh', data)
            if (!error.value) {
                token.value = data.value.access
            }
            console.log('refresh', error.value)
        }

    }

    const auth = new Auth()

    addRouteMiddleware('auth', async () => {
        if (!auth.loginIn.value) {
            console.log('check', token.value, refreshToken.value)
            // Refresh token has expired
            if (!refreshToken.value) {
                console.log('refreshToken expired')
                return navigateTo(AUTH_ROUTE.login)
            }
            if (!token.value) {
                await auth.refresh()
            }
            await auth.fetchUser()
        }
    })

    return {
        provide: {
            auth
        }
    }
})