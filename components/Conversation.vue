<script setup>
import {EventStreamContentType, fetchEventSource} from '@microsoft/fetch-event-source'

const { $i18n } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const currentModel = useCurrentModel()
const openaiApiKey = useApiKey()
const fetchingResponse = ref(false)
const messageQueue = []
const frugalMode = ref(true)
let isProcessingQueue = false

const props = defineProps({
  conversation: {
    type: Object,
    required: true
  }
})

const processMessageQueue = () => {
  if (isProcessingQueue || messageQueue.length === 0) {
    return
  }
  if (!props.conversation.messages[props.conversation.messages.length - 1].is_bot) {
    props.conversation.messages.push({id: null, is_bot: true, message: ''})
  }
  isProcessingQueue = true
  const nextMessage = messageQueue.shift()
  if (runtimeConfig.public.typewriter) {
    let wordIndex = 0;
    const intervalId = setInterval(() => {
      props.conversation.messages[props.conversation.messages.length - 1].message += nextMessage[wordIndex]
      wordIndex++
      if (wordIndex === nextMessage.length) {
        clearInterval(intervalId)
        isProcessingQueue = false
        processMessageQueue()
      }
    }, runtimeConfig.public.typewriterDelay)
  } else {
    props.conversation.messages[props.conversation.messages.length - 1].message += nextMessage
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
const fetchReply = async (message) => {
  ctrl = new AbortController()

  let webSearchParams = {}
  if (enableWebSearch.value) {
    webSearchParams['web_search'] = {
      ua: navigator.userAgent,
      default_prompt: $i18n.t('webSearchDefaultPrompt')
    }
  }

  const data = Object.assign({}, currentModel.value, {
    openaiApiKey: enableCustomApiKey.value ? openaiApiKey.value : null,
    message: message,
    conversationId: props.conversation.id,
    frugalMode: frugalMode.value
  }, webSearchParams)

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
        const event = message.event
        const data = JSON.parse(message.data)

        if (event === 'error') {
          abortFetch()
          showSnackbar(data.error)
          return;
        }

        if (event === 'userMessageId') {
          props.conversation.messages[props.conversation.messages.length - 1].id = data.userMessageId
          return;
        }

        if (event === 'done') {
          abortFetch()
          props.conversation.messages[props.conversation.messages.length - 1].id = data.messageId
          if (!props.conversation.id) {
            props.conversation.id = data.conversationId
            genTitle(props.conversation.id)
          }
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

const grab = ref(null)
const scrollChatWindow = () => {
  if (grab.value === null) {
    return;
  }
  grab.value.scrollIntoView({behavior: 'smooth'})
}

const send = (message) => {
  fetchingResponse.value = true
  if (props.conversation.messages.length === 0) {
    addConversation(props.conversation)
  }
  props.conversation.messages.push({message: message})
  fetchReply(message)
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

const deleteMessage = (index) => {
  props.conversation.messages.splice(index, 1)
}

const settings = useSettings()
const enableWebSearch = ref(false)

const showWebSearchToggle = computed(() => {
  return settings.value && settings.value.open_web_search && settings.value.open_web_search === 'True'
})

const enableCustomApiKey = computed(() => {
  return settings.value && settings.value.open_api_key_setting && settings.value.open_api_key_setting === 'True'
})


onNuxtReady(() => {
  currentModel.value = getCurrentModel()
})

</script>

<template>
  <div v-if="conversation">
    <div
        v-if="conversation.loadingMessages"
        class="text-center"
    >
      <v-progress-circular
          indeterminate
          color="primary"
      ></v-progress-circular>
    </div>
    <div v-else>
      <div
          v-if="conversation.messages"
          ref="chatWindow"
      >
        <v-container>
          <v-row>
            <v-col
                v-for="(message, index) in conversation.messages" :key="index"
                cols="12"
            >
              <div
                  class="d-flex align-center"
                  :class="message.is_bot ? 'justify-start' : 'justify-end'"
              >
                <MessageActions
                    v-if="!message.is_bot"
                    :message="message"
                    :message-index="index"
                    :use-prompt="usePrompt"
                    :delete-message="deleteMessage"
                />
                <MsgContent :message="message" />
                <MessageActions
                    v-if="message.is_bot"
                    :message="message"
                    :message-index="index"
                    :use-prompt="usePrompt"
                    :delete-message="deleteMessage"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>

        <div ref="grab" class="w-100" style="height: 200px;"></div>
      </div>
    </div>
  </div>


  <v-footer
      app
      class="footer"
  >
    <div class="px-md-16 w-100 d-flex flex-column">
      <div class="d-flex align-center">
        <v-btn
            v-show="fetchingResponse"
            icon="close"
            title="stop"
            class="mr-3"
            @click="stop"
        ></v-btn>
        <MsgEditor ref="editor" :send-message="send" :disabled="fetchingResponse" :loading="fetchingResponse" />
      </div>
      <v-toolbar
          density="comfortable"
          color="transparent"
      >
        <Prompt v-show="!fetchingResponse" :use-prompt="usePrompt" />
        <v-switch
            v-if="showWebSearchToggle"
            v-model="enableWebSearch"
            inline
            hide-details
            color="primary"
            :label="$t('webSearch')"
        ></v-switch>
        <v-spacer></v-spacer>
        <v-switch
            v-model="frugalMode"
            inline
            hide-details
            color="primary"
            :label="$t('frugalMode')"
        ></v-switch>
        <v-dialog
            transition="dialog-bottom-transition"
            width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-icon
                color="grey"
                v-bind="props"
                icon="help_outline"
            ></v-icon>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card>
              <v-toolbar
                  color="primary"
                  :title="$t('frugalMode')"
              ></v-toolbar>
              <v-card-text>
                {{ $t('frugalModeTip') }}
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-toolbar>
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

<style scoped>
  .footer {
    width: 100%;
  }
</style>