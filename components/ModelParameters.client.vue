<script setup>

const dialog = ref(false)
const currentModel = useCurrentModel()
const availableModels = [
    'gpt-3.5-turbo',
    'gpt-4'
]
const currentModelDefault = ref(MODELS[currentModel.value.name])

onNuxtReady(() => {
  currentModel.value = getCurrentModel()
  watch(currentModel, (newVal, oldVal) => {
    currentModelDefault.value = MODELS[newVal.name]
    saveCurrentModel(newVal)
  }, { deep: true })
})

</script>

<template>
  <v-dialog
      v-model="dialog"
      persistent
  >
    <template v-slot:activator="{ props }">
      <v-list-item
          v-bind="props"
          rounded="xl"
          prepend-icon="tune"
          :title="$t('modelParameters')"
      ></v-list-item>
    </template>
    <v-card>
      <v-toolbar
          density="compact"
      >
        <v-toolbar-title>{{ $t('modelParameters') }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="close" @click="dialog = false"></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-select
            v-model="currentModel.name"
            :label="$t('model')"
            :items="availableModels"
            variant="underlined"
        ></v-select>

        <v-row
            no-gutters
        >
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center">
              <v-list-subheader>{{ $t('temperature') }}</v-list-subheader>
              <v-text-field
                  v-model.number="currentModel.temperature"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  max="1"
                  step="0.01"
                  style="width: 100px"
                  class="flex-grow-0"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12">
            <v-slider
                v-model="currentModel.temperature"
                :max="1"
                :step="0.01"
                hide-details
            >
            </v-slider>
          </v-col>
        </v-row>
        <v-row
            no-gutters
        >
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center">
              <v-list-subheader>{{ $t('maxTokens') }}</v-list-subheader>
              <v-text-field
                  v-model.number="currentModel.max_tokens"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  :max="currentModelDefault.total_tokens"
                  step="1"
                  style="width: 100px"
                  class="flex-grow-0"
              ></v-text-field>
            </div>
            <div class="text-caption">
              {{ $t('maxTokenTips1') }} <b>{{ currentModelDefault.total_tokens }}</b> {{ $t('maxTokenTips2') }}
            </div>
          </v-col>
          <v-col cols="12">
            <v-slider
                v-model="currentModel.max_tokens"
                :max="currentModelDefault.total_tokens"
                :step="1"
                hide-details
            >
            </v-slider>
          </v-col>
        </v-row>
        <v-row
            no-gutters
        >
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center">
              <v-list-subheader>{{ $t('topP') }}</v-list-subheader>
              <v-text-field
                  v-model.number="currentModel.top_p"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  max="1"
                  step="0.01"
                  style="width: 100px"
                  class="flex-grow-0"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12">
            <v-slider
                v-model="currentModel.top_p"
                :max="1"
                :step="0.01"
                hide-details
            >
            </v-slider>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center">
              <v-list-subheader>{{ $t('frequencyPenalty') }}</v-list-subheader>
              <v-text-field
                  v-model.number="currentModel.frequency_penalty"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  max="2"
                  step="0.01"
                  style="width: 100px"
                  class="flex-grow-0"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12">
            <v-slider
                v-model="currentModel.frequency_penalty"
                :max="2"
                :step="0.01"
                hide-details
            ></v-slider>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center">
              <v-list-subheader>{{ $t('presencePenalty') }}</v-list-subheader>
              <v-text-field
                  v-model.number="currentModel.presence_penalty"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  max="2"
                  step="0.01"
                  style="width: 100px"
                  class="flex-grow-0"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12">
            <v-slider
                v-model="currentModel.presence_penalty"
                :max="2"
                :step="0.01"
                hide-details
            ></v-slider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>