<template>
  <v-list-item v-if="showModelNameEditor">
    <v-text-field
        label="Model name"
        v-model="modelNameInput"
        hide-details
        variant="outlined"
    ></v-text-field>
    <template v-slot:append>
      <v-icon icon="done" size="small" @click="submitModelName"></v-icon>
      <v-icon icon="close" size="small" @click="showModelNameEditor = false"></v-icon>
    </template>
  </v-list-item>
  <v-list-item
      v-else
      :title="currentModelName"
      subtitle="Current model"
  >
    <template v-slot:append>
      <v-icon icon="edit" @click="showModelNameEditor = true"></v-icon>
    </template>
  </v-list-item>
</template>

<script setup>
const { data } = await useFetch('/api/settings/?key=modelName')
const currentModelName = ref(data.value.data)
const modelNameInput = ref(currentModelName.value)
const showModelNameEditor = ref(false)
const submitModelName = async () => {
  try {
    const { data } = await useFetch('/api/settings', {
      method: 'POST',
      body: { key: 'modelName', value: modelNameInput.value }
    })
    if (data.value.status === 'success') {
      currentModelName.value = modelNameInput.value
      showModelNameEditor.value = false
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>

</style>