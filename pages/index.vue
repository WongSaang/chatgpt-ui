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
    conversation.value = Object.assign(conversation.value, data.value)
  }
}

const loadMessage = async () => {
  const { data, error } = await useAuthFetch('/api/chat/messages/?conversationId=' + route.params.id)
  if (!error.value) {
    conversation.value.messages = data.value
  }
}

const updateCurrentConversation = () => {
  currentConversation.value = Object.assign({}, conversation.value)
}

onMounted(async () => {
  if (route.params.id) {
    conversation.value.loadingMessages = true
    await loadConversation()
    await loadMessage()
    conversation.value.loadingMessages = false
    updateCurrentConversation()
  } else {
    watch(currentConversation, (val) => {
      conversation.value = Object.assign({}, val)
    })
  }
})

onActivated(async () => {
  updateCurrentConversation()
})

</script>

<template>
  <Welcome v-if="!route.params.id && conversation.messages.length === 0" />
  <Conversation :conversation="conversation" />
</template>