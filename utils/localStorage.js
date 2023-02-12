
const get = (key) => {
    if (typeof window !== 'undefined') {
        let val = localStorage.getItem(key)
        if (val) {
            val = JSON.parse(val)
        }
        return val
    }
    return null
}

const set = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val))
}

const DEFAULT_OPENAI_MODEL = 'text-davinci-003'

export const setModels = (val) => {
    const models = useModels()
    set(STORAGE_KEY.OPENAI_MODELS, val)
    models.value = val
}

export const getStoredModels = () => {
    let models = get(STORAGE_KEY.OPENAI_MODELS)
    if (!models) {
        models = [DEFAULT_OPENAI_MODEL]
    }
    return models
}

export const setCurrentModel = (val) => {
    const model = useCurrentModel()
    set(STORAGE_KEY.CURRENT_OPENAI_MODEL, val)
    model.value = val
}

export const getCurrentModel = () => {
    let model = get(STORAGE_KEY.CURRENT_OPENAI_MODEL)
    if (!model) {
        model = DEFAULT_OPENAI_MODEL
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