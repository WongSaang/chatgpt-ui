<template>
  <v-text-field v-model="val" />
  <v-btn @click="login">Login</v-btn>
</template>

<script setup>
definePageMeta({
  layout: false
})
const val = ref('')
const { $auth } = useNuxtApp()
const login = () => {
  $auth.login()
  navigateTo('/test')
}

</script>