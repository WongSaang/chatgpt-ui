<script setup>
import {useConversions} from "../composables/states";
import {getConversions} from "../utils/helper";

const { $i18n } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()
const drawer = ref(null)
const themes = ref([
  { title: $i18n.t('lightMode'), value: 'light' },
  { title: $i18n.t('darkMode'), value: 'dark' },
  { title: $i18n.t('followSystem'), value: 'system'}
])
const setTheme = (theme) => {
  colorMode.preference = theme
}
const feedback = () => {
  window.open('https://github.com/WongSaang/chatgpt-ui/issues', '_blank')
}

const { locale, locales, setLocale } = useI18n()
const setLang = (lang) => {
  setLocale(lang)
}

const conversations = useConversions()

onNuxtReady(async () => {
  conversations.value = await getConversions()
})

</script>

<template>
  <v-app
      :theme="$colorMode.value"
  >
    <v-navigation-drawer
        v-model="drawer"
    >
      <div class="px-2 py-2">
        <v-btn
            block
            variant="outlined"
            prepend-icon="add"
            size="large"
            @click="createNewConversion()"
        >
          New conversation
        </v-btn>
        <v-list>
          <v-list-item
              v-for="conversation in conversations"
              :key="conversation.id"
              :title="conversation.topic"
              active-color="primary"
              @click="openConversationMessages(conversation)"
          ></v-list-item>
        </v-list>
      </div>

      <template v-slot:append>
        <div class="px-1">
          <v-divider></v-divider>
          <v-list>

            <v-menu
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    rounded="xl"
                    :prepend-icon="$colorMode.value === 'light' ? 'light_mode' : 'dark_mode'"
                    :title="$t('themeMode')"
                ></v-list-item>
              </template>
              <v-list
                  bg-color="white"
              >
                <v-list-item
                    v-for="(theme, idx) in themes"
                    :key="idx"
                    @click="setTheme(theme.value)"
                >
                  <v-list-item-title>{{ theme.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <SettingsLanguages/>

            <v-list-item
                rounded="xl"
                prepend-icon="help_outline"
                :title="$t('feedback')"
                @click="feedback"
            ></v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
        class="d-lg-none"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ runtimeConfig.public.appName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu
      >
        <template v-slot:activator="{ props }">
          <v-btn
              v-bind="props"
              icon="help_outline"
              title="Feedback"
          ></v-btn>
        </template>
        <v-list
        >
          <v-list-item
              @click="feedback"
          >
            <v-list-item-title>{{ $t('feedback') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>

<style>
.v-navigation-drawer__content::-webkit-scrollbar {
  width: 0;
}
.v-navigation-drawer__content:hover::-webkit-scrollbar {
  width: 6px;
}
.v-navigation-drawer__content:hover::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 3px;
}
</style>