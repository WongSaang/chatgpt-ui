<template>
  <v-textarea
      v-model="message"
      clearable
      label="Message"
      placeholder="Type your message here"
      rows="1"
      :auto-grow="autoGrow"
      :disabled="disabled"
      :loading="loading"
      hide-details
      append-inner-icon="send"
      @keyup.enter="send"
      @click:append="send"
  ></v-textarea>
</template>

<script>
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
      const msg = this.message
      this.message = ""
      this.sendMessage(msg);
    },
  },
}
</script>

<style scoped>
</style>