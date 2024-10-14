import { ref as vueRef, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import { ref as firebaseRef, getDatabase, get, child } from 'firebase/database';

import { useUserStore } from './Userstore.js'
export const AnalyticsStore = defineStore("analyticsStore", () => {

	const dbRef = firebaseRef(getDatabase(), 'todos/');
	const userstore = useUserStore();

	// Reactive score
	const score = vueRef(0);
	
	
	const getAnalyticsScore = async () => {
	  
		if (userstore.isLogin) {
			const scoreRef = child(dbRef, `todos/score/${userstore.user}`);
			alert(scoreRef.value)
			
			const snapshot = await get(scoreRef);
			if (snapshot.exists()) {
			  alert("exists")
				score.value = snapshot.val() || 0;
			} else {
				score.value = 0;
			}
		}
	};

	// Return the score and the method to access it
	return { score, getAnalyticsScore };
});
