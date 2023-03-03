<script setup>
definePageMeta({
  layout: 'vuetify-app',
  middleware: ['auth']
})
const route = useRoute()
const sending = ref(false)
const resent = ref(false)
const errorMsg = ref(null)
const resendEmail = async () => {
  errorMsg.value = null
  sending.value = true
  const { data, error } = await useFetch('/api/account/registration/resend-email/', {
    method: 'POST',
  })
  if (error.value) {
    errorMsg.value = 'Something went wrong. Please try again later.'
  } else {
    resent.value = true
  }
  sending.value = false
}

onNuxtReady(() => {
  if (route.query.resend) {
    resendEmail()
  }
})
</script>

<template>
  <v-card
      class="h-100vh"
  >
    <v-container>
      <v-row>
        <v-col
            sm="9"
            offset-sm="1"
            md="8"
            offset-md="2"
        >
          <v-card
              class="mt-20vh"
              elevation="0"
          >
            <div class="text-center">
              <h2 class="text-h4">Verify your email</h2>
              <p class="text-body-2 mt-5">
                We've sent a verification email to <strong>{{ $auth.user.email }}</strong>. <br>
                Please check your inbox and click the link to verify your email address.
              </p>
              <p v-if="errorMsg"
                 class="text-red"
              >{{ errorMsg }}</p>
              <v-btn
                  variant="text"
                  class="mt-5"
                  color="primary"
                  :loading="sending"
                  @click="resendEmail"
                  :disabled="resent"
              >
                {{ resent ? 'Resent' : 'Resend email'}}
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.h-100vh {
  height: 100vh;
}
.mt-20vh {
  margin-top: 20vh;
}
</style>