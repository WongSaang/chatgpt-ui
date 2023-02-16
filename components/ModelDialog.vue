<template>
  <v-dialog
      v-model="dialog"
      persistent
      scrollable
  >
    <template v-slot:activator="{ props }">
      <v-list-item
          rounded="xl"
          v-bind="props"
          prepend-icon="smart_toy"
          active
          color="primary"
      >
        {{ currentModel }}
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ $t('openAIModels') }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div>
          {{ $t('aboutTheModels') }}:
          <a target="_blank" href="https://platform.openai.com/docs/models/overview">https://platform.openai.com/docs/models/overview</a>
        </div>
        <div
            v-for="(model, index) in models"
            :key="index"
            class="mt-5 d-flex align-center"
        >
          <v-switch
              v-model="currentModel"
              color="primary"
              :label="model"
              :value="model"
              hide-details
          ></v-switch>
          <v-icon
              icon="delete_outline"
              @click="removeModel(index)"
          ></v-icon>
        </div>
        <div>
          <v-btn
              variant="outlined"
              v-if="!showInputModel"
              @click="showInputModel = true"
          >
            Add a model
          </v-btn>
          <div
              v-else
              class="d-flex align-center"
          >
            <v-text-field
                v-model="inputModel"
                label="Enter a model name"
                hide-details
            ></v-text-field>
            <v-btn class="ml-3" icon="done" @click="createNewModel"></v-btn>
            <v-btn class="ml-3" icon="close" @click="showInputModel = false"></v-btn>
          </div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-alert
            v-if="warningText"
            density="compact"
            type="warning"
            :text="warningText"
        ></v-alert>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            @click="save"
        >
          {{ $t('saveAndClose') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const { $i18n } = useNuxtApp()
const dialog = ref(false)
const models = useModels()
const currentModel = useCurrentModel()
const inputModel = ref('')
const showInputModel = ref(false)
const warningText = ref(null)
const showWarning = (text) => {
  warningText.value = text
  setTimeout(() => {
    warningText.value = null
  }, 3000)
}
const createNewModel = () => {
  models.value.push(inputModel.value)
  inputModel.value = ''
  showInputModel.value = false
}
const removeModel = (index) => {
  if (currentModel.value === models.value[index]) {
    currentModel.value = null
  }
  models.value.splice(index, 1)
}
const save = async () => {
  if (!currentModel.value) {
    showWarning($i18n.t('pleaseSelectAtLeastOneModelDot'))
    return
  }
  setModels(models.value)
  setCurrentModel(currentModel.value)
  dialog.value = false
}
</script>