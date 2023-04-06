
// export const useModels = () => useState('models', () => getStoredModels())

export const useCurrentModel = () => useState('currentModel', () => getCurrentModel())

export const useApiKey = () => useState('apiKey', () => getStoredApiKey())

export const useConversations = () => useState('conversations', () => [])

export const useSettings = () => useState('settings', () => {})

export const useUser = () => useState('user', () => null)

export const useDrawer = () => useState('drawer', () => false)