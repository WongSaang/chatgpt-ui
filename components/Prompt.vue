<script setup>
const menu = ref(false)
const prompts = ref([])
const editingPrompt = ref(null)
const newPrompt = ref('')
const submittingNewPrompt = ref(false)
const promptInputErrorMessage = ref('')
const loadingPrompts = ref(false)
const deletingPromptIndex = ref(null)

const props = defineProps({
  usePrompt: {
    type: Function,
    required: true
  }
})

const addPrompt = async () => {
  if (!newPrompt.value) {
    promptInputErrorMessage.value = 'Please enter a prompt'
    return
  }
  submittingNewPrompt.value = true
  const { data, error } = await useAuthFetch('/api/chat/prompts/', {
    method: 'POST',
    body: JSON.stringify({
      prompt: newPrompt.value
    })
  })
  if (!error.value) {
    prompts.value.push(data.value)
    newPrompt.value = ''
  }
  submittingNewPrompt.value = false
}

const editPrompt = (index) => {
  editingPrompt.value = Object.assign({}, prompts.value[index])
}

const updatePrompt = async (index) => {
  editingPrompt.value.updating = true
  const { data, error } = await useAuthFetch(`/api/chat/prompts/${editingPrompt.value.id}/`, {
    method: 'PUT',
    body: JSON.stringify({
      prompt: editingPrompt.value.prompt
    })
  })
  if (!error.value) {
    prompts.value[index] = editingPrompt.value
  }
  editingPrompt.value.updating = false
  editingPrompt.value = null
}

const cancelEditPrompt = () => {
  editingPrompt.value = null
}

const deletePrompt = async (index) => {
  deletingPromptIndex.value = index
  const { data, error } = await useAuthFetch(`/api/chat/prompts/${prompts.value[index].id}/`, {
    method: 'DELETE'
  })
  deletingPromptIndex.value = null
  if (!error.value) {
    prompts.value.splice(index, 1)
  }
}

const loadPrompts = async () => {
  loadingPrompts.value = true
  const { data, error } = await useAuthFetch('/api/chat/prompts/')
  if (!error.value) {
    prompts.value = data.value
  }
  loadingPrompts.value = false
}

const selectPrompt = (prompt) => {
  props.usePrompt(prompt.prompt)
  menu.value = false
}

onMounted( () => {
  loadPrompts()
})
</script>

<template>
  <div>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            v-bind="props"
            icon="speaker_notes"
            title="Common prompts"
            class="mr-3"
        ></v-btn>
      </template>

      <v-container>
        <v-card
            min-width="300"
            max-width="500"
        >
          <v-card-title>
            <span class="headline">Frequently prompts</span>
          </v-card-title>

          <v-divider></v-divider>

          <v-list>
            <v-list-item v-show="loadingPrompts">
              <v-list-item-title class="d-flex justify-center">
                <v-progress-circular indeterminate></v-progress-circular>
              </v-list-item-title>
            </v-list-item>
            <template
                v-for="(prompt, idx) in prompts"
                :key="prompt.id"
            >
              <v-list-item
                  active-color="primary"
                  rounded="xl"
                  v-if="editingPrompt && editingPrompt.id === prompt.id"
              >
                <v-textarea
                    rows="2"
                    v-model="editingPrompt.prompt"
                    :loading="editingPrompt.updating"
                    variant="underlined"
                    hide-details
                    density="compact"
                >
                  <template v-slot:append>
                    <div class="d-flex flex-column">
                      <v-btn
                          icon="done"
                          variant="text"
                          :loading="editingPrompt.updating"
                          @click="updatePrompt(idx)"
                      >
                      </v-btn>
                      <v-btn
                          icon="close"
                          variant="text"
                          @click="cancelEditPrompt()"
                      >
                      </v-btn>
                    </div>
                  </template>
                </v-textarea>
              </v-list-item>
              <v-list-item
                  v-if="!editingPrompt || editingPrompt.id !== prompt.id"
                  rounded="xl"
                  active-color="primary"
                  @click="selectPrompt(prompt)"
              >
                <v-list-item-title>{{ prompt.prompt }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                      icon="edit"
                      size="small"
                      variant="text"
                      @click="editPrompt(idx)"
                  >
                  </v-btn>
                  <v-btn
                      icon="delete"
                      size="small"
                      variant="text"
                      :loading="deletingPromptIndex === idx"
                      @click="deletePrompt(idx)"
                  >
                  </v-btn>
                </template>
              </v-list-item>
            </template>

            <v-list-item
                active-color="primary"
            >
              <div
                  class="pt-3"
              >
                <v-textarea
                    rows="2"
                    v-model="newPrompt"
                    label="Add a new prompt"
                    variant="outlined"
                    density="compact"
                    :error-messages="promptInputErrorMessage"
                    @update:modelValue="promptInputErrorMessage = ''"
                    clearable
                >
                </v-textarea>
              </div>
            </v-list-item>
            <v-list-item>
              <v-btn
                  variant="text"
                  block
                  :loading="submittingNewPrompt"
                  @click="addPrompt()"
              >
                <v-icon icon="add"></v-icon>
                Add prompt
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-menu>
  </div>
</template>

<style scoped>

</style>