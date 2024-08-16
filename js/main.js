const swiper = new Swiper('.certificates__slider', {
	loop: true,
	// slidesPerView: 1.25,
	slidesPerView: "auto",
	centeredSlides: true,
	effect: 'coverflow',
	spaceBetween: 40,

	coverflowEffect: {
		depth: 150,
		rotate: 0,
		slideShadows: false,
	},

	pagination: {
		el: '.certificates__dots',
		type: 'bullets',
		clickable: true,
	},

	breakpoints: {
		479: {
			// slidesPerView: 1.5,
			spaceBetween: 60,
		},
		767: {
			// slidesPerView: 1.75,
			spaceBetween: 80,
		},
		991: {
			// slidesPerView: 2,
			spaceBetween: 100,
		},
		1199: {
			// slidesPerView: 2.5,
			spaceBetween: 120,
		}
	},
});

const swiper2 = new Swiper('.works__slider', {
	loop: true,
	// slidesPerView: 1.25,
	slidesPerView: "auto",
	centeredSlides: true,
	effect: 'coverflow',
	spaceBetween: 60,

	coverflowEffect: {
		depth: 40,
		rotate: 0,
		slideShadows: false,
	},
	
	pagination: {
		el: '.works__dots',
		type: 'bullets',
		clickable: true,
	},

	breakpoints: {
		479: {
			// slidesPerView: 1.5,
		},
		767: {
			// slidesPerView: 2,
		},
		991: {
			// slidesPerView: 2.5,
		},
		1199: {
			// slidesPerView: 3,
		}
	},
});

const swiper3 = new Swiper('.reviews__slider', {
	loop: true,
	slidesPerView: 1.25,
	centeredSlides: true,
	effect: 'coverflow',
	spaceBetween: 40,

	coverflowEffect: {
		depth: 150,
		rotate: 0,
		slideShadows: false,
	},
	
	pagination: {
		el: '.reviews__dots',
		type: 'bullets',
		clickable: true,
	},

	breakpoints: {
		479: {
			slidesPerView: 1.25,
			spaceBetween: 60,
		},
		767: {
			slidesPerView: 1.5,
			spaceBetween: 80,
		},
		991: {
			slidesPerView: 1.75,
			spaceBetween: 100,
		},
		1199: {
			spaceBetween: 100,
			slidesPerView: 2.5,
		}
	},
});

$(function() {
    $(window).on("scroll", function() {
        if($(window).scrollTop() > 50) {
            $(".header").addClass("active");
        } else {
			$(".header").removeClass("active");
        }

		let windowHeight = document.documentElement.clientHeight;
		let aboutScroll = document.querySelector(".about").offsetTop;
		let servicesScroll = document.querySelector(".services").offsetTop;
		let worksScroll = document.querySelector(".works").offsetTop;
		let reviewsScroll = document.querySelector(".reviews").offsetTop;
		let contactsScroll = document.querySelector(".contacts").offsetTop;

		console.log($(window).scrollTop(), aboutScroll, servicesScroll, reviewsScroll, contactsScroll)

		if($(window).scrollTop() + windowHeight/2 > aboutScroll) {
            if ($(".nav__item.nav__item--active").attr("href") != "#about") {
				$(".nav__item.nav__item--active").removeClass("nav__item--active");
				$('.nav__item[href="#about"]').addClass("nav__item--active");
			}
        }
		if ($(window).scrollTop() + windowHeight/2 > servicesScroll) {
			if ($(".nav__item.nav__item--active").attr("href") != "#services") {
				$(".nav__item.nav__item--active").removeClass("nav__item--active");
				$('.nav__item[href="#services"]').addClass("nav__item--active");
			}
        }
		if ($(window).scrollTop() + windowHeight/2 > worksScroll) {
			if ($(".nav__item.nav__item--active").attr("href") != "#works") {
				$(".nav__item.nav__item--active").removeClass("nav__item--active");
				$('.nav__item[href="#works"]').addClass("nav__item--active");
			}
        }
		if ($(window).scrollTop() + windowHeight/2 > reviewsScroll) {
			if ($(".nav__item.nav__item--active").attr("href") != "#reviews") {
				$(".nav__item.nav__item--active").removeClass("nav__item--active");
				$('.nav__item[href="#reviews"]').addClass("nav__item--active");
			}
        }
		if ($(window).scrollTop() + windowHeight/2 > contactsScroll) {
			if ($(".nav__item.nav__item--active").attr("href") != "#contacts") {
				$(".nav__item.nav__item--active").removeClass("nav__item--active");
				$('.nav__item[href="#contacts"]').addClass("nav__item--active");
			}
        }

    });
});

const burgerButton = document.querySelector(".burger__button")
burgerButton.addEventListener('click', () => {
	burgerButton.classList.toggle('active');
})

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 100
    }, 500);
});

const imgs = document.querySelectorAll('.fullImg');
const fullPage = document.querySelector('.fullpage');
const fullPageImg = document.querySelector('.fullpage__image');
const fullPageBtn = document.querySelector('.fullpage__button');

imgs.forEach(img => {
	img.addEventListener('click', function() {
		fullPage.classList.add('active');
		fullPageImg.style.backgroundImage = 'url(' + img.src + ')';
	});
});

fullPageBtn.addEventListener('click', () => {
	fullPage.classList.remove('active');
});