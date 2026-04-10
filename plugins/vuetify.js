import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import * as components from 'vuetify/components'
import { md3 } from 'vuetify/blueprints'
// import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true,
        blueprint: md3,
        theme: {
            defaultTheme: 'light',
        },
        icons: {
            defaultSet: 'md',
            aliases,
            sets: {
                md
            }
        },
        components,
        // directives
    })

    nuxtApp.vueApp.use(vuetify)

    if (process.client) {
        const colorMode = useColorMode()
        watch(() => colorMode.value, (val) => {
            if (val === 'dark' || val === 'light') {
                vuetify.theme.global.name.value = val
            }
        }, { immediate: true })
    }
})