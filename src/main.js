import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/fonts.css'
import './assets/styles/main.css'
import './assets/styles/archive.css'

createApp(App).use(router).mount('#app')
