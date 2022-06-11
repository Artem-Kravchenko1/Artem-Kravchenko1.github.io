window.addEventListener('load', () => {

	burger = document.querySelector('.burger');

	burger.addEventListener('click', () => {
		burger.classList.toggle('active');
	})

	sliderRow = document.querySelector('.slider__row');



	let startX, endX, offset;
	sliderRow.width = parseInt( getComputedStyle(sliderRow.parentElement).width );
	sliderRow.columnGap = parseInt( getComputedStyle(sliderRow).columnGap );
	let sliderDot = document.querySelector('.slider__dot-1');
	let sliderDotNum = 1;
	function sliderSwipeHandler(event) {
		event.preventDefault();
		endX = event.clientX;
		offset = endX - startX;
		
		sliderRow.style.left = parseInt(startLeft) + (offset) + 'px';
	}

	function sliderLeaveHandler(event) {
		event.preventDefault();
		endX = event.clientX;
		offset = endX - startX;
		sliderLeft = parseInt(sliderRow.style.left) || 0;

		sliderRow.removeEventListener('mousemove', sliderSwipeHandler);
		sliderRow.removeEventListener('touchmove', sliderSwipeHandler);
		if (Math.abs(offset) > sliderRow.width / 2 && (sliderLeft <= 0 && sliderLeft + -parseInt( getComputedStyle(sliderRow.children[0]).width ) >= -parseInt( getComputedStyle(sliderRow).width ))) {
			animateForward(0.77, offset, startLeft);
			sliderDot.classList.toggle('active');
			sliderDotNum += -Math.sign(offset);
			sliderDot = document.querySelector('.slider__dot-' + sliderDotNum);
			sliderDot.classList.toggle('active');
		} else {
			animateBack(0.77, offset, startLeft);
		}
	}

	function sliderDownHandler(event) {
		event.preventDefault();
		startX = event.clientX;
		startLeft = sliderRow.style.left;
		if (sliderRow.style.left == '') startLeft = 0;
		
		sliderRow.addEventListener('mousemove', sliderSwipeHandler);
		sliderRow.addEventListener('mouseleave', sliderLeaveHandler);

		sliderRow.addEventListener('touchmove', sliderSwipeHandler);
		sliderRow.addEventListener('touchleave', sliderLeaveHandler);
	}

	function sliderUpHandler(event) {
		event.preventDefault();
		endX = event.clientX;
		offset = endX - startX;
		sliderLeft = parseInt(sliderRow.style.left) || 0;

		if (Math.abs(offset) > sliderRow.width / 2 && (sliderLeft <= 0 && sliderLeft + -parseInt( getComputedStyle(sliderRow.children[0]).width ) >= -parseInt( getComputedStyle(sliderRow).width ))) {
			animateForward(0.77, offset, startLeft);
			sliderDot.classList.toggle('active');
			sliderDotNum += -Math.sign(offset);
			sliderDot = document.querySelector('.slider__dot-' + sliderDotNum);
			sliderDot.classList.toggle('active');
		} else {
			animateBack(0.77, offset, startLeft);
		}
		sliderRow.removeEventListener('mousemove', sliderSwipeHandler);
		sliderRow.removeEventListener('mouseleave', sliderLeaveHandler);

		sliderRow.removeEventListener('touchmove', sliderSwipeHandler);
		sliderRow.removeEventListener('touchleave', sliderLeaveHandler);
	}
	
	
	

	function animateBack(seconds, offset, startLeft) {

		sliderRow.removeEventListener('mousedown', sliderDownHandler);
		sliderRow.removeEventListener('mouseup', sliderUpHandler);
		sliderRow.removeEventListener('mousemove', sliderSwipeHandler);
		sliderRow.removeEventListener('mouseleave', sliderLeaveHandler);
		sliderRow.removeEventListener('touchmove', sliderSwipeHandler);
		sliderRow.removeEventListener('touchleave', sliderLeaveHandler);
		sliderRow.removeEventListener('touchstart', sliderDownHandler);
		sliderRow.removeEventListener('touchend', sliderUpHandler);

		let start = Date.now();
		let animateOffset = offset;
		console.log(animateOffset);
		let animateStartLeft = startLeft;
		console.log(animateStartLeft);

		let timePassed;
		let timer = setInterval(function() {
			timePassed = Date.now() - start;
			// сколько времени прошло с начала анимации?
		  
			if (timePassed >= seconds*1000) {
			  clearInterval(timer); // закончить анимацию через 2 секунды
			  sliderRow.style.left = parseInt(animateStartLeft) + 'px';
			  sliderRow.addEventListener('mousedown', sliderDownHandler);
			  sliderRow.addEventListener('mouseup', sliderUpHandler);
			  sliderRow.addEventListener('touchstart', sliderDownHandler);
			  sliderRow.addEventListener('touchend', sliderUpHandler);
			  return;
			}
		  
			// отрисовать анимацию на момент timePassed, прошедший с начала анимации
			drawBack(timePassed, seconds, animateOffset, animateStartLeft);
		  
		  }, 10);
	}

	function animateForward(seconds, offset, startLeft) {

		sliderRow.removeEventListener('mousedown', sliderDownHandler);
		sliderRow.removeEventListener('mouseup', sliderUpHandler);
		sliderRow.removeEventListener('mousemove', sliderSwipeHandler);
		sliderRow.removeEventListener('mouseleave', sliderLeaveHandler);
		sliderRow.removeEventListener('touchmove', sliderSwipeHandler);
		sliderRow.removeEventListener('touchleave', sliderLeaveHandler);
		sliderRow.removeEventListener('touchstart', sliderDownHandler);
		sliderRow.removeEventListener('touchend', sliderUpHandler);

		let start = Date.now();
		let animateOffset = offset;
		console.log(animateOffset);
		let animateStartLeft = startLeft;
		console.log(animateStartLeft);
		let timePassed;
		// if (timer) return false;

		let timer = setInterval(function() {
			timePassed = Date.now() - start;
			console.log(timePassed);
			// сколько времени прошло с начала анимации?
		  
			if (timePassed >= seconds*1000) {
			  clearInterval(timer); // закончить анимацию через 2 секунды
			  sliderRow.style.left = parseInt(animateStartLeft) + Math.sign(animateOffset) * (sliderRow.width + sliderRow.columnGap) + 'px';
				sliderRow.addEventListener('mousedown', sliderDownHandler);
				sliderRow.addEventListener('mouseup', sliderUpHandler);
				sliderRow.addEventListener('touchstart', sliderDownHandler);
				sliderRow.addEventListener('touchend', sliderUpHandler);
			  return;
			}
		  
			// отрисовать анимацию на момент timePassed, прошедший с начала анимации
			drawForward(timePassed, seconds, animateOffset, animateStartLeft);
		  
		  }, 10);

		
	}

	function drawBack(timePassed, seconds, animateOffset, animateStartLeft) {
		let k = timePassed / (seconds*1000);
		sliderRow.style.left = parseInt(animateStartLeft) + (1-k)*(animateOffset) + 'px';
		console.log(sliderRow.style.left);
	}

	function drawForward(timePassed, seconds, animateOffset, animateStartLeft) {
		let k = timePassed / (seconds*1000);
		sliderRow.style.left = parseInt(animateStartLeft) + animateOffset + k*( Math.sign(animateOffset) * (sliderRow.width + sliderRow.columnGap) - animateOffset ) + 'px';
		console.log(sliderRow.style.left);
	}

	sliderRow.addEventListener('mousedown', sliderDownHandler);
	sliderRow.addEventListener('mouseup', sliderUpHandler);
	sliderRow.addEventListener('touchstart', sliderDownHandler);
	sliderRow.addEventListener('touchend', sliderUpHandler);
	
	// sliderRow.addEventListener('mouseleave', () => {
	// 	sliderRow.removeEventListener('mousemove', sliderSwipeHandler);
	// 	sliderRow.removeEventListener('mouseleave', sliderLeaveHandler);
	// });



 	function dotClickHandler(event) {
		let dot = this;
		let dotNum = parseInt(dot.id);
		let startLeft = sliderRow.style.left || '0px';
		alert( parseInt(startLeft) - Math.sign(dotNum - sliderDotNum) + 'px' );
		for (let i = 0; i < Math.abs(dotNum - sliderDotNum); i++) {
			animateForward(0.77, -Math.sign(dotNum - sliderDotNum), parseInt(startLeft) + Math.sign(dotNum - sliderDotNum) + 'px');
			sliderDot.classList.toggle('active');
			sliderDotNum += Math.sign(dotNum - sliderDotNum);
			sliderDot = document.querySelector('.slider__dot-' + sliderDotNum);
			sliderDot.classList.toggle('active');
		}
	 }

	let sliderDots = document.querySelectorAll('.slider__dot');
	for(let dot of sliderDots) {
		if (getComputedStyle(dot).display != 'none') dot.addEventListener('click', dotClickHandler);
	}
	
	
})