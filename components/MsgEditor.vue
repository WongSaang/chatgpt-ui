<template>
  <v-textarea
      v-model="message"
      :label="$t('writeAMessage')"
      :placeholder="hint"
      rows="1"
      :auto-grow="autoGrow"
      :disabled="disabled"
      :loading="loading"
      :hide-details="true"
      append-inner-icon="send"
      @keyup.enter.exact="enterOnly"
      @click:appendInner="clickSendBtn"
  ></v-textarea>
</template>

<script>
import { isMobile } from 'is-mobile'
export default {
  name: "MsgEditor",
  props: {
    sendMessage: Function,
    disabled: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      message: "",
      rows: 1,
      autoGrow: true,
    };
  },
  computed: {
    hint() {
      return isMobile() ? "" : "Press Enter to send your message or Shift+Enter to add a new line";
    },
  },
  watch: {
    message(val) {
      const lines = val.split(/\r\n|\r|\n/).length;
      if (lines > 8) {
        this.rows = lines;
        this.autoGrow = false;
      } else {
        this.rows = 1;
        this.autoGrow = true;
      }
    },
  },
  methods: {
    send() {
      let msg = this.message
      // remove the last "\n"
      if (msg[msg.length - 1] === "\n") {
        msg = msg.slice(0, -1)
      }
      if (msg.length > 0) {
        this.sendMessage(msg)
      }
      this.message = ""
    },
    usePrompt(prompt) {
      this.message = prompt
    },
    clickSendBtn () {
      this.send()
    },
    enterOnly () {
      if (!isMobile()) {
        this.send()
      }
    }
  },
}
</script>

<style scoped>
</style>