<script setup>
import copy from 'copy-to-clipboard'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  messageIndex: {
    type: Number,
    required: true
  },
  usePrompt: {
    type: Function,
    required: true
  },
  deleteMessage: {
    type: Function,
    required: true
  }
})

const snackbar = ref(false)
const snackbarText = ref('')
const showSnackbar = (text) => {
  snackbarText.value = text
  snackbar.value = true
}

const copyMessage = () => {
  copy(props.message.message)
  showSnackbar('Copied!')
}

const editMessage = () => {
  props.usePrompt(props.message.message)
}

const deleteMessage = async () => {
  const { data, error } = await useAuthFetch(`/api/chat/messages/${props.message.id}/`, {
    method: 'DELETE'
  })
  if (!error.value) {
    props.deleteMessage(props.messageIndex)
    showSnackbar('Deleted!')
  }
  showSnackbar('Delete failed')
}

function selectMessageIcon(message) {
  if (message.is_bot) return ""
  if (message.message_type == 100) {
    return "travel_explore"
  } else if (message.message_type == 110) {
    return "local_library"
  } else if (message.message_type == 120) {
    return "article"
  } 
  return ""
}

const message_icon = selectMessageIcon(props.message)

</script>

<template>
  <v-menu
  >
    <template v-slot:activator="{ props }">
      <v-icon v-if="message_icon" :icon="message_icon"></v-icon>
      <v-btn
          v-bind="props"
          icon
          variant="text"
          class="mx-1 ma-2"
      >
        <v-icon icon="more_horiz"></v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
          @click="copyMessage()"
          :title="$t('copy')"
          prepend-icon="content_copy"
      >
      </v-list-item>
      <v-list-item
          @click="editMessage()"
          :title="$t('edit')"
          prepend-icon="edit"
      >
      </v-list-item>
      <v-list-item
          @click="deleteMessage()"
          :title="$t('delete')"
          prepend-icon="delete"
      >
      </v-list-item>
    </v-list>
  </v-menu>

  <v-snackbar
      v-model="snackbar"
      location="top"
      timeout="2000"
  >
    {{ snackbarText }}
  </v-snackbar>
</template>

<style scoped>

</style>