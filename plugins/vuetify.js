import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true,
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
})