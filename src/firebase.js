// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth  } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";


// Firebase configuration
const firebaseConfig = {
	apiKey: "api-key",
	authDomain: "domain",
	projectId: "ID",
	databaseURL : 'DB URL',
	storageBucket: "storage",
	messagingSenderId: "id",
	appId: "app id",
	measurementId: "id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services individually
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
