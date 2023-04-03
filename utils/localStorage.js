
const get = (key) => {
    if (process.server) return
    let val = localStorage.getItem(key)
    if (val) {
        val = JSON.parse(val)
    }
    return val
}

const set = (key, val) => {
    if (process.server) return
    localStorage.setItem(key, JSON.stringify(val))
}

export const setModels = (val) => {
    const models = useModels()
    set(STORAGE_KEY.MODELS, val)
    models.value = val
}

// export const getStoredModels = () => {
//     let models = get(STORAGE_KEY.MODELS)
//     if (!models) {
//         models = [DEFAULT_MODEL]
//     }
//     return models
// }

export const saveCurrentModel = (val) => {
    set(STORAGE_KEY.CURRENT_MODEL, val)
}

export const getCurrentModel = () => {
    let model = get(STORAGE_KEY.CURRENT_MODEL)
    if (!model) {
        model = MODELS[DEFAULT_MODEL_NAME]
    }
    return model
}

export const setApiKey = (val) => {
    const apiKey = useApiKey()
    set(STORAGE_KEY.OPENAI_API_KEY, val)
    apiKey.value = val
}

export const getStoredApiKey = () => {
    return get(STORAGE_KEY.OPENAI_API_KEY)
}