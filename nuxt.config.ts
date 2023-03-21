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
            appName: appName,
            typewriter: false,
            typewriterDelay: 50,
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
        '@vite-pwa/nuxt',
        '@nuxtjs/color-mode',
        '@nuxtjs/i18n',
    ],
    pwa: {
        disable: false,
        registerType: 'autoUpdate',
        manifest: {
            name: appName,
            short_name: appName,
            icons: [
                {
                    src: 'icon-black.svg',
                    sizes: '900x900',
                    purpose: 'any maskable',
                }
            ],
        },
        workbox: {
            navigateFallback: '/',
            outDir: 'dist',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        client: {
            installPrompt: true,
            // you don't need to include this: only for testing purposes
            // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
            periodicSyncForUpdates: 20,
        },
        devOptions: {
            enabled: true,
            type: 'module',
        }
    },
    i18n: {
        strategy: 'no_prefix',
        locales: [
            {
                code: 'en',
                iso: 'en-US',
                name: 'English',
                file: 'en-US.json',
            },
            {
                code: 'zh-CN',
                iso: 'zh-CN',
                name: '简体中文',
                file: 'zh-CN.json',
            }
        ],
        lazy: true,
        langDir: 'lang',
        defaultLocale: 'en',
        vueI18n: {
            fallbackLocale: 'en',
        },
    },
    nitro: {
        devProxy: {
            "/api": {
                target: process.env.NUXT_DEV_SERVER ?? 'http://localhost:8000/api',
                prependPath: true,
                changeOrigin: true,
            }

        }
    },
})
