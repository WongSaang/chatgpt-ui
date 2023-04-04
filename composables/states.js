
// export const useModels = () => useState('models', () => getStoredModels())

export const useCurrentModel = () => useState('currentModel', () => getCurrentModel())

export const useApiKey = () => useState('apiKey', () => getStoredApiKey())

export const useConversation = () => useState('conversation', () => getDefaultConversationData())

export const useConversations = () => useState('conversations', () => [])

export const useSettings = () => useState('settings', () => getSystemSettings())

export const useUser = () => useState('user', () => null)