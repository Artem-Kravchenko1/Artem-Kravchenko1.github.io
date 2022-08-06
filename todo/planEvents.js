import {ref, database, set, onValue, get, child} from './databaseInit.js';
import { nowPage } from './nowPage.js';
import { initDay } from './dayItems.js';

let isAuthorized = false;
if (localStorage.getItem('isAuthorized')) isAuthorized = localStorage.getItem('isAuthorized');
let userName = '';
if (localStorage.getItem('userName')) userName = localStorage.getItem('userName');

export function setPlanEvent(jsonObject) {
	let maxEventNum = 0;
	onValue(ref(database, `todolist-app/${userName}/planEvents`), snaphot => {
		if (snaphot.val() && snaphot.val()['maxEventNum']) maxEventNum = snaphot.val()['maxEventNum'];
		console.log(jsonObject);
		set(ref(database, `todolist-app/${userName}/planEvents/event_`+(maxEventNum+1)), jsonObject).then(() => {
			set(ref(database, `todolist-app/${userName}/planEvents/event_`+(maxEventNum+1) + '/eventId'), maxEventNum+1).then(() => {
				set(ref(database, `todolist-app/${userName}/planEvents/maxEventNum`), maxEventNum + 1).then(() => {
					setAllPlanItems(jsonObject, maxEventNum+1);
				})
			})
		})
	}, {onlyOnce: true});
}

let locked = false;

function setAllPlanItems(jsonObject, planItemId) {
	if (locked) {
		alert('Подождите несколько секунд');
		return;
	}
	locked = true;
	console.log('unlocked');

	onValue(ref(database, `todolist-app/${userName}/calendarData`), snapshot => {
		let calendar = snapshot.val();
		let yearsCount = Object.keys(snapshot.val()).length;
		let targets = {};

		let datesSet = new Set();
		let lastDatesSetLength = datesSet.size;
		
		let firstDate = jsonObject['firstDate'];
		let firstYear = firstDate['year'];
		let firstMonth = firstDate['month'];
		let firstDay = firstDate['day'];
		
		let iter = 0;
		let onceDates = jsonObject['onceDates'];
		for (let dateObj of Object.values(onceDates)) {
			setDate(calendar, dateObj, iter++, targets, datesSet, lastDatesSetLength, jsonObject, planItemId);
		}
	
		let planDates = jsonObject['planDates'];

	

		for (let year = firstYear; year < firstYear + yearsCount; year++) {


			if (planDates['everyYear']) {
				let everyYearDates = planDates['everyYear'];
				for (let date of Object.values(everyYearDates)) {
					let dateObj = {
						'year': year,
						'month': date['month'],
						'day': date['day'],
						'hour': date['hour'],
						'minute': date['minute'],
					}
					setDate(calendar, dateObj, iter++, targets, datesSet, lastDatesSetLength, jsonObject, planItemId);
				}
			}


			if (year != firstYear) firstMonth = 1;
			for (let month = firstMonth; month <= 12; month++) {


				if (planDates['everyMonth']) {
					let everyMonthDates = planDates['everyMonth'];
					for (let date of Object.values(everyMonthDates)) {
						let dateObj = {
							'year': year,
							'month': month,
							'day': date['day'],
							'hour': date['hour'],
							'minute': date['minute'],
						}
						setDate(calendar, dateObj, iter++, targets, datesSet, lastDatesSetLength, jsonObject, planItemId);
					}
				}


				let monthDayCount = new Date(year, month, 0).getDate();
				if (month != firstMonth) firstDay = 1;
				for (let day = firstDay; day <= monthDayCount; day++) {
					

					if (planDates['everyWeek']) {
						let everyWeekDates = planDates['everyWeek'];
						let cycleWeekDay = new Date(year, month-1, day).getDay();
						if (cycleWeekDay == 0) cycleWeekDay = 7;
						for (let date of Object.values(everyWeekDates)) {
							let weekDay = date['weekDay'];
							if (cycleWeekDay == weekDay) {
								let dateObj = {
									'year': year,
									'month': month,
									'day': day,
									'hour': date['hour'],
									'minute': date['minute'],
								}
								setDate(calendar, dateObj, iter++, targets, datesSet, lastDatesSetLength, jsonObject, planItemId);
							}
						}
					}


					if (planDates['everyDay']) {
						let everyDayDates = planDates['everyDay'];
						for (let date of Object.values(everyDayDates)) {
							let dateObj = {
								'year': year,
								'month': month,
								'day': day,
								'hour': date['hour'],
								'minute': date['minute'],
							}
							setDate(calendar, dateObj, iter++, targets, datesSet, lastDatesSetLength, jsonObject, planItemId);
						}
					}
				}
			}
		}
		setAllDates(calendar, planItemId, targets);
	}, {onlyOnce: true})
}


function setAllDates(calendar, planItemId, targets) {
	console.log(targets);

		set(ref(database, `todolist-app/${userName}/calendarData`), calendar).then(() => {
			set(ref(database, `todolist-app/${userName}/planEvents/event_`+planItemId+'/targets'), targets).then(() => {
				locked = false;
				if (nowPage == 'day') initDay();
				document.querySelector('.planning-events').classList.remove('open');
				console.log(locked);
			})
		})
}


function setDate(calendar, date, iter, targets, datesSet, lastDatesSetLength, jsonObject, planItemId) {
	let nextItemId = 1;
	let day = calendar['year_'+date['year']]['month_'+date['month']]['day_'+date['day']];
	let items = {};

	datesSet.add(`${date['year']}/${date['month']}/${date['day']}/${date['hour']}/${date['minute']}`);
	if (datesSet.size == lastDatesSetLength) return;
	else lastDatesSetLength = datesSet.size;

	// console.log(`todolist-app/${userName}/calendarData/year_`+date['year']+'/month_'+date['month']+'/day_'+date['day']);
	if (day['items']) items = day['items'];
	if (day['nextItemId']) nextItemId = day['nextItemId'];

	targets['target_'+(iter+1)] = {
		'targetId': (iter+1),
		'way': 'year_'+date['year']+'/month_'+date['month']+'/day_'+date['day']+'/items/item_'+nextItemId,
	}
	if (!day['items']) calendar['year_'+date['year']]['month_'+date['month']]['day_'+date['day']]['items'] = {};
	calendar['year_'+date['year']]['month_'+date['month']]['day_'+date['day']]['items']['item_'+nextItemId] = {
		'content': jsonObject['content'],
		'itemId': nextItemId,
		'planItemId': planItemId,
		'time': {
			'hour': date['hour'],
			'minute': date['minute'],
		}
	}
	calendar['year_'+date['year']]['month_'+date['month']]['day_'+date['day']]['nextItemId'] = nextItemId+1;
}


export function changePlanEvent(item) {
	let planItemId = item.dataset.planItemId;
	onValue(ref(database, `todolist-app/${userName}`), snapshot => {
		if (!snapshot.val()) return;

		let calendar = {};
		if (snapshot.val()['calendarData']) calendar = snapshot.val()['calendarData'];
		let event = {}
		if (snapshot.val()['planEvents']['event_'+planItemId]) event = snapshot.val()['planEvents']['event_'+planItemId];
		let targets = {};
		if (event['targets']) targets = event['targets'];

		for (let key of Object.keys(targets)) {
			let target = targets[key];
			let wayList = target['way'].split('/');
			if (calendar[wayList[0]][wayList[1]][wayList[2]][wayList[3]]) {
				if (calendar[wayList[0]][wayList[1]][wayList[2]][wayList[3]][wayList[4]]) calendar[wayList[0]][wayList[1]][wayList[2]][wayList[3]][wayList[4]]['content'] = item.querySelector('.plan-target-content').innerHTML;
			}
		}
		set(ref(database, `todolist-app/${userName}/calendarData`), calendar).then(() => {
			set(ref(database, `todolist-app/${userName}/planEvents/event_`+planItemId+'/content'), item.querySelector('.plan-target-content').textContent)
		})
	}, {onlyOnce: true})
}

export function removePlanEvent(item) {
	let planItemId = item.dataset.planItemId;
	onValue(ref(database, `todolist-app/${userName}`), snapshot => {
		if (!snapshot.val()) return;

		let calendar = {};
		if (snapshot.val()['calendarData']) calendar = snapshot.val()['calendarData'];
		let event = {}
		if (snapshot.val()['planEvents']['event_'+planItemId]) event = snapshot.val()['planEvents']['event_'+planItemId];
		let targets = {};
		if (event['targets']) targets = event['targets'];

		for (let key of Object.keys(targets)) {
			let target = targets[key];
			let wayList = target['way'].split('/');
			if (calendar[wayList[0]][wayList[1]][wayList[2]][wayList[3]]) {
				if (calendar[wayList[0]][wayList[1]][wayList[2]][wayList[3]][wayList[4]]) calendar[wayList[0]][wayList[1]][wayList[2]][wayList[3]][wayList[4]] = {};
			}
		}
		set(ref(database, `todolist-app/${userName}/calendarData`), calendar).then(() => {
			set(ref(database, `todolist-app/${userName}/planEvents/event_`+planItemId), {})
		})
	}, {onlyOnce: true})
}