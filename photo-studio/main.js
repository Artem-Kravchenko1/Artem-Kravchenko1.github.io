window.addEventListener('load', () => {

	let burger = document.querySelector('.burger');

	burger.addEventListener('click', () => {
		burger.classList.toggle('active');
	})

	let slides;
	if (window.matchMedia("(min-width: 768px)").matches) {
		slides = 3;
	  } else if (window.matchMedia("(min-width: 481px)").matches) {
		slides = 2;
	  } else {
		  slides = 1;
	  }

	new Swiper('.slider', {
		slidesPerView: slides,
		slidesPerGroup: slides,

		pagination: {
			el: '.swiper-pagination',

			clickable: true,
		}
	});
	
})