
import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import { auth, storage, firestore } from '../firebase.js';
import { useTodoStore } from './Store.js';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getDatabase, ref as firebaseRef, set } from 'firebase/database';

export const useUserStore = defineStore("userstore", () => {
	const user = ref(null);
	const isLogin = ref(false);
	const errorMessage = ref(null);
	const store = useTodoStore();
	// Persist user state between page reloads
	
	onMounted(() => {
		const storedUser = localStorage.getItem('user');
		
		const storedLoginStatus = localStorage.getItem('isLogin');

		if (storedUser && storedLoginStatus === 'true') {
			user.value = JSON.parse(storedUser);
			
			isLogin.value = true; 
		}
		

		// Firebase listener for auth state changes
		onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				user.value = currentUser.uid;
				
				isLogin.value = true;
				localStorage.setItem('user', JSON.stringify(currentUser.uid));
				
				
				localStorage.setItem('isLogin', 'true');
			} else {
				user.value = null;
				isLogin.value = false;
				localStorage.removeItem('user');
				localStorage.removeItem('isLogin');
			}
		});
	});

	// Signup function
	const signup = async (email, password, name, file) => {
	try {
		store.todolist = [];

		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		user.value = userCredential.user.uid;

		// Set user data in Firebase Realtime Database
		const db = firebaseRef(getDatabase(), `todos/users/${user.value}`);
		const data = { displayName: name };

		await set(db, data)
			.then(() => {
				alert(`User data successfully saved`);
			})
			.catch((error) => {
				alert('Error adding todo:', error);
			});

		// Update user profile with display name and photoURL
		await updateProfile(userCredential.user, {
			displayName: name,
		});

		isLogin.value = true;
		localStorage.setItem('user', JSON.stringify(user.value));
		localStorage.setItem('isLogin', 'true');
		errorMessage.value = '';
	} catch (error) {
		errorMessage.value = error.message;
	}
};


	// Login function
	const login = async (email, password) => {
		try {
		  store.todolist = []
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			user.value = userCredential.user;
			alert(userCredential.user)
			isLogin.value = true;
			localStorage.setItem('user', JSON.stringify(user.value.uid)); // Store the full user object
			localStorage.setItem('isLogin', 'true');
			errorMessage.value = '';
		} catch (error) {
			errorMessage.value = error.message; // Store error message
		}
	};

	// Logout function
	const logout = async () => {
		try {
		  store.todolist = []
			await signOut(auth);
			user.value = null;
			isLogin.value = false;
			localStorage.removeItem('user');
			localStorage.removeItem('isLogin');
			errorMessage.value = '';
		} catch (error) {
			errorMessage.value = error.message;
		}
	};

	return { user, isLogin, errorMessage, signup, login, logout  };
});
