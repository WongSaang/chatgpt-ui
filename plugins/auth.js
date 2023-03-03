
const AUTH_ROUTE = {
    home: '/',
    login: '/account/signin',
}

const ENDPOINTS = {
    login: {
        url: '/api/account/login/'
    },
    user: {
        url: '/api/account/user/'
    }
}


export default defineNuxtPlugin(() => {

    class Auth {
        constructor() {
            this.loginIn = useState('loginIn', () => false)
            this.user = useState('user')
        }

        async logout () {
            this.loginIn.value = false
            this.user.value = null
            await this.redirectToLogin()
        }

        setUser (user) {
            this.user = user
            this.loginIn.value = true
        }

        async fetchUser () {
            const { data, error } = await useFetch(ENDPOINTS.user.url, {
                // withCredentials: true
            })
            if (!error.value) {
                this.setUser(data.value)
                return null
            }
            return error
        }

        async redirectToLogin (callback) {
            return await navigateTo(
                AUTH_ROUTE.login + '?callback=' + encodeURIComponent(callback || AUTH_ROUTE.home)
            )
        }

    }

    const auth = new Auth()

    addRouteMiddleware('auth', async (to, from) => {
        if (!auth.loginIn.value) {
            const error = await auth.fetchUser()
            if (error) {
                return await auth.redirectToLogin(to.fullPath)
            }
        }
    })

    return {
        provide: {
            auth
        }
    }
})