<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <v-list-item
          v-bind="props"
          rounded="xl"
          prepend-icon="language"
          :title="$t('language')"
      ></v-list-item>
    </template>
    <v-card>
      <v-toolbar
      >
        <v-btn
            icon
            @click="dialog = false"
        >
          <v-icon icon="close"></v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('language') }}</v-toolbar-title>
        <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn
                        variant="text"
                        @click="dialog = false"
                    >
                      Save
                    </v-btn>
                  </v-toolbar-items>
      </v-toolbar>
      <v-list
      >
        <!--          <v-list-item-->
        <!--              title="Use device language"-->
        <!--              :append-icon="usingDeviceLanguage() ? 'radio_button_checked' : 'radio_button_unchecked'"-->
        <!--              @click="useDeviceLanguage"-->
        <!--          >-->
        <!--          </v-list-item>-->
        <v-list-item
            v-for="l in locales"
            :key="l.code"
            :title="l.name"
            :append-icon="radioIcon(l.code)"
            @click="updateLocale(l.code)"
        >
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false)
const { locale, locales, setLocale } = useI18n()
const { $i18n } = useNuxtApp()

// const usingDeviceLanguage = () => {
//   return ($i18n.getLocaleCookie() === undefined || $i18n.getLocaleCookie() === 'undefined')
// }

const updateLocale = (lang) => {
  setLocale(lang)
}

const radioIcon = (code) => {
  return code === locale.value ? 'radio_button_checked' : 'radio_button_unchecked'
}

// const useDeviceLanguage = () => {
//   setLocale($i18n.getBrowserLocale())
//   $i18n.setLocaleCookie(undefined)
// }

</script>

<style scoped>

</style>