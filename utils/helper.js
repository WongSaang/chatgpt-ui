
export const getDefaultConversationData = () => {
    const { $i18n } = useNuxtApp()
    return {
        id: null,
        topic: null,
        messages: [],
        loadingMessages: false,
    }
}

export const getConversations = async () => {
    const { data, error } = await useAuthFetch('/api/chat/conversations/')
    if (!error.value) {
        return data.value
    }
    return []
}

export const addConversation = (conversation) => {
    const conversations = useConversations()
    conversations.value = [conversation, ...conversations.value]
}


export const genTitle = async (conversationId) => {
    const { $i18n, $settings } = useNuxtApp()
    const openaiApiKey = useApiKey()
    const { data, error } = await useAuthFetch('/api/gen_title/', {
        method: 'POST',
        body: {
            conversationId: conversationId,
            prompt: $i18n.t('genTitlePrompt'),
            openaiApiKey: $settings.open_api_key_setting === 'True' ? openaiApiKey.value : null,
        }
    })
    if (!error.value) {
        const conversations = useConversations()
        let index = conversations.value.findIndex(item => item.id === conversationId)
        if (index === -1) {
            index = 0
        }
        conversations.value[index].topic = data.value.title
        return data.value.title
    }
    return null
}

export const fetchUser = async () => {
    return useMyFetch('/api/account/user/')
}

export const setUser = (userData) => {
    const user = useUser()
    user.value = userData
}

export const logout = () => {
    const user = useUser()
    user.value = null
    return navigateTo('/account/signin');
}