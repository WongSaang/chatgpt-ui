<script setup>
definePageMeta({
  layout: 'vuetify-app',
  middleware: ['auth']
})
const email = ref('')
const sending = ref(false)
const resendEmail = async () => {
  sending.value = true
  const { data, error } = await useFetch('/api/account/resend-verification-email/', {
    method: 'POST'
  })
  if (error.value) {
    console.log(error.value)
  }
  sending.value = false
}
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
                We've sent a verification email to <strong>{{ email }}</strong>. <br>
                Please check your inbox and click the link to verify your email address.
              </p>
              <v-btn
                  variant="text"
                  class="mt-5"
                  color="primary"
                  :loading="sending"
                  @click="resendEmail"
              >
                Resend email
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