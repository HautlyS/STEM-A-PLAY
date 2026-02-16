import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Dynamic import for heavy assets
const loadAssets = async () => {
  if (import.meta.env.PROD) {
    // Production: preload critical assets
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = `${import.meta.env.BASE_URL}assets/index.css`
    document.head.appendChild(link)
  }
}

loadAssets()

const app = createApp(App)
app.use(router)
app.mount('#app')
