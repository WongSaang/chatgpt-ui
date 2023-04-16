<template>
  <v-card
      style="height: 100vh"
  >
    <v-container>
      <SettingsLanguages/>
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
            <div class="text-center text-h4">{{$t('signIn')}}</div>
            <v-card-text>
              <v-form ref="signInForm">
                <v-text-field
                    v-model="formData.username"
                    :rules="formRules.username"
                    :label="$t('username')"
                    variant="underlined"
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="formData.password"
                    :rules="formRules.password"
                    :label="$t('password')"
                    variant="underlined"
                    @keyup.enter="submit"
                    clearable
                    :type="passwordInputType"
                    :append-inner-icon="passwordInputType === 'password' ? 'visibility' : 'visibility_off'"
                    @click:append-inner="passwordInputType = passwordInputType === 'password' ? 'text' : 'password'"
                ></v-text-field>
              </v-form>

              <div v-if="errorMsg" class="text-red">{{ errorMsg }}</div>

              <div
                class="mt-5 d-flex justify-space-between"
              >
                <v-btn
                    @click="navigateTo('/account/signup')"
                    variant="text"
                    color="primary"
                >{{$t('createAccount')}}</v-btn>

                <v-btn
                    color="primary"
                    :loading="submitting"
                    @click="submit"
                    size="large"
                >{{$t('signIn')}}</v-btn>
              </div>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

</template>

<script setup>
import {useUser} from "~/composables/states";
const { $i18n } = useNuxtApp()
definePageMeta({
  layout: 'vuetify-app'
})
const formData = ref({
  username: '',
  password: ''
})
const formRules = ref({
  username: [
      v => !!v || $i18n.t('Username is required')
  ],
  password: [
      v => !!v || $i18n.t('Password is required')
  ]
})
const errorMsg = ref(null)
const signInForm = ref(null)
const submitting = ref(false)
const route = useRoute()
const passwordInputType = ref('password')

const submit = async () => {
  errorMsg.value = null
  const { valid } = await signInForm.value.validate()
  if (valid) {
    submitting.value = true
    const { data, error } = await useFetch('/api/account/login/', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })
    submitting.value = false
    if (error.value) {
      if (error.value.status === 400) {
        if (error.value.data.non_field_errors) {
          errorMsg.value = error.value.data.non_field_errors[0]
        }
      } else {
        errorMsg.value = 'Something went wrong. Please try again.'
      }
    } else {
      setUser(data.value.user)
      const callback = route.query.callback ? decodeURIComponent(route.query.callback) : '/'
      await navigateTo(callback)
    }
  }
}

</script>