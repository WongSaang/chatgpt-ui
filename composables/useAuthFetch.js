
export const useAuthFetch = async (url, options = {}) => {
    const res = await useFetch(url, options)
    if (res.error.value && res.error.value.status === 401) {
        await logout()
    }
    return res
}
