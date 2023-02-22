<template>
  <v-card
      color="red-lighten-5"
      style="height: 100vh"
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
              class="mt-15"
          >
            <v-card-title>Sign in</v-card-title>
            <v-card-text>
              <v-form ref="signInForm">
                <v-text-field
                    v-model="formData.username"
                    :rules="formRules.username"
                    label="User name"
                    variant="underlined"
                ></v-text-field>
                <v-text-field
                    v-model="formData.password"
                    :rules="formRules.password"
                    label="Password"
                    variant="underlined"
                ></v-text-field>
                <div v-if="errorMsg" class="text-red">{{ errorMsg }}</div>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      variant="elevated"
                      color="primary"
                      :loading="submitting"
                      @click="submit"
                  >Submit</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

</template>

<script setup>
definePageMeta({
  layout: 'vuetify-app'
})
const formData = ref({
  username: '',
  password: ''
})
const formRules = ref({
  username: [
      v => !!v || 'Username is required'
  ],
  password: [
      v => !!v || 'Password is required'
  ]
})
const { $auth } = useNuxtApp()
const errorMsg = ref(null)
const signInForm = ref(null)
const valid = ref(true)
const submitting = ref(false)
const submit = async () => {
  errorMsg.value = null
  const { valid } = await signInForm.value.validate()
  if (valid) {
    submitting.value = true
    const error = await $auth.login(formData.value.username, formData.value.password)
    submitting.value = false
    if (!error) {
      return await $auth.callback()
    }
    errorMsg.value = error
  }
}

</script>