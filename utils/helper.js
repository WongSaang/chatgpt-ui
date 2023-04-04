
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

export const createNewConversation = () => {
    const route = useRoute()
    const { $i18n } = useNuxtApp()
    const currentConversation = useConversation()
    currentConversation.value = Object.assign(getDefaultConversationData(), {
        topic: $i18n.t('newConversation')
    })
    if (route.path !== '/') {
        return navigateTo('/')
    }
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
        const route = useRoute()
        const conversations = useConversations()
        const currentConversation = useConversation()
        let index = conversations.value.findIndex(item => item.id === conversationId)
        if (index === -1) {
            index = 0
        }
        conversations.value[index].topic = data.value.title
        if (route.path === '/') {
            currentConversation.value.topic = data.value.title
        }
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

export const getSystemSettings = async () => {
    const { data, error } = await useAuthFetch('/api/chat/settings/', {
        method: 'GET',
    })
    if (!error.value) {
        return transformData(data.value)
    }
    return {}
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