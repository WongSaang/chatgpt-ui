<script setup>
import Prompt from "~/components/Prompt.vue";

definePageMeta({
  middleware: ["auth"]
})
import {EventStreamContentType, fetchEventSource} from '@microsoft/fetch-event-source'
import { nextTick } from 'vue'

const { $i18n, $auth } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const currentModel = useCurrentModel()
const openaiApiKey = useApiKey()
const fetchingResponse = ref(false)
const messageQueue = []
let isProcessingQueue = false

const processMessageQueue = () => {
  if (isProcessingQueue || messageQueue.length === 0) {
    return
  }
  if (!currentConversation.value.messages[currentConversation.value.messages.length - 1].is_bot) {
    currentConversation.value.messages.push({id: null, is_bot: true, message: ''})
  }
  isProcessingQueue = true
  const nextMessage = messageQueue.shift()
  if (runtimeConfig.public.typewriter) {
    let wordIndex = 0;
    const intervalId = setInterval(() => {
      currentConversation.value.messages[currentConversation.value.messages.length - 1].message += nextMessage[wordIndex]
      wordIndex++
      if (wordIndex === nextMessage.length) {
        clearInterval(intervalId)
        isProcessingQueue = false
        processMessageQueue()
      }
    }, runtimeConfig.public.typewriterDelay)
  } else {
    currentConversation.value.messages[currentConversation.value.messages.length - 1].message += nextMessage
    isProcessingQueue = false
    processMessageQueue()
  }
}

let ctrl
const abortFetch = () => {
  if (ctrl) {
    ctrl.abort()
  }
  fetchingResponse.value = false
}
const fetchReply = async (message, parentMessageId) => {
  ctrl = new AbortController()

  const data = Object.assign({}, currentModel.value, {
    openaiApiKey: openaiApiKey.value,
    message: message,
    parentMessageId: parentMessageId,
    conversationId: currentConversation.value.id
  })

  try {
    await fetchEventSource('/api/conversation/', {
      signal: ctrl.signal,
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      onopen(response) {
        if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
          return;
        }
        throw new Error(`Failed to send message. HTTP ${response.status} - ${response.statusText}`);
      },
      onclose() {
        if (ctrl.signal.aborted === true) {
          return;
        }
        throw new Error(`Failed to send message. Server closed the connection unexpectedly.`);
      },
      onerror(err) {
        throw err;
      },
      async onmessage(message) {
        // console.log(message)
        const event = message.event
        const data = JSON.parse(message.data)

        if (event === 'error') {
          throw new Error(data.error);
        }

        if (event === 'done') {
          if (currentConversation.value.id === null) {
            currentConversation.value.id = data.conversationId
            genTitle(currentConversation.value.id)
          }
          currentConversation.value.messages[currentConversation.value.messages.length - 1].id = data.messageId
          abortFetch()
          return;
        }

        messageQueue.push(data.content)
        processMessageQueue()

        scrollChatWindow()
      },
    })
  } catch (err) {
    console.log(err)
    abortFetch()
    showSnackbar(err.message)
  }
}

const currentConversation = useConversion()

const grab = ref(null)
const scrollChatWindow = () => {
  if (grab.value === null) {
    return;
  }
  grab.value.scrollIntoView({behavior: 'smooth'})
}


const send = (message) => {
  fetchingResponse.value = true
  let parentMessageId = null
  if (currentConversation.value.messages.length > 0) {
    const lastMessage = currentConversation.value.messages[currentConversation.value.messages.length - 1]
    if (lastMessage.is_bot && lastMessage.id !== null) {
      parentMessageId = lastMessage.id
    }
  }
  currentConversation.value.messages.push({parentMessageId: parentMessageId, message: message})
  fetchReply(message, parentMessageId)
  scrollChatWindow()
}
const stop = () => {
  abortFetch()
}

const snackbar = ref(false)
const snackbarText = ref('')
const showSnackbar = (text) => {
  snackbarText.value = text
  snackbar.value = true
}

const editor = ref(null)
const usePrompt = (prompt) => {
  editor.value.usePrompt(prompt)
}

</script>

<template>
  <div
      v-if="currentConversation.messages.length > 0"
      ref="chatWindow"
  >
    <v-container>
      <v-row>
        <v-col
            v-for="(message, index) in currentConversation.messages" :key="index"
            cols="12"
        >
          <div
              class="d-flex"
              :class="message.is_bot ? 'justify-start mr-16' : 'justify-end ml-16'"
          >
            <v-card
                :color="message.is_bot ? '' : 'primary'"
                rounded="lg"
                elevation="2"
            >
              <v-card-text>
                <MsgContent :content="message.message" />
              </v-card-text>

<!--              <v-card-actions-->
<!--                  v-if="message.is_bot"-->
<!--              >-->
<!--                <v-spacer></v-spacer>-->
<!--                <v-tooltip text="Copy">-->
<!--                  <template v-slot:activator="{ props }">-->
<!--                    <v-btn v-bind="props" icon="content_copy"></v-btn>-->
<!--                  </template>-->
<!--                </v-tooltip>-->
<!--              </v-card-actions>-->
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div ref="grab" class="w-100" style="height: 200px;"></div>
  </div>
  <Welcome v-else />
  <v-footer app class="d-flex flex-column">
    <div class="px-md-16 w-100 d-flex align-center">
      <Prompt v-show="!fetchingResponse" :use-prompt="usePrompt" />
      <v-btn
          v-show="fetchingResponse"
          icon="close"
          title="stop"
          class="mr-3"
          @click="stop"
      ></v-btn>
      <MsgEditor ref="editor" :send-message="send" :disabled="fetchingResponse" :loading="fetchingResponse" />
    </div>

    <div class="px-4 py-2 text-disabled text-caption font-weight-light text-center w-100">
      © {{ new Date().getFullYear() }} {{ runtimeConfig.public.appName }}
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