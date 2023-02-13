<script setup>
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()
const drawer = ref(null)
const themes = ref([
  { title: 'Light', value: 'light' },
  { title: 'Dark', value: 'dark' },
  { title: 'System', value: 'system'}
])
const setTheme = (theme) => {
  colorMode.preference = theme
}
const feedback = () => {
  window.open('https://github.com/WongSaang/chatgpt-ui/issues', '_blank')
}
</script>

<template>
  <v-app
      :theme="$colorMode.value"
  >
    <v-navigation-drawer
        v-model="drawer"
    >
      <v-list>
        <ModelDialog/>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>
        <v-list>
          <ApiKeyDialog/>

          <v-menu
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                  v-bind="props"
                  rounded="xl"
                  :prepend-icon="$colorMode.value === 'light' ? 'light_mode' : 'dark_mode'"
                  title="Theme mode"
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

          <v-list-item
              rounded="xl"
              prepend-icon="help_outline"
              title="Feedback"
              @click="feedback"
          ></v-list-item>
        </v-list>
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
            <v-list-item-title>Feedback</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>