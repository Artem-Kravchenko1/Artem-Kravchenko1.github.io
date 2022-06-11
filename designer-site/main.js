'use strict';

window.addEventListener('load', () => {

	var mobileCheck = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		},
		any: function() {
			return (mobileCheck.Android() || mobileCheck.BlackBerry() || mobileCheck.iOS() || mobileCheck.Opera() || mobileCheck.Windows());
		}
	};

	let isMobile = mobileCheck.any();
	if (isMobile) {
		let body = document.querySelector('body');
		body.classList.toggle('mobile');
		body.classList.toggle('mouse');
		let mobileActive = document.querySelector('.mobile__active');
		mobileActive.classList.add('active');

		let navArrow = document.querySelector('.mobile__arrow');
		let mobileList = document.querySelector('.mobile__list');

		navArrow.addEventListener('click', () => {
			mobileList.classList.toggle('active');
		})
	}











})