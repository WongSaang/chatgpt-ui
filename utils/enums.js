
export const STORAGE_KEY = {
    MODELS: 'models',
    CURRENT_MODEL: 'current_model',
    OPENAI_API_KEY: 'openai_api_key',
}

export const MODELS = {
    'gpt-3.5-turbo': {
        name: 'gpt-3.5-turbo',
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        total_tokens: 4096,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1.0
    },
    'gpt-4': {
        name: 'gpt-4',
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        total_tokens: 8192,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 1.0
    }
}

export const DEFAULT_MODEL_NAME = 'gpt-3.5-turbo'