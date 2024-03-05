<script setup>
const menu = ref(false)
const prompts = ref([])
const editingPrompt = ref(null)
const newTitlePrompt = ref(null)
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
      title: newTitlePrompt.value,
      prompt: newPrompt.value
    })
  })
  if (!error.value) {
    prompts.value.push(data.value)
    newTitlePrompt.value = null
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
      title: editingPrompt.value.title,
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

onNuxtReady( () => {
  loadPrompts()
})
</script>

<style scoped>

</style>