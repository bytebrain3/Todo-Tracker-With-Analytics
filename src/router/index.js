import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

import { useUserStore } from '../stores/Userstore.js'


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginPage.vue')
		},
		{
			path: '/leaderboard',
			name: 'leaderboard',
			component: () => import('../views/LeaderBoard.vue')
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegistrationPage.vue')
		},
		{
		  path : '/analytics',
		  name : 'analytics',
		  component : () => import('../views/AnalyticsPage.vue')
		}

	]
});

router.beforeEach((to, from, next) => {
	const userstore = useUserStore(); // Correctly closed parentheses
	if ((to.name === 'login' || to.name === 'register') && userstore.isLogin) {
		next('/');
	} else {
		next();
	}
});


export default router;
