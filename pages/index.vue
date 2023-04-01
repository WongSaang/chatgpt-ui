<script setup>
definePageMeta({
  middleware: ["auth"],
  path: '/:id?',
  keepalive: true
})
const route = useRoute()
const currentConversation = useConversation()
const conversation = ref(getDefaultConversationData())

const loadConversation = async () => {
  const { data, error } = await useAuthFetch('/api/chat/conversations/' + route.params.id)
  if (!error.value) {
    conversation.value = data.value
  }
}

const loadMessage = async () => {
  const { data, error } = await useAuthFetch('/api/chat/messages/?conversationId=' + route.params.id)
  if (!error.value) {
    conversation.value.messages = data.value
  }
}

onActivated(async () => {
  console.log('activated')
  console.log(conversation.value)
  if (route.params.id) {
    conversation.value.loadingMessages = true
    await loadConversation()
    await loadMessage()
    conversation.value.loadingMessages = false
  } else {
    conversation.value = getDefaultConversationData()
  }
  console.log(conversation.value)
  currentConversation.value = Object.assign({}, conversation.value)
})
</script>

<template>
    <Conversation :conversation="conversation" />
</template>