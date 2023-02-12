<script setup>
const runtimeConfig = useRuntimeConfig()
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
const drawer = ref(null)
</script>

<template>
  <v-app
      :theme="theme"
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

          <v-list-item
              rounded="xl"
              :prepend-icon="theme === 'light' ? 'dark_mode' : 'light_mode'"
              :title="(theme === 'light' ? 'Dark' : 'Light') + ' mode'"
              @click="toggleTheme"
          ></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar
        class="d-lg-none"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ runtimeConfig.public.appName }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>