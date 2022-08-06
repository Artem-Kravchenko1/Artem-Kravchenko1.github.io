// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeT9vzxmNOhDFBSKtJ86R_XV9MFXWzE6w",
    authDomain: "todolist-9686e.firebaseapp.com",
    databaseURL: "https://todolist-9686e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "todolist-9686e",
    storageBucket: "todolist-9686e.appspot.com",
    messagingSenderId: "238416465154",
    appId: "1:238416465154:web:2614063c347d3e5784861b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { ref, set, get, child, getDatabase, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const database = getDatabase();
export {database, ref, set, onValue, get, child};


// set(ref(database, 'todolist-app/planEvents'), {});

export function createCalendarData(way) {
	let calendar = {};
	for (let year = 2022; year < 2033; year++) {
		calendar['year_'+year] = {};
		for (let month = 1; month < 13; month++) {
			calendar['year_'+year]['month_'+month] = {};
			let dayCount = 0;
			dayCount = new Date(year, month, 0).getDate();
			// console.log(dayCount);
			for (let day = 1; day <= dayCount; day++) {
			calendar['year_'+year]['month_'+month]['day_'+day] = {
				items: {},
				textareaContent: "",
			};
			// set(ref(database, `todolist-app/calendarData/year_${year}/month_${month}/day_${day}`), {calendarData: calendar});
			// console.log(`todolist-app/calendarData/year_${year}/month_${month}/`);
				
			}
		}
	}
	console.log('yeah')
	set(ref(database, `${way}/calendarData`), calendar);
}

createCalendarData('todolist-app/Artem');