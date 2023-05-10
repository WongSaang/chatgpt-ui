<script setup>
import { isMobile } from 'is-mobile'
const { $i18n } = useNuxtApp()

const props = defineProps({
  sendMessage: {
    type: Function,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const message = ref('')
const rows = ref(1)
const autoGrow = ref(true)

const hint = computed(() => {
  return isMobile() ? '' : $i18n.t('pressEnterToSendYourMessageOrShiftEnterToAddANewLine')
})

watchEffect(() => {
  const lines = message.value.split(/\r\n|\r|\n/).length
  if (lines > 8) {
    rows.value = 8
    autoGrow.value = false
  } else {
    rows.value = 1
    autoGrow.value = true
  }
})

const send = () => {
  let msg = message.value
  // remove the last "\n"
  if (msg[msg.length - 1] === "\n") {
    msg = msg.slice(0, -1)
  }
  if (msg.length > 0) {
    let item = toolSelector.value.list[toolSelector.value.selected]
    props.sendMessage({content: msg, tool: item.name, message_type: item.type})
  }
  message.value = ""
  toolSelector.value.selected = 0
}

const textArea = ref()
const documentMan = ref(null)

const usePrompt = (prompt) => {
  message.value = prompt
  textArea.value.focus()
}
const refreshDocList = () => {
  documentMan.value.loadDocs()
}

const clickSendBtn = () => {
  send()
}

const enterOnly = (event) => {
  event.preventDefault();
  if (!isMobile()) {
    send()
  }
}

defineExpose({
  usePrompt, refreshDocList
})

const toolSelector = ref({
  list: [
    { title: "Chat", icon: "add", name: "chat", type: 0 },
    { title: "Web Search", icon: "travel_explore", name: "web_search", type: 100 },
    { title: "ArXiv", icon: "local_library", name: "arxiv", type: 110 },
  ],
  selected: 0,
})
function getToolIcon() {
  let v = toolSelector.value
  let icon = v.list[v.selected].icon
  return icon
}
function getLabel() {
  let v = toolSelector.value
  let name = v.list[v.selected].name
  return "messageLabel." + name
}
function selectTool(idx) {
  let v = toolSelector.value
  v.selected = idx
  let name = v.list[idx].name
}
const docDialogCtl = ref({
  dialog: false,
})
</script>

<template>
  <div
      class="flex-grow-1 d-flex align-center justify-space-between"
  >
    <v-btn
      title="Tools"
      :icon="getToolIcon()"
      density="compact"
      size="default"
      class="mr-3"
      id="tools_btn"
    >
    </v-btn>
    <v-menu
      activator="#tools_btn"
      open-on-hover
    >
      <v-list density="compact">
        <v-list-item
          v-for="(item, index) in toolSelector.list"
          :key="index"
          :prepend-icon="item.icon"
          @click="selectTool(index)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="article"
          @click="docDialogCtl.dialog = true"
        >
          Documents
        </v-list-item>
      </v-list>
    </v-menu>
    <v-textarea
        ref="textArea"
        v-model="message"
        :label="$t(getLabel())"
        :placeholder="hint"
        :rows="rows"
        max-rows="8"
        :auto-grow="autoGrow"
        :disabled="disabled"
        :loading="loading"
        :hide-details="true"
        clearable
        variant="outlined"
        class="userinputmsg"
        @keydown.enter.exact="enterOnly"
    ></v-textarea>
    <v-btn
        :disabled="loading"
        icon="send"
        title="Send"
        class="ml-3"
        @click="clickSendBtn"
    ></v-btn>
  </div>
  <DocumentsManage
    :send-message="sendMessage" 
    :control="docDialogCtl"
    ref="documentMan"
  />
</template>