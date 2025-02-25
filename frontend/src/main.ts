import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axiosInstance from './axios'

const app = createApp(App)
app.config.globalProperties.axios = axiosInstance

export const eventBus = (app.config.globalProperties.$bus = {
  events: {},
})

app.use(router)

app.mount('#app')
