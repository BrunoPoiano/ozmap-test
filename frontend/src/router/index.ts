import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import SignInView from '../views/auth/SigninView.vue'
import LoginView from '../views/auth/LoginView.vue'
import ProfileView from '../views/profile/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    //User
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem('USER_TOKEN')

  if (isAuthenticated && (to.name === 'login' || to.name === 'signin')) {
    next({ name: 'home' })
  }

  if (!isAuthenticated) {
    if (to.name !== 'login' && to.name !== 'signin') {
      next({ name: 'login' })
    }
  }

  next()
})

export default router
