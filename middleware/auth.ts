export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useUser()
    const signInPath = '/account/signin'
    if (!user.value && to.path !== signInPath) {
        const error = await fetchUser()
        console.log(error)
        if (error) {
            return navigateTo({
                path: signInPath,
                query: {
                    callback: encodeURIComponent(to.fullPath)
                }
            })
        }

    }
})
