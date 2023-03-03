<script setup>
definePageMeta({
  layout: 'vuetify-app'
})

const { $auth } = useNuxtApp()

const formData = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
})

const fieldErrors = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
})

const formRules = ref({
  username: [
    v => !!v || 'Please enter your username',
    v => v.length >= 4 || 'Username must be at least 4 characters'
  ],
  email: [
    v => !!v || 'Please enter your e-mail address',
    v => /.+@.+\..+/.test(v) || 'E-mail address must be valid'
  ],
  password1: [
    v => !!v || 'Please enter your password',
    v => v.length >= 8 || 'Password must be at least 8 characters'
  ],
  password2: [
    v => !!v || 'Please confirm your password',
    v => v.length >= 8 || 'Password must be at least 8 characters',
    v => v === formData.value.password1 || 'Confirm password must match password'
  ]
})

const submitting = ref(false)
const errorMsg = ref(null)
const signUpForm = ref(null)

const submit = async () => {
  errorMsg.value = null
  const { valid } = await signUpForm.value.validate()
  if (valid) {
    submitting.value = true

    const { data, error } = await useFetch('/api/account/registration/', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })

    console.log(error.value)

    if (error.value) {
      if (error.value.status === 400) {
        for (const key in formData.value) {
          if (error.value.data[key]) {
            fieldErrors.value[key] = error.value.data[key][0]
          }
        }
        if (error.value.data.non_field_errors) {
          errorMsg.value = error.value.data.non_field_errors[0]
        }
      } else {
        errorMsg.value = 'Something went wrong. Please try again.'
      }
    } else {
      $auth.setUser(data.value.user)
      navigateTo('/account/onboarding')
    }

    submitting.value = false
  }
}

const handleFieldUpdate = (field) => {
  // fieldErrors.value[field] = ''
}
</script>

<template>
  <v-card
      style="height: 100vh"
  >
    <v-container>
      <v-row>
        <v-col
            sm="9"
            offset-sm="1"
            md="6"
            offset-md="3"
        >
          <v-card
              class="mt-15"
              elevation="0"
          >
            <div class="text-center text-h4">Create your account</div>
            <v-card-text>
              <v-form ref="signUpForm" class="mt-5">
                <v-text-field
                    v-model="formData.username"
                    :rules="formRules.username"
                    :error-messages="fieldErrors.username"
                    label="User name"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('username')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.email"
                    :rules="formRules.email"
                    :error-messages="fieldErrors.email"
                    label="Email"
                    variant="underlined"
                    @@update:modelValue="handleFieldUpdate('email')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.password1"
                    :rules="formRules.password1"
                    :error-messages="fieldErrors.password1"
                    label="Password"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('password1')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.password2"
                    :rules="formRules.password2"
                    :error-messages="fieldErrors.password2"
                    label="Confirm password"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('password2')"
                    clearable
                ></v-text-field>

              </v-form>

              <div v-if="errorMsg" class="text-red">{{ errorMsg }}</div>

              <div
                  class="mt-5 d-flex justify-space-between"
              >
                <v-btn
                    @click="navigateTo('/account/signin')"
                    variant="text"
                    color="primary"
                >Sign in instead</v-btn>

                <v-btn
                    size="large"
                    color="primary"
                    :loading="submitting"
                    @click="submit"
                >Submit</v-btn>
              </div>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>