<template>
  <v-dialog
      v-model="dialog"
      persistent
  >
    <template v-slot:activator="{ props }">
      <v-list-item
          rounded="xl"
          v-bind="props"
          prepend-icon="vpn_key"
          color="primary"
      >
        {{ $t('setApiKey') }}
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ $t('openAIApiKey') }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div>
          {{ $t('getAKey') }}:
          <a target="_blank" href="https://platform.openai.com/account/api-keys">https://platform.openai.com/account/api-keys</a>
        </div>
        <div
            class="mt-5 d-flex align-center"
        >
          <v-text-field
              v-model="apiKey"
              label="Api Key"
              hide-details
              clearable
              :disabled="!editable"
          ></v-text-field>
          <div
              v-if="editable"
          >
            <v-btn class="ml-3" icon="done" @click="save"></v-btn>
          </div>
          <div
              v-else
          >
            <v-btn class="ml-3" icon="edit" @click="editable = true"></v-btn>
          </div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-alert
            v-if="warningText"
            density="compact"
            type="warning"
            :text="warningText"
        ></v-alert>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false)
const apiKey = useApiKey()
const inputApiKey = ref('')
const editable = ref(false)
const warningText = ref(null)
const showWarning = (text) => {
  warningText.value = text
  setTimeout(() => {
    warningText.value = null
  }, 3000)
}
const save = async () => {
  setApiKey(apiKey.value)
  editable.value = false
}
</script>