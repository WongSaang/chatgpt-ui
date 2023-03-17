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

const deleteMessage = async () => {
  const { data, error } = await useAuthFetch(`/api/chat/messages/${props.message.id}/`, {
    method: 'DELETE'
  })
  if (!error.value) {
    this.$emit('deleteMessage', props.messageIndex)
    showSnackbar('Deleted!')
  }
  showSnackbar('Delete failed')
}

</script>

<template>
  <v-menu
  >
    <template v-slot:activator="{ props }">
      <v-btn
          v-bind="props"
          icon
          variant="text"
          class="mx-1"
      >
        <v-icon icon="more_horiz"></v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
          @click="copyMessage()"
      >
        <v-list-item-title>{{ $t('copy') }}</v-list-item-title>
      </v-list-item>
<!--      <v-list-item-->
<!--          @click="deleteMessage()"-->
<!--      >-->
<!--        <v-list-item-title>{{ $t('delete') }}</v-list-item-title>-->
<!--      </v-list-item>-->
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