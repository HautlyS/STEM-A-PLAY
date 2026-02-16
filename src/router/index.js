import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import StemaplayView from '../views/StemaplayView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainView
  },
  {
    path: '/stemaplay',
    name: 'STEM_A_PLAY',
    component: StemaplayView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
