<script setup>
definePageMeta({
  layout: 'vuetify-app',
  path: '/account/verify-email/:token',
  title: 'Verify Email'
})
const route = useRoute()
const verifying = ref(false)
const status = ref('')

const verifyEmail = async () => {
  verifying.value = true
  const { data, error } = await useFetch(`/api/account/registration/verify-email/`, {
    method: 'POST',
    body: JSON.stringify({
      key: route.params.token
    })
  })
  if (!error.value && data.value.detail === 'ok') {
    status.value = 'success'
  } else {
    status.value = 'error'
  }
  verifying.value = false
}

onNuxtReady(() => {
  verifyEmail()
})
</script>

<template>
  <v-container class="h-100vh">
    <v-row
        class="fill-height"
        align-content="center"
        justify="center"
    >
      <v-col
          class="text-subtitle-1 text-center"
          cols="12"
          v-if="verifying"
      >
        Verifying your email
      </v-col>
      <v-col
          cols="6"
          v-if="verifying"
      >
        <v-progress-linear
            color="deep-purple-accent-4"
            indeterminate
            rounded
            height="6"
        ></v-progress-linear>
      </v-col>
      <v-col
          cols="12"
          v-if="status === 'success'"
          class="text-center"
      >
        <h2 class="text-h4">
          Your email has been verified.
        </h2>
        <p class="text-subtitle-1">
          You can now sign in to your account.
        </p>
        <v-btn
            color="primary"
            variant="text"
            @click="navigateTo('/account/login')"
        >
          Sign in
        </v-btn>
      </v-col>
      <v-col
          cols="12"
          v-if="status === 'error'"
          class="text-center"
      >
        <h2 class="text-h4">
          There was an error verifying your email.
        </h2>
        <v-btn
            color="primary"
            variant="text"
            @click="navigateTo('/account/onboarding?resend=1')"
        >
          Resend email
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.h-100vh {
  height: 100vh;
}
</style>