<template>
  <v-row>
    <v-col>
      <v-hover
          v-slot="{ isHovering, props }"
          open-delay="100"
      >
        <v-card
            :elevation="isHovering ? 3 : 0"
            v-bind="props"
            variant="tonal"
        >
          <v-card-text class="text-center">
            {{ content }}
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps(['content'])
</script>