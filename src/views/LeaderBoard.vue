<template>
	<main class="w-full h-full overflow-y-auto flex flex-col items-center max-w-4xl space-y-4 poppins">
		<h1 class="text-2xl font-bold text-gray-800">Top 10 Users</h1>
		<ul class="list-none w-full max-w-lg space-y-2">
			<li v-for="(user, index) in topUsers" :key="index" class="flex justify-between items-center bg-white shadow-md rounded-lg p-4 border border-gray-200">
				<span class="font-medium text-gray-700 text-lg">{{ index + 1 }}. {{ user.displayName || user.uid }}</span>
				<span class="text-green-600 font-semibold text-lg">{{ user.score }}%</span>
			</li>
		</ul>
	</main>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getDatabase, ref as firebaseRef, get } from 'firebase/database';

// Reactive variables for top 10 users
const topUsers = ref([]);

// Function to fetch and calculate top 10 users with best scores
const fetchTopUsers = async () => {
	try {
		const database = getDatabase();
		const scoreRef = firebaseRef(database, 'todos/score/');
		const userRef = firebaseRef(database, 'todos/users/');

		const [scoreSnapshot, userSnapshot] = await Promise.all([
			get(scoreRef),
			get(userRef),
		]);

		if (scoreSnapshot.exists() && userSnapshot.exists()) {
			const scores = scoreSnapshot.val();
			const users = userSnapshot.val();
			const usersArray = [];

			for (const uid in scores) {
				const displayName = users[uid]?.displayName || 'Unknown User';

				usersArray.push({
					uid: uid,
					displayName: displayName,
					score: scores[uid].score,
				});
			}

			usersArray.sort((a, b) => b.score - a.score);
			topUsers.value = usersArray.slice(0, 10);
		} else {
			alert('No scores or users found');
		}
	} catch (error) {
		alert("Error fetching data: ", error);
	}
};

// Fetch the top users on component mount
onBeforeMount(() => {
	fetchTopUsers();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
.poppins {
	font-family: 'Poppins', sans-serif;
}
</style>
