export const useMyFetch = (url, options = {}) => {
    let defaultOptions = {
        headers: {
            Accept: 'application/json'
        }
    }
    if (process.server) {
        defaultOptions.baseURL = process.env.SERVER_DOMAIN
    }
    return useFetch(url, Object.assign(defaultOptions, options))
}
export const useAuthFetch = async (url, options = {}) => {
    const res = await useMyFetch(url, options)
    if (res.error.value && res.error.value.status === 401) {
        await logout()
    }
    return res
}