<template>
  <v-list-item v-if="showApiKeyEditor">
    <v-text-field
        label="Api key"
        v-model="apiKeyInput"
        hide-details
        variant="outlined"
    ></v-text-field>
    <template v-slot:append>
      <v-icon icon="done" size="small" @click="submitApiKey"></v-icon>
      <v-icon icon="close" size="small" @click="showApiKeyEditor = false"></v-icon>
    </template>
  </v-list-item>
  <v-list-item
      v-else
      :title="currentApiKey"
      subtitle="OpenAI API key"
  >
    <template v-slot:append>
      <v-icon icon="edit" @click="showApiKeyEditor = true"></v-icon>
    </template>
  </v-list-item>
</template>

<script setup>
const { data } = await useFetch('/api/settings/?key=apiKey')
const currentApiKey = ref(data.value.data??'Not set yet')
const apiKeyInput = ref(currentApiKey.value)
const showApiKeyEditor = ref(false)
const submitApiKey = async () => {
  try {
    const { data } = await useFetch('/api/settings', {
      method: 'POST',
      body: { key: 'apiKey', value: apiKeyInput.value }
    })
    if (data.value.status === 'success') {
      currentApiKey.value = apiKeyInput.value
      showApiKeyEditor.value = false
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>

</style>