<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="text-h2">Welcome to <span class="text-primary">{{ runtimeConfig.public.appName }}</span></h2>
          <p class="text-caption mt-5">
            {{ runtimeConfig.public.appName }} is an unofficial client for ChatGPT, but uses the official OpenAI API.
            <br>
            You will need an OpenAI API Key before you can use this client.
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-row>
          <v-col
              cols="12"
              md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="sunny"></v-icon>
                  <h3 class="text-h6">Examples</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="example in examples" :content="example" />
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="bolt"></v-icon>
                  <h3 class="text-h6">Capabilities</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="capabilitie in capabilities" :content="capabilitie" />
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-row>
              <v-col>
                <div class="d-flex flex-column align-center">
                  <v-icon icon="warning_amber"></v-icon>
                  <h3 class="text-h6">Limitations</h3>
                </div>
              </v-col>
            </v-row>
            <WelcomeCard v-for="limitation in limitations" :content="limitation" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const examples = ref([
    '"Explain quantum computing in simple terms"',
    '"Got any creative ideas for a 10 year old’s birthday?"',
    '"How do I make an HTTP request in Javascript?"'
])
const capabilities = ref([
    'Remembers what user said earlier in the conversation',
    'Allows user to provide follow-up corrections',
    'Trained to decline inappropriate requests'
])
const limitations = ref([
    'May occasionally generate incorrect information',
    'May occasionally produce harmful instructions or biased content',
    'Limited knowledge of world and events after 2021'
])
</script>