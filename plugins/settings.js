const transformData = (list) => {
    const result = {};
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        result[item.name] = item.value;
    }
    return result;
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:created', async () => {
        let settings = {}

        const { data, error } = await useAuthFetch('/api/chat/settings/', {
            method: 'GET',
        })

        if (!error.value) {
            settings = transformData(data.value)
        }

        nuxtApp.provide('settings', settings)
    })
})
