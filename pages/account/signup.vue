<script setup>
const { $i18n } = useNuxtApp()
definePageMeta({
  layout: 'vuetify-app'
})

const formData = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
  code:'',
})

const fieldErrors = ref({
  username: '',
  email: '',
  password1: '',
  password2: '',
  code:'',
})

const formRules = ref({
  username: [
    v => !!v || $i18n.t('Please enter your username'),
    v => v.length >= 4 || $i18n.t('Username must be at least 4 characters')
  ],
  email: [
    v => !!v || $i18n.t('Please enter your e-mail address'),
    v => /.+@.+\..+/.test(v) || $i18n.t('E-mail address must be valid')
  ],
  password1: [
    v => !!v || $i18n.t('Please enter your password'),
    v => v.length >= 8 || $i18n.t('Password must be at least 8 characters')
  ],
  password2: [
    v => !!v || $i18n.t('Please confirm your password'),
    v => v.length >= 8 || $i18n.t('Password must be at least 8 characters'),
    v => v === formData.value.password1 || $i18n.t('Confirm password must match password')
  ],
  code: [
    v => !!v || $i18n.t('Please enter your code'),
  ],
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
            fieldErrors.value[key] = $i18n.t(error.value.data[key][0])
          }
        }
        if (error.value.data.non_field_errors) {
          errorMsg.value = $i18n.t(error.value.data.non_field_errors[0])
        }
      } else {
        if (error.value.data.detail) {
          errorMsg.value = $i18n.t(error.value.data.detail)
        } else {
          errorMsg.value = 'Something went wrong. Please try again.'
        }
      }
    } else {
      setUser(data.value.user)
      navigateTo('/account/onboarding?email_verification_required='+data.value.email_verification_required)
    }

    submitting.value = false
  }
}

const handleFieldUpdate = (field) => {
  fieldErrors.value[field] = ''
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
            <div class="text-center text-h4">{{$t('Create your account')}}</div>
            <v-card-text>
              <v-form ref="signUpForm" class="mt-5">
                <v-text-field
                    v-model="formData.username"
                    :rules="formRules.username"
                    :error-messages="fieldErrors.username"
                    :label="$t('username')"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('username')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.email"
                    :rules="formRules.email"
                    :error-messages="fieldErrors.email"
                    :label="$t('email')"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('email')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.password1"
                    :rules="formRules.password1"
                    :error-messages="fieldErrors.password1"
                    :label="$t('password')"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('password1')"
                    clearable
                ></v-text-field>

                <v-text-field
                    v-model="formData.password2"
                    :rules="formRules.password2"
                    :error-messages="fieldErrors.password2"
                    :label="$t('confirmPassword')"
                    variant="underlined"
                    @update:modelValue="handleFieldUpdate('password2')"
                    clearable
                ></v-text-field>

<!--                <v-text-field-->
<!--                    v-model="formData.code"-->
<!--                    :rules="formRules.code"-->
<!--                    :label="$t('invitation code')"-->
<!--                    variant="underlined"-->
<!--                    @keyup.enter="submit"-->
<!--                    clearable-->
<!--                ></v-text-field>-->

              </v-form>

              <div v-if="errorMsg" class="text-red">{{ errorMsg }}</div>

              <div
                  class="mt-5 d-flex justify-space-between"
              >
                <v-btn
                    @click="navigateTo('/account/signin')"
                    variant="text"
                    color="primary"
                >{{$t('Sign in instead')}}</v-btn>

                <v-btn
                    size="large"
                    color="primary"
                    :loading="submitting"
                    @click="submit"
                >{{$t('signUp')}}</v-btn>
              </div>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>