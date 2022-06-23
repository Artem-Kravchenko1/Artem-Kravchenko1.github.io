document.addEventListener("DOMContentLoaded", () => {

	header = document.querySelector('.header');
	burger = document.querySelector('.burger');
	burgerContent = document.querySelector('.burger__content');
	burgerBtn = document.querySelector('.burger__btn');
	
	burgerBtn.addEventListener('click', () => {
		burger.classList.toggle('active');
		headerHeight = parseInt( getComputedStyle(header).height );
		burgerContent.style.top = headerHeight + 'px';
	})

	introData = {
		intro_1: {
			introTitle: 'Бесплатный аудит вашей рекламы',
			introSubtitle: 'Указание на ошибки и недостатки в Вашей рекламе, а так же консультация по дальнейшему развитию.',
			introBG: '../img/intro-bg-1.jpg',
			introWheel: '../img/intro-1.png',
		},

		intro_2: {
			introTitle: 'Бесплатная консультация',
			introSubtitle: 'Ответим на все Ваши вопросы. Подберем подходящий вид рекламы для Вашего бизнеса.',
			introBG: '../img/intro-bg-2.jpg',
			introWheel: '../img/intro-2.png',
		},

		intro_3: {
			introTitle: 'Всегда с вами на связи',
			introSubtitle: 'Звоните в удобное для вас время до 22:00.',
			introBG: '../img/intro-bg-3.jpg',
			introWheel: '../img/intro-3.png',
		},

		intro_4: {
			introTitle: 'Ведение вашей рекламы',
			introSubtitle: 'Ведение и развитие Вашей рекламы. Отчетность по требованию.',
			introBG: '../img/intro-bg-4.jpg',
			introWheel: '../img/intro-4.png',
		},

		intro_5: {
			introTitle: 'Защита от скликивания',
			introSubtitle: 'Защитим Вашу рекламу от ботов и нецелевых посетителей. Установка стороннего сервиса.',
			introBG: '../img/intro-bg-5.jpg',
			introWheel: '../img/intro-5.png',
		},
	}


	function hideIntro(duration) {
		intro = document.querySelector('.intro');
		start = Date.now();
		timer = setInterval(() => {
			now = Date.now();
			if ((now - start) > duration) {
				intro.style.opacity = 0;
				clearInterval(timer);
			}
			intro.style.opacity = 1 - ( (now - start) / duration );
		}, 10)
	}

	function showIntro(duration) {
		intro = document.querySelector('.intro');
		start = Date.now();
		timer = setInterval(() => {
			now = Date.now();
			if ((now - start) > duration) {
				intro.style.opacity = 1;
				clearInterval(timer);
			}
			intro.style.opacity = ( (now - start) / duration );
		}, 10)
	}

	nowIntro = 1;
	function drawIntro(num) {
		intro = document.querySelector('.intro');
		introTitle = document.querySelector('.intro__title');
		introSubtitle = document.querySelector('.intro__text');
		introWheel = document.querySelector('.wheel__img');

		hideIntro(250);
		setTimeout(() => {
			intro.style.backgroundImage = 'url(' + introData['intro_' + num].introBG + ')';
			introTitle.innerHTML = introData['intro_' + num].introTitle;
			introSubtitle.innerHTML = introData['intro_' + num].introSubtitle;
			introWheel.setAttribute('src', introData['intro_' + num].introWheel);

			document.querySelector('.intro__bullet.active').classList.remove('active');
			document.querySelector('.intro__bullet[data-num=\"' + nowIntro + '\"]').classList.add('active');
		}, 250)
		setTimeout(() => {
			showIntro(250);
		}, 500)
	}

	if(window.matchMedia('(min-width: 768px)').matches) {
		prevIntroButton = document.querySelector('.intro__left-arrow');
		nextIntroButton = document.querySelector('.intro__right-arrow');
		introButtons = document.querySelector('.intro__arrows');

		prevIntroButton.addEventListener('click', () => {
			if (nowIntro == 1) {
				nowIntro = 5;
			} else {
				nowIntro--;
			}
			drawIntro(nowIntro);
		})
		nextIntroButton.addEventListener('click', () => {
			if (nowIntro == 5) {
				nowIntro = 1;
			} else {
				nowIntro++;
			}
			drawIntro(nowIntro);
		})
		
	} else {
		introBullets = document.querySelectorAll('.intro__bullet');
		for (let introBullet of introBullets) {
			introBullet.addEventListener('click', (event) => {
				if (nowIntro == event.target.closest('.intro__bullet').dataset.num) return;
				nowIntro = event.target.closest('.intro__bullet').dataset.num;
				drawIntro(nowIntro);
			})
		}
	}

})