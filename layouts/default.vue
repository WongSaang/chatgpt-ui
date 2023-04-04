<script setup>
import {useDisplay} from "vuetify";

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

const conversations = useConversations()
const currentConversation = useConversation()

const editingConversation = ref(null)
const deletingConversationIndex = ref(null)

const editConversation = (index) => {
  editingConversation.value = conversations.value[index]
}

const updateConversation = async (index) => {
  editingConversation.value.updating = true
  const { data, error } = await useAuthFetch(`/api/chat/conversations/${editingConversation.value.id}/`, {
    method: 'PUT',
    body: JSON.stringify({
      topic: editingConversation.value.topic
    })
  })
  if (!error.value) {
    conversations.value[index] = editingConversation.value
  }
  editingConversation.value = null
}

const deleteConversation = async (index) => {
  deletingConversationIndex.value = index
  const { data, error } = await useAuthFetch(`/api/chat/conversations/${conversations.value[index].id}/`, {
    method: 'DELETE'
  })
  deletingConversationIndex.value = null
  if (!error.value) {
    const deletingConversation = conversations.value[index]
    conversations.value.splice(index, 1)
    if (deletingConversation.id === currentConversation.value.id) {
      await navigateTo('/')
    }
  }
}

const clearConversations = async () => {
  deletingConversations.value = true
  const { data, error } = await useAuthFetch(`/api/chat/conversations/delete_all`, {
    method: 'DELETE'
  })
  if (!error.value) {
    loadConversations()
    clearConfirmDialog.value = false
  }
  deletingConversations.value = false
}

const clearConfirmDialog = ref(false)
const deletingConversations = ref(false)
const loadingConversations = ref(false)

const loadConversations = async () => {
  loadingConversations.value = true
  conversations.value = await getConversations()
  loadingConversations.value = false
}

const {mdAndUp} = useDisplay()


const drawerPermanent = computed(() => {
  return mdAndUp.value
})

const signOut = async () => {
  const { data, error } = await useFetch('/api/account/logout/', {
    method: 'POST'
  })
  if (!error.value) {
    await logout()
  }
}

const settings = useSettings()
const showApiKeySetting = ref(false)
watchEffect(() => {
  if (settings.value) {
    const settingsValue = toRaw(settings.value)
    showApiKeySetting.value = settingsValue.open_api_key_setting && settingsValue.open_api_key_setting === 'True'
  }
})

const user = useUser()

const navTitle = computed(() => {
  if (currentConversation.value && currentConversation.value.topic !== null) {
    return currentConversation.value.topic === '' ? $i18n.t('defaultConversationTitle') : currentConversation.value.topic
  }
  return runtimeConfig.public.appName
})

onNuxtReady(async () => {
  loadConversations()
})

</script>

<template>
  <v-app
      :theme="$colorMode.value"
  >
    <v-navigation-drawer
        v-model="drawer"
        :permanent="drawerPermanent"
        width="300"
    >
      <template
          v-slot:prepend
          v-if="user"
      >
        <v-list>
          <v-list-item
              :title="user.username"
              :subtitle="user.email"
          >
            <template v-slot:prepend>
              <v-icon
                  icon="face"
                  size="x-large"
              ></v-icon>
            </template>
            <template v-slot:append>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                      v-bind="props"
                      size="small"
                      variant="text"
                      icon="expand_more"
                  ></v-btn>
                </template>
                <v-list>
                  <v-list-item
                      :title="$t('resetPassword')"
                      to="/account/resetPassword"
                  >
                  </v-list-item>
                  <v-list-item
                      :title="$t('signOut')"
                      @click="signOut"
                  >
                  </v-list-item>
                </v-list>
              </v-menu>

            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
      </template>

      <div class="px-2">
        <v-list>
          <v-list-item v-show="loadingConversations">
            <v-list-item-title class="d-flex justify-center">
              <v-progress-circular indeterminate></v-progress-circular>
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-list>
          <template
              v-for="(conversation, cIdx) in conversations"
              :key="conversation.id"
          >
            <v-list-item
                active-color="primary"
                rounded="xl"
                v-if="editingConversation && editingConversation.id === conversation.id"
            >
              <v-text-field
                  v-model="editingConversation.topic"
                  :loading="editingConversation.updating"
                  variant="underlined"
                  append-icon="done"
                  hide-details
                  density="compact"
                  autofocus
                  @keyup.enter="updateConversation(cIdx)"
                  @click:append="updateConversation(cIdx)"
              ></v-text-field>
            </v-list-item>
            <v-hover
                v-if="!editingConversation || editingConversation.id !== conversation.id"
                v-slot="{ isHovering, props }"
            >
              <v-list-item
                  rounded="xl"
                  active-color="primary"
                  :to="conversation.id ? `/${conversation.id}` : undefined"
                  v-bind="props"
              >
                <v-list-item-title>{{ (conversation.topic && conversation.topic !== '') ? conversation.topic : $t('defaultConversationTitle') }}</v-list-item-title>
                <template v-slot:append>
                  <div
                      v-show="isHovering && conversation.id"
                  >
                    <v-btn
                        icon="edit"
                        size="small"
                        variant="text"
                        @click.prevent="editConversation(cIdx)"
                    >
                    </v-btn>
                    <v-btn
                        icon="delete"
                        size="small"
                        variant="text"
                        :loading="deletingConversationIndex === cIdx"
                        @click.prevent="deleteConversation(cIdx)"
                    >
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-hover>
          </template>
        </v-list>
      </div>

      <template v-slot:append>
        <div class="px-1">
          <v-divider></v-divider>
          <v-list>

            <v-dialog
                v-model="clearConfirmDialog"
                persistent
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    rounded="xl"
                    prepend-icon="delete_forever"
                    :title="$t('clearConversations')"
                ></v-list-item>
              </template>
              <v-card>
                <v-card-title class="text-h5">
                  Are you sure you want to delete all conversations?
                </v-card-title>
                <v-card-text>This will be a permanent deletion and cannot be retrieved once deleted. Please proceed with caution.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="green-darken-1"
                      variant="text"
                      @click="clearConfirmDialog = false"
                      class="text-none"
                  >
                    Cancel deletion
                  </v-btn>
                  <v-btn
                      color="green-darken-1"
                      variant="text"
                      @click="clearConversations"
                      class="text-none"
                      :loading="deletingConversations"
                  >
                    Confirm deletion
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <ApiKeyDialog
                v-if="showApiKeySetting"
            />

            <ModelParameters/>

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
        class=""
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ navTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
          :title="$t('newConversation')"
          icon="add"
          @click="createNewConversation"
          class="d-md-none"
      ></v-btn>
      <v-btn
          variant="outlined"
          class="text-none d-none d-md-block"
          @click="createNewConversation"
      >
        {{ $t('newConversation') }}
      </v-btn>

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