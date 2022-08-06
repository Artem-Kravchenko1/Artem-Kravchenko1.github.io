'use strict';

import {database, ref, onValue, set, createCalendarData} from './databaseInit.js';

let users = {};
document.addEventListener('DOMContentLoaded', () => {
	
	let tabLinks = document.querySelectorAll('.authorization .tab__links a');
	for (let link of tabLinks) {
		link.addEventListener('click', (e) => {
			let activeLink = document.querySelector('.authorization .tab__links a.active');
			let targetItem = document.querySelector('.authorization .tab__targets .authorization__item.target');
			if (activeLink) activeLink.classList.remove('active');
			if (targetItem) targetItem.classList.remove('target');

			let link = e.target.closest('a')
			let item = document.querySelector(link.getAttribute('href'));
			if (link) link.classList.add('active');
			if (item) item.classList.add('target');
		})
	}



	let confirmBtn = document.querySelector('.authorization .confirm');
	if (confirmBtn) {
		confirmBtn.addEventListener('click', (e) => {
			let target = document.querySelector('.authorization__item.target').id;
			authorization(target);
			e.preventDefault();
		});
	}
})



function authorization(type) {
	onValue(ref(database, 'todolist-app/users'), snapshot => {
		if (snapshot.val()) users = snapshot.val();
		let login = '';
		let password = '';

		if (type == 'login') {
			login = document.querySelector(`[name=\"login-login\"]`).value;
			password = document.querySelector(`[name=\"login-password\"]`).value;

			if (!Object.keys(users).includes(login)) {
				alert('Аккаунт не найден!');
				return;
			}

			if (users[login] != password) {
				alert('Неверные данные');
				return;
			}

			if (users[login] == password) {
				localStorage.setItem('isAuthorized', 'true');
				localStorage.setItem('userName', login);
				window.location.href = 'calendar.html';
			} else {
				alert('Неизвестная ошибка');
				return;
			}

		} else if (type == 'signup') {
			login = document.querySelector(`[name=\"signup-login\"]`).value;
			password = document.querySelector(`[name=\"signup-password\"]`).value;

			if (Object.keys(users).includes(login)) {
				alert('Такой аккаунт уже существует!');
				return;
			}

			users[login] = password;
			set(ref(database, 'todolist-app/users'), users).then(() => {
				createCalendarData(`todolist-app/${login}`);
				localStorage.setItem('isAuthorized', true);
				localStorage.setItem('userName', login);
				window.location.href = 'calendar.html';
			})
		}
	})
}