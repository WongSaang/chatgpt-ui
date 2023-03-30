<script setup>
import {getDefaultConversationData} from "~/utils/helper";

definePageMeta({
  middleware: ["auth"],
  path: '/:id?',
  keepalive: true
})
const route = useRoute()
const conversation = ref({})
const loadMessage = async () => {
  conversation.value = Object.assign(conversation.value, conversation)
  conversation.value.loadingMessages = true
  const { data, error } = await useAuthFetch('/api/chat/messages/?conversationId=' + route.params.id)
  if (!error.value) {
    conversation.value.messages = data.value
  }
  conversation.value.loadingMessages = true
}
onMounted(async () => {
  if (route.params.id) {
    await loadMessage()
  }
})
</script>

<template>
    <Conversation :conversation="conversation" />
</template>