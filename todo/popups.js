'use strict';
import {initPlanningEventsForm} from './planEventsForm.js';

let fixedElements = document.querySelectorAll('.fixed-element');
let unlock = true;
let timeout = 300;
let body = document.querySelector('body');

document.addEventListener('DOMContentLoaded', () => {
	
	
	let popupLinks = document.querySelectorAll('.popup-link');
	for (let link of popupLinks) {
		initPopupLink(link);
	}
	
	let popupCloseLinks = document.querySelectorAll('.popup-close');
	for (let link of popupCloseLinks) {
		if (link.closest('.planning-events')) continue;
		initPopupCloseLink(link);
	}

	
	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 27) {
			let popupActive = document.querySelector('.popup.open');
			closePopup(popupActive);
		}
	})

})

function initPopupLink(link) {
	let targetPopup = document.querySelector(link.getAttribute('href'));
	link.addEventListener('click', (e) => {
		openPopup(targetPopup, link);
		e.preventDefault();
	})
}

function initPopupCloseLink(link) {
	let targetPopup = link.closest('.popup');
	link.addEventListener('click', (e) => {
		closePopup(targetPopup);
		e.preventDefault();
	})
}

function openPopup(popup, link) {
	if (popup && unlock) {
		let popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			closePopup(popupActive, false);
		} else {
			bodyLock();
		}
		popup.classList.add('open');

		if (popup.classList.contains('planning-events')) initPlanningEventsForm(popup.querySelector('.planning-events__content'), link);
		
		popup.addEventListener('click', (e) => {
			if (!e.target.closest('.popup__content') && e.target.closest('.popup') && !e.target.closest('.planning-events')) {
				closePopup(e.target.closest('.popup'));
			}
		})
	}
}

function closePopup(popup, doUnlock = true) {
	if (unlock) {
		popup.classList.remove('open');
		if (doUnlock) {
			bodyUnlock();
		}
	}	
}

function bodyLock() {
	let scrollWidth = window.innerWidth - document.querySelector('.popup').offsetWidth;
	for (let e of fixedElements) {
		e.style.paddingRight = scrollWidth + 'px';
	}
	body.style.paddingRight = scrollWidth + 'px';
	body.classList.add('scroll-hidden');

	unlock = false;
	setTimeout(() => {
		unlock = true;
	}, timeout)
}

function bodyUnlock() {
	setTimeout(() => {
		for (let e of fixedElements) {
			e.style.paddingRight = '';
		}
		body.style.paddingRight = '';
		body.classList.remove('scroll-hidden');
	}, timeout)

	unlock = false;
	setTimeout(() => {
		unlock = true;
	}, timeout);
}

export {initPopupLink};
