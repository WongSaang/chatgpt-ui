<script setup>
definePageMeta({
  middleware: ["auth"],
  path: '/:id?',
  keepalive: true
})
const route = useRoute()
const currentConversation = useConversation()
const conversation = ref(getDefaultConversationData())
watchEffect(() => {
  if (!route.params.id) {
    conversation.value = getDefaultConversationData()
  }
})
const loadMessage = async () => {
  conversation.value.loadingMessages = true
  const { data, error } = await useAuthFetch('/api/chat/messages/?conversationId=' + route.params.id)
  if (!error.value) {
    conversation.value.messages = data.value
  }
  conversation.value.loadingMessages = false
}

onMounted(async () => {
  if (route.params.id) {
    conversation.value.id = parseInt(route.params.id)
    await loadMessage()
  }
  currentConversation.value = Object.assign({}, conversation.value)
})
</script>

<template>
    <Conversation :conversation="conversation" />
</template>