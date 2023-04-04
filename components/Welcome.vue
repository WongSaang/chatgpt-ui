<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="text-h2">{{ $t('welcomeTo') }} <span class="text-primary">{{ runtimeConfig.public.appName }}</span></h2>
          <p class="text-caption my-5">
            {{ runtimeConfig.public.appName }} {{ $t('welcomeScreen.introduction1') }}
            <br>
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-row>
          <v-col
              cols="12"
              md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="sunny"></v-icon>
                  <h3 class="text-h6">{{ $t('welcomeScreen.examples.title') }}</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="example in examples" :content="example" />
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="bolt"></v-icon>
                  <h3 class="text-h6">{{ $t('welcomeScreen.capabilities.title') }}</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="capabilitie in capabilities" :content="capabilitie" />
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="warning_amber"></v-icon>
                  <h3 class="text-h6">{{ $t('welcomeScreen.limitations.title') }}</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="limitation in limitations" :content="limitation" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const { $i18n } = useNuxtApp()
const examples = ref([
  $i18n.t('welcomeScreen.examples.item1'),
  $i18n.t('welcomeScreen.examples.item2'),
  $i18n.t('welcomeScreen.examples.item3')
])
const capabilities = ref([
  $i18n.t('welcomeScreen.capabilities.item1'),
  $i18n.t('welcomeScreen.capabilities.item2'),
  $i18n.t('welcomeScreen.capabilities.item3')
])
const limitations = ref([
  $i18n.t('welcomeScreen.limitations.item1'),
  $i18n.t('welcomeScreen.limitations.item2'),
  $i18n.t('welcomeScreen.limitations.item3')
])
</script>