
export const STORAGE_KEY = {
    MODELS: 'models',
    CURRENT_MODEL: 'current_model',
    OPENAI_API_KEY: 'openai_api_key',
}

export const system_content_alteratives = [
    "You are a helpful assisant.",
    "You are a spoken English teacher and improver. The user will speak to you in English and you will reply in English to practice user's spoken English. Keep your reply neat, limiting to 128 words. You will strictly correct user's grammar mistakes, typos, and factual errors. You will ask user a question in your reply.",
    "You are a helpful psychologist, try to make conversations with the user for diagnosis and therapy.",
]

export const MODELS = {
    'gpt-3.5-turbo': {
        name: 'gpt-3.5-turbo',
        system_content: system_content_alteratives[0],
        system_content_items: system_content_alteratives,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        total_tokens: 4096,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1.0
    },
    'gpt-4': {
        name: 'gpt-4',
        system_content: system_content_alteratives[0],
        system_content_items: system_content_alteratives,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        total_tokens: 8192,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 1.0
    }
}

export const DEFAULT_MODEL_NAME = 'gpt-3.5-turbo'