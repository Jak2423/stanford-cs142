'use strict';

class DatePicker {
	constructor(id, callbackFunc) {
		this.id = id;
		this.callbackFunc = callbackFunc;
	}

	render(date) {
		var parent = document.getElementById(this.id);
		var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'Semptember',
			'October',
			'November',
			'December',
		];

		var calendarDiv = document.createElement('div');
		calendarDiv.classList.add('calendar');
		parent.appendChild(calendarDiv);

		var monthDiv = document.createElement('div');
		monthDiv.classList.add('month-header');
		calendarDiv.appendChild(monthDiv);

		var leftButton = document.createElement('button');
		leftButton.classList.add('arrow');
		leftButton.innerHTML = '<';
		monthDiv.appendChild(leftButton);

		var monthTitle = document.createElement('p');
		monthTitle.innerHTML = `<p>${
			months[date.getMonth()]
		} ${date.getFullYear()}</p>`;
		monthDiv.appendChild(monthTitle);

		var rightButton = document.createElement('button');
		rightButton.classList.add('arrow');
		rightButton.innerHTML = '>';
		monthDiv.appendChild(rightButton);

		leftButton.addEventListener('click', () => {
			calendarDiv.remove();
			date.setMonth(date.getMonth() - 1);
			this.render(date);
		});

		rightButton.addEventListener('click', () => {
			calendarDiv.remove();
			date.setMonth(date.getMonth() + 1);
			this.render(date);
		});

		var weeksDiv = document.createElement('div');
		weeksDiv.classList.add('day-of-week');
		calendarDiv.appendChild(weeksDiv);

		for (var i = 0; i < 7; i++) {
			weeksDiv.innerHTML += `<p>${weekDays[i]}</p>`;
		}

		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var curDate = new Date(firstDay);
		curDate.setDate(-firstDay.getDay() + 1); //setDate tuhain sariin udriig uurchluh

		while (true) {
			for (var j = 0; j < 7; ++j) {
				var dayButton = document.createElement('button');
				dayButton.innerHTML = curDate.getDate();
				weeksDiv.appendChild(dayButton);

				if (curDate.getMonth() === date.getMonth()) {
					const fixedDate = {
						month: curDate.getMonth() + 1,
						day: dayButton.innerHTML,
						year: curDate.getFullYear(),
					};
					dayButton.addEventListener('click', () => {
						this.callbackFunc(this.id, fixedDate);
					});
				} else {
					dayButton.classList.add('other-month');
				}

				curDate.setDate(curDate.getDate() + 1);
			}

			if (curDate.getMonth() !== date.getMonth()) {
				break;
			}
		}
	}
}
