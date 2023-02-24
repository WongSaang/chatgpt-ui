export const useAuthFetch = async (url, options = {}) => {
    const { $auth } = useNuxtApp()

    const token = await $auth.retrieveToken()

    if (!token) {
        return await $auth.redirectToLogin()
    }

    options = Object.assign(options, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const res = await useFetch(url, options)
    if (res.error.value && res.error.value.status === 401) {
        await $auth.logout()
    }
    return res
}
