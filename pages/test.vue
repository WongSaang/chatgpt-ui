<template>
  <v-container>
<!--    <v-btn @click="stop">Cancel</v-btn>-->
<!--<v-text-field-->
<!--        v-model="message"-->
<!--        label="Message"-->
<!--        outlined-->
<!--    ></v-text-field>-->
<!--    <v-btn @click="fetchReply">Send</v-btn>-->
    <v-btn color="green">{{ $auth.loginIn }}</v-btn>
    <br>
    <br>
    <br>
    <v-btn @click="$auth.login()">Login</v-btn>
  </v-container>
</template>

<script setup>

definePageMeta({
  middleware: ["auth"],
  layout: false
})


import {EventStreamContentType, fetchEventSource} from '@microsoft/fetch-event-source'
const message = ref('')
let ctrl
const fetchReply = async () => {
  ctrl = new AbortController()
  try {
    await fetchEventSource('/api/sse', {
      signal: ctrl.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message.value,
      }),
      onopen(response) {
        if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
          return;
        }
        throw new Error(`Failed to send message. HTTP ${response.status} - ${response.statusText}`);
      },
      onclose() {
        console.log('onclose')
        // throw new Error(`Failed to send message. Server closed the connection unexpectedly.`);
      },
      onerror(err) {
        console.log('err', err)
        throw err;
      },
      onmessage(message) {
        console.log(message)
        if (message.event === 'done') {
          // ctrl.abort()
        }
      },
    })
  } catch (err) {
    console.log(err)
    ctrl.abort()
  }
}
const stop = () => {
  if (ctrl) {
    ctrl.abort()
  }
}
</script>