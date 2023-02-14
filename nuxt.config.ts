// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = 'ChatGPT UI'

export default defineNuxtConfig({
    dev: false,
    ssr: false,
    app: {
        head: {
            title: appName,
        },
    },
    runtimeConfig: {
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
    ],
    modules: [
        '@nuxtjs/color-mode',
        '@nuxtjs/i18n'
    ],
    i18n: {
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',  // recommended
            alwaysRedirect: true
        },
        locales: [
            {
                code: 'en',
                name: 'English',
                file: 'en-US.json',
            },
            {
                code: 'cn',
                name: '简体中文',
                file: 'zn-CN.json',
            }
        ],
        lazy: true,
        langDir: 'lang',
        defaultLocale: 'en',
        vueI18n: {
            fallbackLocale: 'en',
        },
    }
})
