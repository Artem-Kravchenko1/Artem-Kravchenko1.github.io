document.addEventListener('DOMContentLoaded', () => {
	projectLinks = document.querySelectorAll('.projects__nav .nav__item');
	for (let link of projectLinks) {
		link.addEventListener('click', (event) => {
			document.querySelector('.projects__content-active').classList.remove('projects__content-active');
			document.querySelector('#' + event.target.closest('.nav__item').dataset.target ).classList.add('projects__content-active');

			document.querySelector('.projects__nav .nav__item.nav__item-active').classList.remove('nav__item-active');
			event.target.closest('.nav__item').classList.add('nav__item-active');
		})
	}

	blogsLinks = document.querySelectorAll('.blogs__list .blogs__link');
	for (let link of blogsLinks) {
		link.addEventListener('click', (event) => {
			document.querySelector('.blogs__content-active').classList.remove('blogs__content-active');
			document.querySelector('#' + event.target.closest('.blogs__link').dataset.target ).classList.add('blogs__content-active');

			document.querySelector('.blogs__list .blogs__link.blogs__link-active').classList.remove('blogs__link-active');
			event.target.closest('.blogs__link').classList.add('blogs__link-active');
		})
	}

	footerLinks = document.querySelectorAll('.footer__list .footer__link');
	for (let link of footerLinks) {
		link.addEventListener('mouseover', (event) => {
			document.querySelector('.footer__placeholder-active').classList.remove('footer__placeholder-active');
			document.querySelector('#' + event.target.closest('.footer__link').dataset.target ).classList.add('footer__placeholder-active');

			document.querySelector('.footer__list .footer__link.footer__link-active').classList.remove('footer__link-active');
			event.target.closest('.footer__link').classList.add('footer__link-active');
		})
	}

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
	
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth'
			});
		});
	});
})