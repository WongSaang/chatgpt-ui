<script setup>
import { fetchEventSource } from '@microsoft/fetch-event-source'

const runtimeConfig = useRuntimeConfig()
const currentModel = useCurrentModel()
const openaiApiKey = useApiKey()
const fetchingResponse = ref(false)
const fetchReply = async (message, parentMessageId) => {
  const ctrl = new AbortController()
  try {
    await fetchEventSource('/api/conversation', {
      signal: ctrl.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: currentModel.value,
        openaiApiKey: openaiApiKey.value,
        message: message,
        parentMessageId: parentMessageId,
        conversationId: currentConversation.value.id
      }),
      onopen(response) {
        if (response.status === 200) {
          return;
        }
        throw new Error(`Failed to send message. HTTP ${response.status} - ${response.statusText}`);
      },
      onclose() {
        throw new Error(`Failed to send message. Server closed the connection unexpectedly.`);
      },
      onerror(err) {
        throw err;
      },
      onmessage(message) {
        if (message.event === 'error') {
          throw new Error(JSON.parse(message.data).error);
        }
        const { type, data } = JSON.parse(message.data);
        if (type === 'done') {
          if (currentConversation.value.id === null) {
            currentConversation.value.id = data.conversationId
          }
          currentConversation.value.messages[currentConversation.value.messages.length - 1].id = data.messageId
          ctrl.abort();
          fetchingResponse.value = false
          return;
        }
        if (currentConversation.value.messages[currentConversation.value.messages.length - 1].from === 'ai') {
          currentConversation.value.messages[currentConversation.value.messages.length - 1].message += data
        } else {
          currentConversation.value.messages.push({id: null, from: 'ai', message: data})
        }
        scrollChatWindow()
      },
    })
  } catch (err) {
    ctrl.abort()
    showSnackbar(err.message)
    fetchingResponse.value = false
  }
}

const defaultConversation = ref({
  id: null,
  messages: []
})
const currentConversation = ref({})

const grab = ref(null)
const scrollChatWindow = () => {
  grab.value.scrollIntoView({behavior: 'smooth'})
}

const createNewConversation = () => {
  currentConversation.value = Object.assign(defaultConversation.value, {
  })
}
const send = (message) => {
  fetchingResponse.value = true
  let parentMessageId = null
  if (currentConversation.value.messages.length > 0) {
    const lastMessage = currentConversation.value.messages[currentConversation.value.messages.length - 1]
    if (lastMessage.from === 'ai' && lastMessage.id !== null) {
      parentMessageId = lastMessage.id
    }
  }
  currentConversation.value.messages.push({from: 'me', parentMessageId: parentMessageId, message: message})
  fetchReply(message, parentMessageId)
  scrollChatWindow()
}
const stop = () => {
  ctrl.abort();
  fetchingResponse.value = false
}

const snackbar = ref(false)
const snackbarText = ref('')
const showSnackbar = (text) => {
  snackbarText.value = text
  snackbar.value = true
}

createNewConversation()
</script>

<template>
  <div
      v-if="currentConversation.messages.length > 0"
      ref="chatWindow"
  >
    <v-card
        rounded="0"
        elevation="0"
        v-for="(conversation, index) in currentConversation.messages"
        :key="index"
        :variant="conversation.from === 'ai' ? 'tonal' : 'text'"
    >
      <v-container>
        <v-card-text class="text-caption text-disabled">{{ conversation.from }}</v-card-text>
        <v-card-text>
          <MsgContent :content="conversation.message" />
        </v-card-text>
      </v-container>
      <v-divider></v-divider>
    </v-card>
    <div ref="grab" class="w-100" style="height: 150px;"></div>
  </div>
  <Welcome v-else />
  <v-footer app class="d-flex flex-column">
    <div class="px-md-16 w-100 d-flex align-center">
      <v-btn
          v-show="fetchingResponse"
          icon="close"
          title="stop"
          class="mr-3"
          @click="stop"
      ></v-btn>
      <MsgEditor :send-message="send" :disabled="fetchingResponse" :loading="fetchingResponse" />
    </div>

    <div class="px-4 py-2 text-disabled text-caption font-weight-light text-center w-100">
      © {{ new Date().getFullYear() }} — {{ runtimeConfig.public.appName }}
    </div>
  </v-footer>
  <v-snackbar
      v-model="snackbar"
      multi-line
      location="top"
  >
    {{ snackbarText }}

    <template v-slot:actions>
      <v-btn
          color="red"
          variant="text"
          @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>