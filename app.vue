<script setup>
onNuxtReady(() => {
  fetchSystemSettings()
  // api key
  const apiKey = useApiKey()
  apiKey.value = getStoredApiKey()
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>