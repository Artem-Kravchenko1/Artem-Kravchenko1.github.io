'use strict';

import {database, ref, onValue, set} from './databaseInit.js';
import * as planningEvents from './popups.js';
import {setPlanEvent, changePlanEvent, removePlanEvent} from './planEvents.js';
import {nowPage, setNowPage} from './nowPage.js';

let isAuthorized = false;
if (localStorage.getItem('isAuthorized')) isAuthorized = localStorage.getItem('isAuthorized');
let userName = '';
if (localStorage.getItem('userName')) userName = localStorage.getItem('userName');

let dateRequest;
let requestYear, requestMonth, requestDay;
let dayYearElement, dayMonthElement, dayDateElement;
let showDayDate, showDayMonth, showDayYear;
let items, descriptionContent, nextItemId, gridHeight, gridRowHeight, gridRowGap;
let itemResizeObserver, itemContentObserver, mutationObserverConfig;
let itemsColumnsCount;








document.addEventListener('DOMContentLoaded', () => {

	if (isAuthorized == 'false') window.location.href = 'index.html';

	setNowPage('day');

	let headerExit = document.querySelector('.header__exit');
	headerExit.addEventListener('click', e => {
		localStorage.setItem('isAuthorized', 'false');
		localStorage.setItem('userName', '');
		window.location.href = '';
		e.preventDefault();
	})
	let headerName = document.querySelector('.header__username');
	headerName.textContent = userName;

	if (!window.location.href.split('/').at(-1).startsWith('day.html')) {
		return;
	}
	
	dateRequest = window.location.href.split('?')[1];
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
	if (dateRequest) [requestDay, requestMonth, requestYear] = dateRequest;
	
	dayYearElement = document.querySelector('[name=\"date-year\"]');
	dayMonthElement = document.querySelector('[name=\"date-month\"]');
	dayDateElement = document.querySelector('[name=\"date-day\"]');
	
	if (requestYear && dayYearElement) dayYearElement.value = requestYear;
	else if (dayYearElement) dayYearElement.value = new Date().getFullYear();
	
	if (requestMonth && dayMonthElement) dayMonthElement.value = requestMonth;
	else if (dayMonthElement) dayMonthElement.value = parseInt(new Date().getMonth())+1;
	
	if (requestDay && dayDateElement) dayDateElement.value = requestDay;
	else if (dayDateElement) dayDateElement.value = new Date().getDate();
	
	if (dayYearElement) showDayYear = dayYearElement.value;
	if (dayMonthElement) showDayMonth = dayMonthElement.value;
	if (dayDateElement) showDayDate = dayDateElement.value;
	
	itemResizeObserver = new ResizeObserver(onItemResize);
	
	itemContentObserver = new MutationObserver((mutationRecords) => {
		for (let key of Object.keys(mutationRecords)) {
			let target = mutationRecords[key].target;
	
			if (mutationRecords[key].type == 'childList') {
				let event = new ClipboardEvent('paste');
				target.dispatchEvent(event);
			}
			break;
		}
	});
	mutationObserverConfig = { attributes: true, childList: true, subtree: true};
	
	itemsColumnsCount = getComputedStyle(document.querySelector('.items__content')).gridTemplateColumns;
	itemsColumnsCount = itemsColumnsCount.split(' ');
	itemsColumnsCount = itemsColumnsCount.length;



	let dateUpdateButtons = document.querySelectorAll('.header__date-btn');
	dateUpdateButtons.forEach((element) => {


		element.addEventListener('click', (event) => {
			event.preventDefault();
			let dispEvent = new Event('change');
			let buttonTarget = document.querySelector('[name=\"date-day\"]');
			let buttonDirection = parseInt(element.dataset.buttonDirection);
			let setValue = parseInt(buttonTarget.value) + buttonDirection;
			buttonTarget.value = setValue;
			dayDateElement.dispatchEvent(dispEvent);
			dayMonthElement.dispatchEvent(dispEvent);
			dayYearElement.dispatchEvent(dispEvent);
		})
		
	});

	let dateReturnButton = document.querySelector('.header__return-btn');
	dateReturnButton.addEventListener('click', (event) => {
		event.preventDefault();
		let setDayValue = new Date().getDate();
		let setMonthValue = new Date().getMonth() + 1;
		let setYearValue = new Date().getFullYear();

		let dayField = document.querySelector('[name=\"date-day\"]');
		dayField.value = setDayValue;
		let monthField = document.querySelector('[name=\"date-month\"]');
		monthField.value = setMonthValue;
		let yearField = document.querySelector('[name=\"date-year\"]');
		yearField.value = setYearValue;
		
		let dispEvent = new Event('change');
		dayMonthElement.dispatchEvent(dispEvent);
		dayYearElement.dispatchEvent(dispEvent);
	})
	
	dayYearElement.addEventListener('change', onDateInputChange);
	dayMonthElement.addEventListener('change', onDateInputChange);
	dayDateElement.addEventListener('change', onDateInputChange);
	onDateInputChange();

	


	

	let itemAppenderField = document.querySelector('[data-item-id=\"-1\"] .item__text');
	itemAppenderField.addEventListener('input', onItemFieldInputting);
	itemAppenderField.addEventListener('focusout', onAppenderFieldInput);
	itemAppenderField.addEventListener('paste', checkSpamToField);
	itemResizeObserver.observe(itemAppenderField.closest('.items__item'));
	itemContentObserver.observe(itemAppenderField, mutationObserverConfig);
	itemAppenderField.closest('.items__item').classList.add('empty');
	let textareaField = document.querySelector('.description__content');
	textareaField.addEventListener('focusout', onTextareaFieldInput);
	

	let confirmBtn = document.querySelector('.plan__confirm-btn');
	confirmBtn.addEventListener('click', initDay);
})

function onDateInputChange() {
	let showDayFull = new Date(dayYearElement.value, dayMonthElement.value-1, dayDateElement.value);
	dayDateElement.value = showDayFull.getDate();
	dayMonthElement.value = showDayFull.getMonth() + 1;
	dayYearElement.value = showDayFull.getFullYear();
	showDayDate = dayDateElement.value;
	showDayMonth = dayMonthElement.value;
	showDayYear = dayYearElement.value;
	localStorage.setItem('showDayDate', showDayDate);
	localStorage.setItem('showDayMonth', showDayMonth);
	localStorage.setItem('showDayYear', showDayYear);

	let todayDate = new Date();
	if (showDayYear == todayDate.getFullYear() && showDayMonth == todayDate.getMonth() + 1 && showDayDate == todayDate.getDate()) {
		document.body.classList.remove('isnt-today');
	} else {
		document.body.classList.add('isnt-today');
	}
	initDay();
}



function clearDay() {
	let day = document.querySelectorAll('.items__item');
	for (let i = 0; i < day.length-1; i++) {
		day[i].remove();
	}
}



function setItemsHeight() {
	if (!items) return;
	let itemsRowsCount = Math.floor( (Object.keys(items).length) / itemsColumnsCount ) + 1;
	document.querySelector('.items__content').style.gridTemplateRows = `repeat(${itemsRowsCount}, 1fr)`;
	gridRowHeight = document.querySelector('.items__item').offsetHeight;
	let gridPaddingTop = getComputedStyle(document.querySelector('.items__content')).paddingTop;
	let gridPaddingBottom = getComputedStyle(document.querySelector('.items__content')).paddingBottom;
	gridRowGap = getComputedStyle(document.querySelector('.items__content')).rowGap;
	gridHeight = parseInt(gridPaddingTop) + gridRowHeight*itemsRowsCount + parseInt(gridRowGap)*(itemsRowsCount-1) + parseInt(gridPaddingBottom);
	document.querySelector('.items__content').style.height = gridHeight + 'px';	
}

function initProgressLines() {
	let itemsCount, doneItemsCount, progressPerCent;
	setProgressLinesStyles(100);
	onValue(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/items'), snapshot => {
		itemsCount = 0;
		doneItemsCount = 0;
		progressPerCent = 0;
		if (!snapshot.val()) {
			setProgressLinesStyles(100);
			return;
		}
		let snapshotKeys = Object.keys(snapshot.val());
		itemsCount = snapshotKeys.length;
		for (let key of snapshotKeys) {
			if (snapshot.val()[key]['checked']) doneItemsCount++;
		}
		progressPerCent = doneItemsCount / itemsCount * 100;
		setProgressLinesStyles(progressPerCent);
	})
}

function setProgressLinesStyles(perCent) {
	let progressLines = document.querySelectorAll('.content-progres-line .line-after');
	for (let line of progressLines) {
		line.style.width = perCent + '%';
	}
}

export function initDay() {
	initItems();
	initProgressLines();
}

function initItems() {
	onValue(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate), snapshot => {
		console.log(`todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate);
		console.log(snapshot.val());
		clearDay();
		items = {};
		nextItemId = 1;
		descriptionContent = '';
		if (snapshot.val()['items']) items = snapshot.val()['items'];
		if (snapshot.val()['nextItemId']) nextItemId = snapshot.val()['nextItemId'];
		else {
			nextItemId = Object.keys(items).length;
			set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/nextItemId'), nextItemId);
		}
		if (snapshot.val()['textareaContent']) descriptionContent = snapshot.val()['textareaContent'];
		let item = document.querySelector('.items__item');
		for (let key of Object.keys(items)) {
			let clone = item.cloneNode(true);
			clone.style = '';
			clone.classList = ['items__item'];
			clone.dataset.itemId = items[key].itemId;
			// console.log(items);
			if (items[key].planItemId) {
				let timeHour = items[key].time.hour;
				let timeMinute = items[key].time.minute;

				clone.dataset.itemHour = timeHour;
				clone.dataset.itemMinute = timeMinute;
				clone.querySelector('.item__time .field').textContent = `${timeHour}:${timeMinute}`;
				clone.classList.add('plan-item');
				clone.dataset.planItemId = items[key].planItemId;
				clone.classList.add('plan-target');
				clone.querySelector('.item__text').classList.add('plan-target-content')
			};
			clone.querySelector('.item__text').innerHTML = items[key].content;
			clone.querySelector('.item__text').addEventListener('input', onItemFieldInputting);
			clone.querySelector('.item__text').addEventListener('focusout', onItemFieldInput);
			clone.querySelector('.item__text').addEventListener('paste', checkSpamToField);
			itemResizeObserver.observe(clone);
			itemContentObserver.observe(clone.querySelector('.item__text'), mutationObserverConfig);
			item.before(clone);
		}
		let desc = document.querySelector('.description__content');
		desc.innerHTML = descriptionContent;

		let itemsDelete = document.querySelector('.items__content').querySelectorAll('.item__delete');
		for (let itemDelete of itemsDelete) {
			itemDelete.addEventListener('click', event => {
				event.preventDefault();
				let item = event.target.closest('.items__item');
				let itemId = item.dataset.itemId;
				if (item.classList.contains('plan-item')) removePlanEvent(item);
				set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/items/item_'+itemId), {});
				initDay();
			})
		}

		let itemsPlanning = document.querySelector('.items__content').querySelectorAll('.item__planning');
		for (let itemPlanning of itemsPlanning) {
			
			planningEvents.initPopupLink(itemPlanning);
			itemPlanning.addEventListener('click', e => {
				let item = e.target.closest('.items__item');
				if (item) {
					item.classList.add('plan-target');
					let itemContent = item.querySelector('.item__text');
					if (itemContent) {
						itemContent.classList.add('plan-target-content');
					}
				}
			});
		}

		let itemsCheckBoxes = document.querySelector('.items__content').querySelectorAll('input[name=\"item-checkbox\"]');
		for (let box of itemsCheckBoxes) {
			let itemId = box.closest('.items__item').dataset.itemId;
			if (itemId == '-1') break;
			box.checked = false;
			if (items['item_'+itemId] && items['item_'+itemId].hasOwnProperty('checked')) box.checked = items['item_'+itemId]['checked'];
			
			box.addEventListener('change', (event) => {
				let box = event.target.closest('input[name=\"item-checkbox\"]');

				let boxCheck = box.checked;
				set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/items/item_'+itemId+'/checked'), boxCheck);
			});
		}
		document.querySelector('.header__tab-link').setAttribute('href', 'calendar.html?date='+showDayDate+'s'+showDayMonth+'s'+showDayYear);
		
		setItemsHeight();
	})
}

function onItemFieldInput(event) {
	console.log('input');
	let itemField = event.target.closest('.item__text');
	let item = itemField.closest('.items__item')
	let itemId = item.dataset.itemId;
	item.classList.remove('inputting');
	let itemFieldContent = itemField.innerHTML;
	if (item.classList.contains('plan-item') && itemField.innerHTML == '') {
		removePlanEvent(item);
		initDay();
	} else if (item.classList.contains('plan-item')) {
		changePlanEvent(item);
		initDay();
	} else if (itemField.innerHTML == '') {
		set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/items/item_'+itemId), {});
	} else {
		set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/items/item_'+itemId), {
			itemId: itemId,
			content: itemFieldContent,
		});
	}
}

function onAppenderFieldInput(event) {
	let targetItemAppender = event.target.closest('.items__item');
	targetItemAppender.classList.remove('inputting');
	if (targetItemAppender.querySelector('.item__text').innerHTML == '') return;
	let clone = targetItemAppender.cloneNode(true);
	clone.querySelector('.item__text').innerHTML = '';
	setItemsHeight();
	setTimeout(() => {
		targetItemAppender.after(clone);
		let itemId = nextItemId;
		targetItemAppender.dataset.itemId = itemId;
		let targetItemAppenderField = event.target;
		
		let newItemAppenderField = document.querySelector('[data-item-id=\"-1\"] .item__text');
		targetItemAppenderField.removeEventListener('focusout', onAppenderFieldInput);
		targetItemAppenderField.removeEventListener('focusout', onItemFieldInputting);
		targetItemAppenderField.removeEventListener('paste', checkSpamToField);
		itemResizeObserver.unobserve(targetItemAppenderField.closest('.items__item'));
		// itemContentObserver.unobserve(targetItemAppenderField.closest('.items__item'));
		newItemAppenderField.addEventListener('focusout', onAppenderFieldInput);
		newItemAppenderField.addEventListener('input', onItemFieldInputting);
		newItemAppenderField.addEventListener('paste', checkSpamToField);
		itemResizeObserver.observe(newItemAppenderField.closest('.items__item'));
		itemContentObserver.observe(newItemAppenderField, mutationObserverConfig);
		newItemAppenderField.closest('.items__item').classList.add('empty')
		set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/nextItemId'), itemId+1).then(() => {
			set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/items/item_'+itemId), {
				itemId: itemId,
				content: targetItemAppenderField.innerHTML
			}).then(() => {
				initDay();
			})
		})
	}, 150)
}

function onTextareaFieldInput(event) {
	let descriptionFieldContent = event.target.closest('.description__content').innerHTML; 
	set(ref(database, `todolist-app/${userName}/calendarData/year_`+showDayYear+'/month_'+showDayMonth+'/day_'+showDayDate+'/textareaContent'), descriptionFieldContent);
}

function onItemFieldInputting(event) {
	if (event.target.closest('.item__text').innerHTML == '') {
		event.target.closest('.items__item').classList.remove('inputting');
		event.target.closest('.items__item').classList.add('empty');
		return;
	};
	event.target.closest('.items__item').classList.add('inputting');
	event.target.closest('.items__item').classList.remove('empty');
	setItemsHeight();
	
}

function onItemResize() {
	setItemsHeight();
}

function checkSpamToField(event) {
	let field = event.target.closest('.item__text');
	let sleepDuration = 191;
	let paste = '';
	if (event.clipboardData || window.clipboardData) paste = (event.clipboardData || window.clipboardData).getData('text');
	if (paste.length > 213) {
		event.preventDefault();
		alert('Можно вставлять только меньше 213 символов (у вас ' + paste.length + ')');
	};
	if (!field.lastItemUpdate) {
		field.lastItemUpdate = {
			nodesCount: 0,
			lastUpdateDate: new Date().getTime() - 1000,
			innerHTML: '',
		}
	}
	if (paste != '') {
		field.lastItemUpdate.isPaste = true;
		if (new Date().getTime() - field.lastItemUpdate.lastUpdateDate < sleepDuration) event.preventDefault();
	}
	else if (field.childNodes.length > field.lastItemUpdate.nodesCount && new Date().getTime() - field.lastItemUpdate.lastUpdateDate < sleepDuration && !field.lastItemUpdate.isPaste) {
		field.childNodes[field.childNodes.length-1].remove();
		field.lastItemUpdate.isPaste = false;
	} else {
		field.lastItemUpdate.isPaste = false;
	}
	field.lastItemUpdate.nodesCount = field.childNodes.length;
	field.lastItemUpdate.lastUpdateDate = new Date().getTime();
	field.lastItemUpdate.innerHTML = field.innerHTML;
}