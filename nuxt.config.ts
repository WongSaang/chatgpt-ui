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
        // add `vueI18n` option to `@nuxtjs/i18n` module options
        vueI18n: {
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
                en: {
                    welcome: 'Welcome'
                },
                fr: {
                    welcome: 'Bienvenue'
                }
            }
        },
        locales: [
            {
                code: 'en',
                file: 'en-US.js',
            },
            {
                code: 'cn',
                file: 'zn-CN.js',
            }
        ],
        lazy: true,
        langDir: 'lang',
        defaultLocale: 'en'
    }
})
