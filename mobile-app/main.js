document.addEventListener('DOMContentLoaded', () => {

	let header, preheader, intro, headerHeight, preheaderHeight, headerOffsetTop;


	function headerInit() {
		header = document.querySelector('.header');
		preheader = document.querySelector('.preheader');
		burger = document.querySelector('.burger');
		burgerBtn = document.querySelector('.burger__btn');
		burgerContent = document.querySelector('.burger__content');
		body = document.querySelector('body');
		burgerActive = false;
		intro = document.querySelector('.intro');
		headerHeight = parseInt( getComputedStyle(header).height );
		preheaderHeight = parseInt( getComputedStyle(preheader).height );
		burgerContent.style.top = headerHeight + 'px';
		headerOffsetTop = preheaderHeight;
		headerMarginBottom = parseInt( getComputedStyle(header).marginBottom );
	}
	
	headerInit();
	
	function headerScrollHandler() {
		console.log(headerOffsetTop + headerHeight);
		if (window.pageYOffset > headerOffsetTop + headerHeight || burgerActive) {
			header.style.backgroundColor = 'rgb(0, 49, 113)';
			header.classList.add('header__fixed');
		} else if (window.pageYOffset > headerOffsetTop) {
			header.classList.add('header__fixed');
			intro.style.paddingTop = headerHeight + headerMarginBottom + 'px';
		}
		else {
			header.style.backgroundColor = 'rgb(0, 49, 113, 0.4)';
			header.classList.remove('header__fixed');
			intro.style.paddingTop = '0px';
		}
	}

	document.addEventListener('scroll', headerScrollHandler);
	window.addEventListener('resize', headerInit);
	burgerBtn.addEventListener('click', () => {
		burger.classList.toggle('active');
		burgerActive = !burgerActive;
		if (burgerActive) {
			header.style.backgroundColor = 'rgb(0, 49, 113)';
			header.classList.add('header__fixed');
			body.style.overflow = 'hidden';
		} else if (window.pageYOffset < headerOffsetTop) {
			header.style.backgroundColor = 'rgb(0, 49, 113, 0.4)';
			header.classList.remove('header__fixed');
			body.style.overflow = 'unset';
		} else {
			body.style.overflow = 'unset';
		}
	})



	let previews = document.querySelector('.video__list');
	previews.addEventListener('click', event => {
		let previewActive = document.querySelector('.preview.active');
		previewActive.classList.remove('active');
		let preview = event.target.closest('.preview');	
		preview.classList.add('active');

		let srcUrl = preview.dataset.url;

		let videoSrc = document.querySelector('.video__src');
		videoSrc.setAttribute('src', srcUrl);
	})


	new Swiper('.testimonials__slider', {
		pagination: {
			el: '.swiper-pagination',

			clickable: true,
		}
	});
});