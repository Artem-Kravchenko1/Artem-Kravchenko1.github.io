// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgzYVfAi-RwsKuXWksb9u_4ygr6aQLNaE",
  authDomain: "todoist-85d90.firebaseapp.com",
  projectId: "todoist-85d90",
  storageBucket: "todoist-85d90.appspot.com",
  messagingSenderId: "895134333664",
  appId: "1:895134333664:web:bba0220feb77140c38ee85",
  databaseURL: "https://todoist-85d90-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { ref, get, getDatabase } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const database = getDatabase();
const dbRef = ref(database)


  function writeUserData() {
	const db = getDatabase();
	get(ref(db, 'new')).then( snapshot => {
		if (snapshot.exists()) {
			console.log(snapshot.val());
		  } else {
			console.log("No data available");
		  }
	});
  }

// setInterval(writeUserData, 1000);