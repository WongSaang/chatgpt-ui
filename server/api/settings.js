import {getSetting, setSetting} from "~/utils/keyv";
import {apiError, apiSuccess} from "~/utils/api";

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
    const method = getMethod(event)
    if (method === 'GET') {
        const query = getQuery(event)
        let value = await getSetting(query.key)
        if (!value && query.key === 'modelName') {
            value = runtimeConfig.openaiModelName
        }
        return apiSuccess(value)
    } else if (method === 'POST') {
        const body = await readBody(event)
        await setSetting(body.key, body.value)
        return apiSuccess()
    }
})