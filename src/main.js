import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/fonts.css'
import './assets/styles/main-base.css'
import './assets/styles/main-pages.css'
import './assets/styles/main-responsive.css'
import './assets/styles/archive-base.css'
import './assets/styles/archive-site.css'

createApp(App).use(router).mount('#app')
