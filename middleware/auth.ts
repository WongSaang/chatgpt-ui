
export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useUser()
    const signInPath = '/account/signin'
    if (!user.value && to.path !== signInPath) {
        const { error, data} = await fetchUser()
        if (error.value) {
            return navigateTo({
                path: signInPath,
                query: {
                    callback: encodeURIComponent(to.fullPath)
                }
            })
        } else {
            setUser(data.value)
        }
    }
})
