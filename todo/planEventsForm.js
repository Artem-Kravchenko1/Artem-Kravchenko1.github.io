'use strict';
import {setPlanEvent} from './planEvents.js';

let targetLink;
document.addEventListener('DOMContentLoaded', () => {
	let planningEvents = document.querySelector('.planning-events.open');
	if (planningEvents) initPlanningEventsForm(planningEvents.querySelector('.planning-events__content'));
	let confirmBtn = document.querySelector('.plan__confirm-btn');
	confirmBtn.addEventListener('click', e => {
		alert('Форма отправляется...\nОкно закроется автоматически');
		sendPlanningEventsFormToDB(targetLink);
		e.preventDefault();
	});
})

export function initPlanningEventsForm(element, link) {
	targetLink = link;

	let pages = element.querySelectorAll('.plan-dates__page');
	setPagesHeight(pages, element);


	let tabLinks = document.querySelectorAll('.plan-dates__tabs-item');
	for (let link of tabLinks) {
		link.addEventListener('click', targetToPage);
	}

	let dateItems = document.querySelectorAll('.date-item');
	for (let item of dateItems) {
		item.addEventListener('input', onLastDateItemInput);
		setClassForEmptyFields(item);
	}

	for (let field of document.querySelectorAll('.item-field')) {
		field.value = ''
	}

	document.querySelector('.first-dates__content .day-field').value = localStorage.getItem('showDayDate');
	document.querySelector('.first-dates__content .month-field').value = localStorage.getItem('showDayMonth');
	document.querySelector('.first-dates__content .year-field').value = localStorage.getItem('showDayYear');
	document.querySelector('.first-dates__content .hour-field').value = new Date().getHours();
	document.querySelector('.first-dates__content .minute-field').value = new Date().getMinutes();

	document.querySelector('.once-dates__item .day-field').value = localStorage.getItem('showDayDate');
	document.querySelector('.once-dates__item .month-field').value = localStorage.getItem('showDayMonth');
	document.querySelector('.once-dates__item .year-field').value = localStorage.getItem('showDayYear');
	document.querySelector('.once-dates__item .hour-field').value = new Date().getHours();
	document.querySelector('.once-dates__item .minute-field').value = new Date().getMinutes();

	for (let item of document.querySelectorAll('.date-item')) {
		let e = new InputEvent('input');
		item.dispatchEvent(e);
	}
}




function setPagesHeight(pages, element) {
	let maxPageHeight = 0;
	for (let page of pages) {
		let pageHeight = parseFloat( getComputedStyle(page).height );
		if (pageHeight > maxPageHeight) maxPageHeight = pageHeight;
	}

	let pagesElement = element.querySelector('.plan-dates__pages');
	pagesElement.style.height = maxPageHeight + 'px';
}



function targetToPage(e) {
	let link = e.target.closest('.plan-dates__tabs-item');

	let activeLink = document.querySelector('.plan-dates__tabs-item.targeter');
	if (activeLink) activeLink.classList.remove('targeter');
	link.classList.add('targeter');

	
	let activeElement = document.querySelector('.plan-dates__page.target');
	if (activeElement) activeElement.classList.remove('target');
	let targetElement = document.querySelector(link.getAttribute('href'));
	targetElement.classList.add('target');

	e.preventDefault()
}



function onLastDateItemInput(e) {
	let item = e.target.closest('.date-item');

	setClassForEmptyFields(item);
	
	if (!item.nextElementSibling && !isDateItemEmpty(item, true) && !item.classList.contains('first-dates__item')) {
		appendNewField(item);
	}

	if (isDateItemEmpty(item)) {
		if (!item.classList.contains('last')) {
			item.remove();
		}
	}
	setFullDatesString();

}

function appendNewField(item) {
	let itemClone = item.cloneNode(true);
	item.insertAdjacentElement('afterend', itemClone);
	item.classList.remove('last');
	item.querySelector('.date-item__delete').addEventListener('click', e => {
		e.target.closest('.date-item').remove();
		setFullDatesString();
		e.preventDefault();
	})
	clearNewField(itemClone);
	itemClone.classList.add('last');
	itemClone.addEventListener('input', onLastDateItemInput);
}

function clearNewField(item) {
	let itemFields = item.querySelectorAll('.item-field');

	for (let field of itemFields) {
		field.value = '';
	}

	setClassForEmptyFields(item);
}

function setClassForEmptyFields(item) {
	let itemFields = item.querySelectorAll('.item-field');
	
	for (let field of itemFields) {
		if (field.value == '') {
			field.classList.add('empty');
		} else {
			field.classList.remove('empty');
		}
	}
}

function isDateItemEmpty(item, isOnce = false) {
	let itemFields = item.querySelectorAll('.item-field');
	let isEmpty = true;
	for (let field of itemFields) {
		if (field.value != '') {
			isEmpty = false;
			if (!isOnce) break;
		} else if (isOnce) {
			isEmpty = true;
			break;
		}
	}

	return isEmpty;
}



function setFullDatesString() {
	let string = '';


	let firstDate = document.querySelector('.first-dates__content .date-item');
	string += 'Первая дата - ';
	string += dateItemToString(firstDate) + '. ';


	let onceDates = document.querySelectorAll('.once-dates__content .date-item');
	if (onceDates.length > 1) {
		string += 'Отдельные даты: ';
		for (let item of onceDates) {
			if (item.matches('.last')) continue;
			string += dateItemToString(item) + ', ';
		}
		string = string.slice(0, string.length-2);
		string += '. ';
	}



	let isPlansStarted = false;
	let planDayDates = document.querySelectorAll('.plan-dates__day-page .date-item');
	if (planDayDates.length > 1) {
		if (!isPlansStarted) {
			string += 'Запланированые даты: ';
			isPlansStarted = true;
		}
		string += 'каждый день - ';
		for (let item of planDayDates) {
			if (item.matches('.last')) continue;
			string += dateItemToString(item) + ', ';
		}
		string = string.slice(0, string.length-2);
		string += '; ';
	}
	let planWeekDates = document.querySelectorAll('.plan-dates__week-page .date-item');
	if (planWeekDates.length > 1) {
		if (!isPlansStarted) {
			string += 'Запланированые даты: ';
			isPlansStarted = true;
		}
		string += 'каждую неделю - ';
		for (let item of planWeekDates) {
			if (item.matches('.last')) continue;
			string += dateItemToString(item) + ', ';
		}
		string = string.slice(0, string.length-2);
		string += '; ';
	}
	let planMonthDates = document.querySelectorAll('.plan-dates__month-page .date-item');
	if (planMonthDates.length > 1) {
		if (!isPlansStarted) {
			string += 'Запланированые даты: ';
			isPlansStarted = true;
		}
		string += 'каждый месяц - ';
		for (let item of planMonthDates) {
			if (item.matches('.last')) continue;
			string += dateItemToString(item) + ', ';
		}
		string = string.slice(0, string.length-2);
		string += '; ';
	}
	let planYearDates = document.querySelectorAll('.plan-dates__year-page .date-item');
	if (planYearDates.length > 1) {
		if (!isPlansStarted) {
			string += 'Запланированые даты: ';
			isPlansStarted = true;
		}
		string += 'каждый год - ';
		for (let item of planYearDates) {
			if (item.matches('.last')) continue;
			string += dateItemToString(item) + ', ';
		}
		string = string.slice(0, string.length-2);
		string += '; ';
	}
	string = string.slice(0, string.length-2) + '.';

	

	let planSentence = document.querySelector('.plan-sentence');
	planSentence.textContent = string;
}

function dateItemToString(item) {
	let dateString = '';

	for (let child of item.querySelectorAll('.write-field')) {
		if (child.matches('span')) {
			dateString += child.textContent + ' ';
		} else if (child.matches('input.item-field')) {
			dateString += child.value + ' ';
		} else if (child.matches('select.item-field')) {
			let selectedOption = child.querySelector('option[value=\"'+child.value+'\"');
			dateString += selectedOption.textContent + ' ';
		}
	}

	return dateString.slice(0, dateString.length-1);
}

function sendPlanningEventsFormToDB(link) {
	console.log(link);
	let form = setFullDatesToJSON();
	if (form) {
		console.log(link);
		form['content'] = link.closest('.plan-target').querySelector('.plan-target-content').textContent;
		console.log(form);
		setPlanEvent(form);
	} else {
		let planTarget = link.closest('.plan-target');
		if (planTarget) {
			let planTargetContent = planTarget.querySelector('.plan-target-content');
			if (planTargetContent) planTargetContent.classList.remove('plan-target-content');
			planTarget.classList.remove('plan-target-content');
		}
	}
}

function setFullDatesToJSON() {
	let jsonObject = {};



	let firstDate = document.querySelector('.first-dates__content .date-item');
	jsonObject['firstDate'] = dateItemToJSON(firstDate);

	let onceDates = document.querySelectorAll('.once-dates__content .date-item');
	jsonObject['onceDates'] = {};
	if (onceDates.length > 1) {
		for (let i=0; i<onceDates.length; i++) {
			let item = onceDates[i];
			if (item.matches('.last')) continue;
			jsonObject['onceDates']['date_'+(i+1)] = dateItemToJSON(item);
		}
	}



	let planDayDates = document.querySelectorAll('.plan-dates__day-page .date-item');
	jsonObject['planDates'] = {
		'everyDay': {},
		'everyWeek': {},
		'everyMonth': {},
		'everyYear': {},
	}
	if (planDayDates.length > 1) {

		for (let i=0; i<planDayDates.length; i++) {
			let item = planDayDates[i];
			if (item.matches('.last')) continue;
			jsonObject['planDates']['everyDay']['date_'+(i+1)] = dateItemToJSON(item);
		}
	}
	let planWeekDates = document.querySelectorAll('.plan-dates__week-page .date-item');
	if (planWeekDates.length > 1) {
		for (let i=0; i<planWeekDates.length; i++) {
			let item = planWeekDates[i];
			if (item.matches('.last')) continue;
			jsonObject['planDates']['everyWeek']['date_'+(i+1)] = dateItemToJSON(item);
		}
	}
	let planMonthDates = document.querySelectorAll('.plan-dates__month-page .date-item');
	if (planMonthDates.length > 1) {
		for (let i=0; i<planMonthDates.length; i++) {
			let item = planMonthDates[i];
			if (item.matches('.last')) continue;
			jsonObject['planDates']['everyMonth']['date_'+(i+1)] = dateItemToJSON(item);
		}
	}
	let planYearDates = document.querySelectorAll('.plan-dates__year-page .date-item');
	if (planYearDates.length > 1) {
		for (let i=0; i<planYearDates.length; i++) {
			let item = planYearDates[i];
			if (item.matches('.last')) continue;
			jsonObject['planDates']['everyYear']['date_'+(i+1)] = dateItemToJSON(item);
		}
	}

	
	return jsonObject;
}

function dateItemToJSON(item) {
	let dateJSON = {};

	for (let child of item.querySelectorAll('.item-field')) {
		if (child.matches('.day-field')) {
			dateJSON['day'] = parseInt(child.value);
		} else if (child.matches('.week-field')) {
			dateJSON['weekDay'] = parseInt(child.value);
		} else if (child.matches('.month-field')) {
			dateJSON['month'] = parseInt(child.value);
		} else if (child.matches('.year-field')) {
			dateJSON['year'] = parseInt(child.value);
		} else if (child.matches('.hour-field')) {
			dateJSON['hour'] = parseInt(child.value);
		} else if (child.matches('.minute-field')) {
			dateJSON['minute'] = parseInt(child.value);
		}
	}

	return dateJSON;
}