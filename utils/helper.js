
export const getDefaultConversationData = () => {
    const { $i18n } = useNuxtApp()
    return {
        id: null,
        topic: $i18n.t('defaultConversationTitle'),
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

export const createNewConversation = () => {
    const conversation = useConversation()
    conversation.value = getDefaultConversationData()
    navigateTo('/')
}


export const addConversation = (conversation) => {
    const conversations = useConversations()
    conversations.value = [conversation, ...conversations.value]
}


export const genTitle = async (conversationId) => {
    const { $i18n } = useNuxtApp()
    const { data, error } = await useAuthFetch('/api/gen_title/', {
        method: 'POST',
        body: {
            conversationId: conversationId,
            prompt: $i18n.t('genTitlePrompt')
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

const transformData = (list) => {
    const result = {};
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        result[item.name] = item.value;
    }
    return result;
}

export const loadSettings = async () => {
    const settings = useSettings()
    const { data, error } = await useAuthFetch('/api/chat/settings/', {
        method: 'GET'
    })
    if (!error.value) {
        settings.value = transformData(data.value)
    }
}