<script setup>
import {  RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useUserStore } from './stores/Userstore.js';

const userstore = useUserStore();

import { ChartNoAxesCombined , ListTodo, Crown, Home, ScanFace, CircleUserRound, LogOut } from 'lucide-vue-next';

const showLogout = ref(false)
const profile_click = () => {
  showLogout.value = !showLogout.value;
}

const route = useRoute();
const router = useRouter(); // Get the router instance

const isAuthPage = computed(() => route.name === 'login' || route.name === 'register');

const Logout = async () => {
  try {
    await userstore.logout();
    if (!userstore.isLogin) { // Check the login status correctly
      router.push('/login'); // Use router.push for navigation
    }
  } catch (error) {
    // Error handled in store but can handle here if needed
    alert('Logout error: ' + error.message); // Use error.message for a readable error message
  }
};
</script>


<template>

<div v-if="!isAuthPage" class="flex w-full h-auto py-2 lg:max-w-md">

	<nav class="relative flex flex-row w-screen h-12 px-2 items-center border rounded-full justify-between ps-3 lg:p-8 bg-neutral-50">
		<RouterLink to="/">
			<ListTodo class="text-4xl" />
		</RouterLink>

		<RouterLink to="/" :class="{ 'active-link': $route.path === '/' }">
			<Home />
		</RouterLink>
		<RouterLink to="/leaderboard" :class="{ 'active-link': $route.path === '/leaderboard' }">
			<Crown />
		</RouterLink>
		<RouterLink to="/analytics" :class="{ 'active-link': $route.path === '/analytics' }">
			<ChartNoAxesCombined />
		</RouterLink>

		
		<div class="flex space-x-4" v-if="!userstore.isLogin">
			<RouterLink to="/login" class="bg-blue-700 rounded-md px-2 py-1 text-white">Login</RouterLink>

		</div>
		<div v-else class="relative">
			<CircleUserRound @click="profile_click" />
			<div
				class="absolute right-0 top-full mt-4 w-auto p-3 origin-top-right divide-y divide-gray-100 rounded-md bg-neutral-200 shadow-xl overflow-hidden"
				v-if="showLogout"
			>
				<button href="#" class="flex space-x-3 items-center text-sm text-gray-700" @click='Logout'>
					<LogOut />
					<span>Logout</span>
				</button>
			</div>
		</div>
	</nav>
</div>

      <div class="w-screen h-auto flex flex-col items-center justify-center px-2">
        
  <RouterView />
      </div>
</template>

<style scoped>
.active-link {
	border-bottom: 2px solid blue; /* Bottom border color */
	color: blue; /* Optional: Change text color */
	background-color: transparent; /* Ensure no background color */
	padding-bottom: 2px; /* Add space for the bottom border */
	transition: border-bottom-color 0.3s ease; /* Smooth transition effect */
}


</style>
