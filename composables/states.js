export const useModels = () => useState('models', () => getStoredModels())

export const useCurrentModel = () => useState('currentModel', () => getCurrentModel())

export const useApiKey = () => useState('apiKey', () => getStoredApiKey())