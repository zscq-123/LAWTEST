import { createRouter, createWebHistory } from 'vue-router'
import { hasIdentity } from '@/stores/identity'

const router = createRouter({
  // history 模式：报告链接 /report/{code} 直接可访问，刷新与在新页面打开均生效
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/signin', name: 'signin', component: () => import('@/views/SignInView.vue') },
    { path: '/select', name: 'select', component: () => import('@/views/SelectView.vue') },
    { path: '/matching', name: 'matching', component: () => import('@/views/MatchingView.vue') },
    { path: '/reveal', name: 'reveal', component: () => import('@/views/RevealView.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
    { path: '/fitness', name: 'fitness', component: () => import('@/views/FitnessView.vue') },
    { path: '/report/:code', name: 'report', component: () => import('@/views/ReportView.vue') },
    { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

/** 测试流程必须先登记身份（姓名 + 学号），两条路径统一在 /signin 录入 */
const IDENTITY_REQUIRED_ROUTES = ['select', 'matching', 'reveal', 'profile', 'fitness']

router.beforeEach((to) => {
  if (IDENTITY_REQUIRED_ROUTES.includes(String(to.name)) && !hasIdentity()) {
    return { name: 'signin', query: { next: to.fullPath } }
  }
})

export default router
