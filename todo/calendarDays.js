'use strict';

import {database, ref, onValue} from './databaseInit.js';
import * as planningEvents from './popups.js';
import {nowPage, setNowPage} from './nowPage.js';

let isAuthorized = false;
if (localStorage.getItem('isAuthorized')) isAuthorized = localStorage.getItem('isAuthorized');
let userName = '';
if (localStorage.getItem('userName')) userName = localStorage.getItem('userName');

document.addEventListener('DOMContentLoaded', () => {

	if (isAuthorized == 'false') window.location.href = 'index.html';

	let headerExit = document.querySelector('.header__exit');
	headerExit.addEventListener('click', e => {
		localStorage.setItem('isAuthorized', 'false');
		localStorage.setItem('userName', '');
		window.location.href = '';
		e.preventDefault();
	})
	let headerName = document.querySelector('.header__username');
	headerName.textContent = userName;

	setNowPage('calendar');

	function onCalendarInputChange() {
		showCalendarYear = dateYearElement.value;
		showCalendarMonth = dateMonthElement.value;
		let thisMonthDate = new Date();
		if (showCalendarYear == thisMonthDate.getFullYear() && showCalendarMonth == thisMonthDate.getMonth() + 1) {
			document.body.classList.remove('isnt-this-month');
		} else {
			document.body.classList.add('isnt-this-month');
		}
		initCalendar();
	}

	function initCalendar() {
		clearCalendar();
		spawnDays();
		initDays();
		startCalendarByWeekDay();
		fixCalendarItemsBorder();
		initPlanningLinks();
	}

	function clearCalendar() {
		let calendar = document.querySelector('.calendar');
		const calendarLength = calendar.children.length;
		for(let i = 1; i < calendarLength; i++) {
			calendar.children[1].remove();
		}
	}

	function spawnDays() {
		let calendarDay = document.querySelector('.calendar__day');
		let monthDaysCount = new Date(showCalendarYear, showCalendarMonth, 0).getDate();
		for(let i = 0; i < monthDaysCount; i++) {
			let clone = calendarDay.cloneNode(true);
			clone.style = '';
			clone.classList = ['calendar__day'];
			calendarDay.after(clone);
		}
		calendarDay.remove();
	}

	function initDays() {
		let calendarDays = document.querySelector('.calendar').children;
		for(let i = 0; i < calendarDays.length; i++) {
			calendarDays[i].querySelector('.calendar__day-num').innerHTML = i+1;
			onValue(ref(database, `todolist-app/${userName}/calendarData/year_`+showCalendarYear+'/month_'+showCalendarMonth+'/day_'+(i+1)+'/items'), snapshot => {
				if (snapshot.val()) {
					calendarDays[i].querySelector('.items-num').innerHTML = Object.keys(snapshot.val()).length;
				} else {
					calendarDays[i].querySelector('.items-num').innerHTML = 0;
				}
				let event = new Event('change');
				calendarDays[i].querySelector('.items-num').dispatchEvent(event);
			});
			let dayDate = new Date(showCalendarYear, showCalendarMonth-1, i+1);
			let nowDate = new Date();
			if (nowDate.getFullYear() == dayDate.getFullYear() && nowDate.getMonth() == dayDate.getMonth() && nowDate.getDate() == dayDate.getDate()) {
				calendarDays[i].classList.add('today');
				initTodayProgressBar(i+1);
			}
			else if (nowDate.getTime() - dayDate.getTime() > 0) {
				setPastClass(calendarDays[i]);
				calendarDays[i].querySelector('.items-num').addEventListener('change', (event) => {setPastClass(event.target.closest('.calendar__day'))});
			} 
			calendarDays[i].setAttribute('href', 'day.html?date='+(i+1)+'s'+showCalendarMonth+'s'+showCalendarYear);
		}
		let nowDateYear = new Date().getFullYear();
		let nowDateMonth = parseInt(new Date().getMonth()) + 1;
		let calendarWeekDays = document.querySelectorAll('.calendar__week-day');
		for (let calendarWeekDay of calendarWeekDays) {
			calendarWeekDay.classList = ['calendar__week-day'];
		}
		if (nowDateYear == showCalendarYear && nowDateMonth == showCalendarMonth) {
			let weekDay = new Date().getDay();
			if (weekDay == 0) weekDay = 7;
			calendarWeekDays[weekDay-1].classList.add('active');
		}

		if (dateRequest) {
			document.querySelectorAll('.calendar__day')[dateRequest[0]-1].classList.add('link-day');
		}

		function setPastClass(day) {
			if (day.classList.contains('past')) day.classList.remove('past');
			if (day.classList.contains('past-lost')) day.classList.remove('past-lost');
			if ( parseInt( day.querySelector('.items-num').innerHTML ) > 0) {
				day.classList.add('past-lost');
			} else {
				day.classList.add('past');
			}
			
		}
	}

	function startCalendarByWeekDay() {
		let weekDay = new Date(showCalendarYear, showCalendarMonth-1, 1).getDay();
		if (weekDay == 0) weekDay = 7;
		let firstCalendarDay = document.querySelector('.calendar').children[0];
		firstCalendarDay.style.gridColumn = weekDay + ' / ' + (weekDay+1);
	}

	function fixCalendarItemsBorder() {
		let weekDay = new Date(showCalendarYear, showCalendarMonth-1, 1).getDay();
		if (weekDay == 0) weekDay = 7;
		
		let calendarDays = document.querySelector('.calendar').children;
		for(let i = 0; i < 8-weekDay; i++) {
			calendarDays[i].classList.add('border-bottom-unactive');
			calendarDays[i+7].classList.add('border-top-active');
		}
		for(let i = 0; i < 10; i++) {
			if (!calendarDays[8-weekDay+i*7]) break;
			calendarDays[8-weekDay+i*7].classList.add('border-left-active');
			if (weekDay == 1) {
				calendarDays[0].classList.add('border-left-active');
			}
		}
	}

	function initTodayProgressBar(day) {
		let itemsCount, doneItemsCount, progressPerCent;
		setProgressBarStyle(100);
		onValue(ref(database, `todolist-app/${userName}/calendarData/year_`+showCalendarYear+'/month_'+showCalendarMonth+'/day_'+day+'/items'), snapshot => {
			itemsCount = 0;
			doneItemsCount = 0;
			progressPerCent = 0;
			if (!snapshot.val()) {
				setProgressBarStyle(100);
				return;
			};
			let snapshotKeys = Object.keys(snapshot.val());
			itemsCount = snapshotKeys.length;
			for (let key of snapshotKeys) {
				if (snapshot.val()[key]['checked']) doneItemsCount++;
			}
			progressPerCent = doneItemsCount / itemsCount * 100;
			setProgressBarStyle(progressPerCent);
		})
	}

	function setProgressBarStyle(perCent) {
		let progressBar = document.querySelector('.calendar__day.today .border-before');
		let startTime = new Date().getTime();
		let time, during;
		let progressBarGrad = getComputedStyle(progressBar).backgroundImage;
		let startPerCent = progressBarGrad.slice(progressBarGrad.indexOf('rgb(0, 181, 0) ')+15, progressBarGrad.indexOf('%'));
		startPerCent = parseFloat(startPerCent);
		let distance = perCent - startPerCent;
		let timer = setInterval(() => {
			time = new Date().getTime();
			during = time - startTime;
			if (during > 150) {
				progressBar.style.backgroundImage = 'linear-gradient(to right bottom, rgb(0, 181, 0) '+perCent+'% , transparent '+(perCent+3)+'%)';
				clearInterval(timer);
				return;
			}
			progressBar.style.backgroundImage = 'linear-gradient(to right bottom, rgb(0, 181, 0) '+(startPerCent+distance*(during/150))+'% , transparent '+((startPerCent+distance*(during/150))+3)+'%)';
		}, 10);
		let progressLine = document.querySelector('.header__tab-progress-line .line-after');
		progressLine.style.width = perCent + '%';
	}

	function initPlanningLinks() {
		let planningBtns = document.querySelector('.planning').querySelectorAll('.planning__btn');
			for (let planningBtn of planningBtns) {
				planningEvents.initPopupLink(planningBtn);
				planningBtn.addEventListener('click', e => {
					let item = e.target.closest('.planning__container');
					if (item) {
						item.classList.add('plan-target');
						let itemContent = item.querySelector('.planning__content');
						if (itemContent) {
							itemContent.classList.add('plan-target-content');
						}
					}
				});
			}
	}




	let dateRequest = window.location.href.split('?')[1];
	if (dateRequest) {
		dateRequest = dateRequest.split('&');
		if (dateRequest) {
			dateRequest = dateRequest.map(item => {
				if (item.split('=')[0] == 'date') {
					return item.split('=')[1];
				}
			});
			if (dateRequest) dateRequest = dateRequest[0].split('s');
			if (dateRequest) dateRequest = dateRequest.map(item => parseInt(item));
		}
	}
	let requestYear, requestMonth, requestDay;
	if (dateRequest) [requestDay, requestMonth, requestYear] = dateRequest;

	let dateMonthElement = document.querySelector('[name=\"date-month\"]');
	let dateYearElement = document.querySelector('[name=\"date-year\"]');

	if (requestYear) dateYearElement.value = requestYear;
	else dateYearElement.value = new Date().getFullYear();

	if (requestMonth) dateMonthElement.value = requestMonth;
	else dateMonthElement.value = parseInt(new Date().getMonth())+1;

	let	showCalendarMonth, showCalendarYear;
	showCalendarMonth = dateMonthElement.value; 
	showCalendarYear = dateYearElement.value;
	
	dateMonthElement.addEventListener('change', onCalendarInputChange);
	dateYearElement.addEventListener('change', onCalendarInputChange);
	onCalendarInputChange();


	let dateUpdateButtons = document.querySelectorAll('.header__date-btn');
	dateUpdateButtons.forEach((element) => {

		element.addEventListener('click', (event) => {
			event.preventDefault();
			let dispEvent = new Event('change');
			let buttonTarget = document.querySelector('[name=\"date-month\"]');
			let buttonDirection = parseInt(element.dataset.buttonDirection);
			let setValue = parseInt(buttonTarget.value) + buttonDirection;
			if (setValue == 0 || setValue == 13) buttonTarget.value = Math.abs(setValue - 12);
			else buttonTarget.value = setValue;
			let yearField = document.querySelector('[name=\"date-year\"]');
			yearField.value = parseInt(yearField.value) + Math.floor( (setValue-1) / 12 );
			dateMonthElement.dispatchEvent(dispEvent);
			dateYearElement.dispatchEvent(dispEvent);
		})
		
	});

	let dateReturnButton = document.querySelector('.header__return-btn');
	dateReturnButton.addEventListener('click', (event) => {
		event.preventDefault();
		let dispEvent = new Event('change');
		let monthField = document.querySelector('[name=\"date-month\"]');
		let setMonthValue = new Date().getMonth() + 1;
		let setYearValue = new Date().getFullYear();
		monthField.value = setMonthValue;
		let yearField = document.querySelector('[name=\"date-year\"]');
		yearField.value = setYearValue;
		dateMonthElement.dispatchEvent(dispEvent);
		dateYearElement.dispatchEvent(dispEvent);
	})


	
});