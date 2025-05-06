import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'normalize.css'
import '@/styles/index.scss'

import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(VueTippy, {
  directive: 'tippy',
  component: 'tippy',
  componentSingleton: 'tippy-singleton',
  defaultProps: {
    allowHTML: true
  }
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})
app.use(vuetify)

app.mount('#app')
