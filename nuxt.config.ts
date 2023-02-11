// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = 'ChatGPT UI'

export default defineNuxtConfig({
    dev: false,
    app: {
        head: {
            title: appName,
        },
    },
    runtimeConfig: {
        openaiApiKey: '',
        openaiModelName: 'text-davinci-003',
        public: {
            appName: appName
        }
    },
    build: {
        transpile: ['vuetify']
    },
    css: [
        'vuetify/styles',
        'material-design-icons-iconfont/dist/material-design-icons.css',
        'highlight.js/styles/panda-syntax-dark.css',
    ]
})
