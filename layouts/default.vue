<template>
  <v-app
      :theme="$colorMode.value"
  >
    <NavigationDrawer />
    <slot />
  </v-app>
</template>