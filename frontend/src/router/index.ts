import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/select', name: 'select', component: () => import('@/views/SelectView.vue') },
    { path: '/matching', name: 'matching', component: () => import('@/views/MatchingView.vue') },
    { path: '/reveal', name: 'reveal', component: () => import('@/views/RevealView.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
    { path: '/fitness', name: 'fitness', component: () => import('@/views/FitnessView.vue') },
    { path: '/report/:code', name: 'report', component: () => import('@/views/ReportView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
