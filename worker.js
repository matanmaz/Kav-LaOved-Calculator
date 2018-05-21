function Worker(startWorkDate, endWorkDate, isEligibleToSeperation) {
	this.startWorkDate = startWorkDate;
	this.endWorkDate = endWorkDate;
	this.isEligibleToSeperation = isEligibleToSeperation;
	this.daysPerWeek = DEFAULT_WORK_WEEK;
	this.dateDiff = getDateDiff(startWorkDate, endWorkDate);
}

Worker.prototype = {
	getWorkDaysPerWeek: function () {
		return this.daysPerWeek;
	},

	getCompensation: function () {
		return this.getMonthWage(this.endWorkDate) * (this.dateDiff[0] + this.dateDiff[1] / 12);
	},

	isEligibleEarlyNoticeCompensation: function () {
		//A worker is eligible if he worked less than a year (if he wasn't fired)
		//OR if he is eligible for pitzuyim
		return this.isEligibleToSeperation || this.dateDiff[0] < 1;
	},

	isEligibleToSeparationCompensation: function () {
		return this.isEligibleToSeperation && this.dateDiff[0] >= 1;
	},

	pensionTableInitRunningDate: function (startDate, staticVars) {
		staticVars['months_waited'] = 0;
		staticVars['total_months'] = 0;
		staticVars['total_value'] = 0;
		staticVars['compensation_total'] = 0;
		staticVars['pension_total'] = 0;
		staticVars['doneWaiting'] = false;
		if (startDate < pension_data[0][0]) {
			staticVars['months_waited'] += getMonthsDiff(startDate, pension_data[0][0]);
			return new Date(pension_data[0][0]);
		}
		else
			return new Date(startDate);
	},

	pensionTableCalcPeriodRow: function (periodStart, periodEnd, staticVars, isEligibleToSeparationShowing) {
		var num_months = 0;
		var periodMinWage = this.getPeriodMinWage(periodStart);
		var periodPensionPercentage = this.getPeriodPensionPercentage(periodStart);
		var periodCompensationPercentage = this.getPeriodCompensationPercentage(periodStart);
		var periodPensionTotal = 0;
		var periodCompensationTotal = 0;
		var periodTotal = 0;
		var period = getMonthsDiff(periodStart, periodEnd);

		//waiting for pension
		i = 0;
		while (period > 0) {
			var partial = 1;
			if (period < 1) {
				partial = period;
			}
			staticVars['months_waited'] += partial;
			//has the worker waited enough time to get pension?
			var pastWaiting = staticVars['months_waited'] - this.getPensionWaiting(addMonth(periodStart, i));
			if (!staticVars['doneWaiting'] && pastWaiting > 0) {
				staticVars['doneWaiting'] = true;
				if (pastWaiting < 1)
					partial = pastWaiting;
			}

			if (staticVars['doneWaiting']) {
				num_months += partial; staticVars['total_months'] += partial;

			}

			period--;
		}
		num_months = parseFloat(num_months.toFixed(1));
		//calculate the period totals using the number of months that count
		periodPensionTotal += this.getPeriodPensionTotal(periodStart, num_months);
		periodCompensationTotal += this.getPeriodCompensationTotal(periodStart, num_months);

		//to include the compensation in the total?
		if (this.isEligibleToSeperation && (!isEligibleToSeparationShowing))
			periodTotal += periodPensionTotal;
		else
			periodTotal += periodPensionTotal + periodCompensationTotal;
		staticVars['total_value'] += periodTotal;
		staticVars['pension_total'] += periodPensionTotal;
		staticVars['compensation_total'] += periodCompensationTotal;

		//period string
		var periodString = dateToString(periodStart, 1) + " - " + dateToString(periodEnd, 1);

		//whether we show X% or X%+X%:
		var periodPensionPercentageString = sprintf("%.2f%%", periodPensionPercentage * 100);
		var periodCompensationPercentageString = sprintf("%.2f%%", periodCompensationPercentage * 100);
		var periodPercentageString = (this.isEligibleToSeperation && (!isEligibleToSeparationShowing)) ? periodPensionPercentageString : periodPensionPercentageString + "+" + periodCompensationPercentageString;

		//different columns depending on sep:
		if (this.isEligibleToSeperation && (!isEligibleToSeparationShowing)) {
			return {
				period_string: periodString,
				num_months: num_months,
				month_wage: this.getMonthWage(periodStart),
				period_percentage_string: periodPercentageString,
				period_pension_total: periodPensionTotal,
				//period_compensation_total: periodCompensationTotal,
				period_total: periodTotal
			};
		}
		else {
			return {
				period_string: periodString,
				num_months: num_months,
				month_wage: this.getMonthWage(periodStart),
				period_percentage_string: periodPercentageString,
				period_pension_total: periodPensionTotal,
				period_compensation_total: periodCompensationTotal,
				period_total: periodTotal
			};
		}
	},

	getPensionTable: function (isEligibleToSeparationShowing) {
		var This = this;
		var result = emulateTime(this.startWorkDate, this.endWorkDate,
			this.pensionTableInitRunningDate,
			function (dateA, dateB) { return !This.isPensionSame(dateA, dateB) },
			function (periodStart, periodEnd, staticVars) { return This.pensionTableCalcPeriodRow(periodStart, periodEnd, staticVars, isEligibleToSeparationShowing) },
			function (runningDate) { return addDay(runningDate, 1); }
		);
		var rows = result[0];
		var staticVars = result[1];
		var bottom_lines = this.getPensionBottomLine(staticVars['total_value'], isEligibleToSeparationShowing);
		return {
			'total_value': staticVars['total_value'],
			'pension_total': staticVars['pension_total'],
			'compensation_total': staticVars['compensation_total'],
			'rows': rows,
			'bottom_lines': bottom_lines
		};
	},

	getPensionWaiting: function (date) {
		//Lookup how much time a worker must wait for pension
		i = 0;
		var pension_waiting = pension_waiting_data[0][1];
		while (i < pension_waiting_data.length && date >= pension_waiting_data[i][0]) {
			pension_waiting = pension_waiting_data[i][1];
			i++;
		}
		return pension_waiting;
	},

	getHishtalmutTable: function () {
		var This = this;
		var result = emulateTime(this.startWorkDate, this.endWorkDate,
			function (startDate, staticVars) { return This.hishtalmutTableInitRunningDate(startDate, staticVars); },
			function (dateA, dateB) { return !This.isWageSame(dateA, dateB); },
			function (periodStart, periodEnd, staticVars) { return This.hishtalmutTableCalcPeriodRow(periodStart, periodEnd, staticVars); },
			function (runningDate) { return addDay(runningDate, 1); }
		);
		var rows = result[0];
		var staticVars = result[1];
		var bottom_lines = this.getTotalLine(staticVars['total']);
		return [staticVars['total'], rows, bottom_lines];
	},

	hishtalmutTableCalcPeriodRow: function (periodStart, periodEnd, staticVars) {
		var periodHishtalmutTotal = 0;
		var hishtalmutPercentage = HISHTALMUT_PERCENTAGE;
		var hishtalmutPeriod = getMonthsDiff(periodStart, periodEnd);
		periodHishtalmutTotal += this.getMonthWage(periodStart) * hishtalmutPercentage * hishtalmutPeriod;
		var periodString = dateToString(periodStart, 1) + " - " + dateToString(periodEnd, 1);
		var hishtalmutPercentageString = sprintf("%.2f%%", hishtalmutPercentage * 100);
		staticVars['total'] += periodHishtalmutTotal;
		return [periodString, hishtalmutPeriod, this.getMonthWage(periodStart), hishtalmutPercentageString, periodHishtalmutTotal];
	},

	hishtalmutTableInitRunningDate: function (startDate, staticVars) {
		staticVars['total'] = 0;
		if (this.getHishtalmutEligibleDay() == null)
			return null;
		else
			return new Date(Math.max(startDate, this.getHishtalmutEligibleDay()));
	},

	getPensionBottomLine: function (total_value, isEligibleToSeparationShowing) {
		return [sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], total_value)];
	},

	getTotalLine: function (total_value) {
		return [sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], total_value)];
	},

	getRecuperationTable: function () {
		var rows = [];
		var recuperationValues = [];

		var partial = this.getPartTimeFraction();//part time consideration

		var recuperation_total = 0;//running total
		var recuperation_total_without_oldness = 0;

		//calculate and ignore oldness and calculate what will be shown
		var running_date = new Date(this.startWorkDate);
		while (running_date <= this.endWorkDate) {
			var irecuperation_value = 0;
			var partial = getMonthsDiff(running_date, this.endWorkDate);
			partial = Math.min(partial, 1);
			var idays = partial * this.getRecuperationDays(running_date) / 12.0;
			if (this.isEligibleToRecuperation(running_date)) {
				irecuperation_value = idays * this.getRecuperationValue(running_date);
			}
			else
				idays = 0;
			recuperation_total_without_oldness += irecuperation_value;
			if ((this.endWorkDate - running_date) / TIME_IN_MONTH < 2 * 12)//oldness calc: include last two years
			{
				recuperation_total += irecuperation_value;
			}
			recuperationValues.push([idays, irecuperation_value]);

			//increment date by a month
			running_date.setMonth(running_date.getMonth() + 1);
		}
		for (i = 0; i < recuperationValues.length / 12; i++) {
			var yearsDaysTotal = 0;
			var yearsRecuperationTotal = 0;
			var running_date = addMonth(new Date(this.startWorkDate), 12 * i);
			for (j = i * 12; j < (i + 1) * 12 && j < this.dateDiff[0] * 12 + this.dateDiff[1] && j < recuperationValues.length; j++) {
				yearsDaysTotal += recuperationValues[j][0];
				yearsRecuperationTotal += recuperationValues[j][1];
			}
			rows[i] = [i + 1, this.getRecuperationDays(running_date, true), yearsDaysTotal, yearsRecuperationTotal];

		}
		return [this.getRecuperationValue(this.endWorkDate), recuperation_total, recuperation_total_without_oldness, rows];
	},

	getVacationTable: function () {
		var rows = [];
		var vacationDayList = [];
		var potentialDayList = [];

		var vacation_days = 0;//running total
		var vacation_days_without_oldness = 0;

		var running_date = new Date(this.startWorkDate);
		var vacationDayValue = this.getVacationDayValue(this.endWorkDate);
		//loop on all of the time of work
		while (running_date <= this.endWorkDate) {
			//is this a partial month?
			var partial = (this.endWorkDate - running_date) / TIME_IN_MONTH;
			partial = partial > 1 ? partial = 1 : partial;
			var vac_days_t = this.getVacationDays(running_date);
			var days = partial * vac_days_t / 12.0;
			vacationDayList.push([days]);
			//increment date by a month
			running_date.setMonth(running_date.getMonth() + 1);
		}
		running_date = new Date(this.startWorkDate);
		while (running_date <= addMonth(this.endWorkDate, 12)) {
			//is this a partial month?
			var days = partial * this.getVacationDays(running_date) / 12.0;
			potentialDayList.push([days]);
			//increment date by a month
			running_date.setMonth(running_date.getMonth() + 1);
		}
		//sum up each year's months
		for (i = 0; i < vacationDayList.length / 12; i++) {
			var yearsDaysTotal = 0;
			var yearsDaysPotentialTotal = 0;
			var running_date = addMonth(new Date(this.startWorkDate), 12 * i);
			for (j = i * 12; j < (i + 1) * 12 && j < this.dateDiff[0] * 12 + this.dateDiff[1] && j < vacationDayList.length; j++) {
				yearsDaysTotal += vacationDayList[j][0];
				if (j + 36 >= vacationDayList.length)
					vacation_days += vacationDayList[j][0];
			}
			for (j = i * 12; j < (i + 1) * 12; j++) {
				yearsDaysPotentialTotal += potentialDayList[j][0];
			}
			var r_yearsDaysTotal = roundVacationDays(yearsDaysTotal);
			var r_yearsDaysPotentialTotal = roundVacationDays(yearsDaysPotentialTotal);
			var r_yearsVacationTotal = r_yearsDaysTotal * vacationDayValue;
			vacation_days_without_oldness += r_yearsDaysTotal;
			//removed the fourth column due to Zehavit's request. She may change her mind
			//rows[i] = [i + 1, r_yearsDaysPotentialTotal, r_yearsDaysTotal, r_yearsVacationTotal];
			rows[i] = [i + 1, r_yearsDaysTotal, r_yearsVacationTotal];
		}
		vacation_days = roundVacationDays(vacation_days);
		return [vacation_days * vacationDayValue, vacation_days_without_oldness * vacationDayValue, rows];
	},

	isEligibleToRecuperation: function (date) {
		var yearAfterStart = new Date(this.startWorkDate);
		yearAfterStart = addMonth(yearAfterStart, 12);
		yearAfterStart.setDate(yearAfterStart.getDate() - 1);
		return this.endWorkDate >= yearAfterStart;
	},

	getPeriodPensionTotal: function (date, months) {
		return months * this.getMonthWage(date) * this.getPeriodPensionPercentage(date);
	},

	getPeriodCompensationTotal: function (date, months) {
		return months * this.getMonthWage(date) * this.getPeriodCompensationPercentage(date);
	},

	getPeriodMinWage: function (date) {
		var periodPensionData = getPensionData(date);
		return periodPensionData[PENSION_MIN];
	},

	getPeriodPensionPercentage: function (date) {
		var periodPensionData = getPensionData(date);
		return periodPensionData[PENSION_G];
	},

	getPeriodCompensationPercentage: function (date) {
		var periodPensionData = getPensionData(date);
		return periodPensionData[PENSION_P];
	},

	getMonthWage: function (date) {
		return getMinMonthWage(date);
	},

	getMinMonthWage: function (date) {
		return getPensionData(date)[PENSION_MIN];
	},

	getVacationDayValue: function (date) {
		//Calculate the value of a vacation day based minimum wage on the pension data of the end of work date
		month_value = this.getMonthWage(date);
		return month_value / this.getNumWorkDaysInMonth();
	},

	getPartTimeFraction: function () {
		//abstract
		return 1;
	},

	getRecuperationDays: function (date, ignorePartial) {
		var year = getYearsDiff(this.startWorkDate, addDay(date, 1));
		var partial = this.getPartTimeFraction();
		if (ignorePartial)
			partial = 1;

		return partial * getItem(recuperation_days, year);
	},

	getRecuperationValue: function (date) {
		return latest_recuperation_value;
	},

	getVacationDays: function (date) {
		var workedSoFar = getDateDiff(this.startWorkDate, date);
		var workLeft = getDateDiff(date, this.endWorkDate);
		var partial = this.getPartTimeFraction()
		if (this.daysPerWeek != 6)
			return partial * lookupVacationDays(date, 5, workedSoFar, workLeft);
		else
			return partial * lookupVacationDays(date, 6, workedSoFar, workLeft);
	},

	getNumWorkDaysInMonth: function () {
		if (this.daysPerWeek == 6)
			return SIX_WORK_DAYS_IN_MONTH;
		else if (this.daysPerWeek == 5)
			return FIVE_WORK_DAYS_IN_MONTH
	},

	getNumDaysEarlyNotice: function () {
		numDays = 0;
		if (this.dateDiff[0] < 1 && this.dateDiff[1] < 6)
			numDays = this.dateDiff[1];
		else if (this.dateDiff[0] == 0)
			numDays = 2.5 * (this.dateDiff[1] - 6) + 6;
		else {
			return -2;
		}
		return numDays;
	},

	getDayWage: function (date) {
		var month_value = this.getMonthWage(date);

		if (this.daysPerWeek == 6)
			return month_value / SIX_WORK_DAYS_IN_MONTH;
		else
			return month_value / FIVE_WORK_DAYS_IN_MONTH;
	},

	isPensionSame: function (dateA, dateB) {
		isSame = this.getPeriodPensionPercentage(dateA) == this.getPeriodPensionPercentage(dateB);
		isSame = isSame && (this.getPeriodCompensationPercentage(dateA) == this.getPeriodCompensationPercentage(dateB));
		return isSame && this.isWageSame(dateA, dateB);
	},

	isWageSame: function (dateA, dateB) {
		//check wage diff
		return this.getMonthWage(dateA) == this.getMonthWage(dateB);
	},

	getHolidayValue: function (date) {
		//the value of a 25 hour day at 150%
		return holiday_ratio * (this.getVacationDayValue(date) + this.getMonthWage(date) / HOURS_IＮ_MONTH);
	},

	getHishtalmutEligibleDay: function () { return null },
}

function HourlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, dailyWage, daysPerWeek, hoursPerWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation);
	this.daysPerWeek = daysPerWeek ? 1 * daysPerWeek : 0;
	this.hoursPerWeek = hoursPerWeek ? 1 * hoursPerWeek : 0;
	if (this.hoursPerWeek == 0)
		alert(STR.alert_no_hours_in_week[LANG]);
	this.dailyWage = dailyWage ? 1 * dailyWage : 0;
}

HourlyWorker.prototype = {

	getPartTimeFraction: function () {
		hours = this.hoursPerWeek;
		hours = hours > HOURS_IN_WEEK ? HOURS_IN_WEEK : hours;
		return hours / HOURS_IN_WEEK;
	},

	getVacationDays: function (date) {
		var workedSoFar = getDateDiff(this.startWorkDate, date);
		var workLeft = getDateDiff(date, this.endWorkDate)
		if (this.daysPerWeek > 1) {
			return lookupVacationDays(date, this.daysPerWeek, workedSoFar, workLeft);
		}
		else if (this.daysPerWeek > 0) {
			return this.daysPerWeek * lookupVacationDays(date, 1, workedSoFar, workLeft);
		}
		else
			return 0;
	},

	getNumWorkDaysInMonth: function () {
		//hourly workers estimate the work days in a week based on the weeks in a month
		return this.daysPerWeek * WEEKS_IN_MONTH;
	},

	getNumDaysEarlyNotice: function () {
		numDays = 0;
		if (this.dateDiff[0] < 1)
			numDays = this.dateDiff[1];
		else if (this.dateDiff[0] < 2)
			numDays = 14 + this.dateDiff[1] / 2;
		else if (this.dateDiff[0] < 3)
			numDays = 21 + this.dateDiff[1] / 2;
		else {
			return -2;
		}
		return numDays;
	},

	getMonthWage: function (date) {
		var minMonthValue = this.getMinMonthWage(date);
		var num_hours_in_day = this.hoursPerWeek / this.daysPerWeek;
		var hour_value = this.dailyWage / num_hours_in_day;
		var min_hour_value = minMonthValue / WEEKS_IN_MONTH / HOURS_IN_WEEK;
		if (isUndefined(this.dailyWage) || hour_value < min_hour_value)
			return min_hour_value * this.hoursPerWeek * WEEKS_IN_MONTH;
		return this.dailyWage * num_days_in_week * WEEKS_IN_MONTH;
	},

	getDayWage: function (date) {
		var month_value = this.getMonthWage(date);
		return month_value / this.daysPerWeek / WEEKS_IN_MONTH;
	},
}

extend(Worker, HourlyWorker);

function MonthlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage, workPercentage, isFiveDayWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation);
	this.monthlyWage = isUndefined(monthlyWage) ? 0 : monthlyWage;
	this.workPercentage = isUndefined(workPercentage) ? 100 : workPercentage;
	this.daysPerWeek = isFiveDayWeek ? 5 : 6;
}

MonthlyWorker.prototype = {
	getPartTimeFraction: function () {
		return this.workPercentage / 100;
	},
	getMonthWage: function (date) {
		//the objects monthly wage variable is the user input, not the actual wage
		var monthWage = this.monthlyWage
		var minMonthValue = this.getMinMonthWage(date);
		minMonthValue = minMonthValue * (this.workPercentage / 100);
		if (minMonthValue > monthWage) {
			monthWage = minMonthValue;
		}
		return monthWage;
	},
	getVacationDays: function (date) {
		var workedSoFar = getDateDiff(this.startWorkDate, date);
		var workLeft = getDateDiff(date, this.endWorkDate);
		if (this.daysPerWeek != 6)
			return lookupVacationDays(date, 5, workedSoFar, workLeft);
		else
			return lookupVacationDays(date, 6, workedSoFar, workLeft);
	},
}

extend(Worker, MonthlyWorker);

function AgriculturalWorker(startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage, allowance) {
	MonthlyWorker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage);
	this.daysPerWeek = 6;
	this.allowance = allowance;
}

AgriculturalWorker.prototype = {
	getPensionWaiting: function (date) {
		return 0;
	},

	getRecuperationDays: function (date, ignorePartial) {
		var partial = this.getPartTimeFraction();
		var year = getYearsDiff(this.startWorkDate, date);
		if (ignorePartial)
			partial = 1;
		return partial * getItem(recuperation_days_agr, year);
	},

	getVacationDays: function (date) {
		var year = getYearsDiff(this.startWorkDate, date);
		return getItem(agr_vacations, year);
	},

	getMonthWage: function (date) {
		//first get the input wage by using 0 as minimum wage
		var minMonthValue = MonthlyWorker.prototype.getMonthWage.call(this, date);
		//agr addition to min wage
		minMonthValue += getItem(agr_min_wage_bonus, getYearNum(this.startWorkDate, date));
		var inputMonthWage = this.monthlyWage;
		var monthWage = Math.max(inputMonthWage, minMonthValue);
		//add pocket money
		monthWage += this.allowance * WEEKS_IN_MONTH;
		return monthWage;
	},

	getHolidayValue: function (date) {
		return agr_holiday_ratio * this.getVacationDayValue(date);
	},
}
extend(MonthlyWorker, AgriculturalWorker);

//סיעוד
function Caretaker(startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage, allowance) {
	MonthlyWorker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage);
	this.allowance = allowance;
	this.daysPerWeek = 6;
}

Caretaker.prototype = {
	getMonthWage: function (date) {
		//first get the input wage by using 0 as minimum wage
		var monthWage = this.monthlyWage;
		var min_monthWage = MonthlyWorker.prototype.getMonthWage.call(this, date);

		//add pocket money
		monthWage += this.allowance * WEEKS_IN_MONTH;
		monthWage = Math.max(monthWage, min_monthWage);
		return monthWage;
	},
}
extend(MonthlyWorker, Caretaker);

//עובדי נקיון
function CleaningWorker(startWorkDate, endWorkDate, isEligibleToSeperation, workPercentage, hourlyWage, cleaningType, transportationCosts, overtime125, overtime150, isFiveDayWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, false);
	this.workPercentage = 1 * workPercentage;
	this.hourlyWage = 1 * hourlyWage;
	this.cleaningType = cleaningType;
	this.transportationCosts = 1 * transportationCosts;
	this.overtime125 = 1 * overtime125;
	this.overtime150 = 1 * overtime150;
	this.daysPerWeek = isFiveDayWeek ? 5 : 6;
}

C_PRIVATE 　= "1";
C_PUBLIC 　= "2";
C_HOTEL 　= "3";
CleaningWorker.prototype = {

	getPensionWaiting: function (date) {
		if (date < this.getExpansionDate())
			return Worker.prototype.getPensionWaiting.call(this, date);
		else
			return 0;
	},

	getCompensation: function () {
		//from normal wage
		var compen = this.getMonthWage(this.endWorkDate) * (this.dateDiff[0] + this.dateDiff[1] / 12);
		//add overtime
		compen += this.getOvertimePensionData()[1];
		return compen;
	},

	getPartTimeFraction: function () {
		return this.workPercentage / 100.0;
	},

	getMonthWage: function (date) {
		return this.getHourWage(date) * HOURS_IＮ_MONTH * this.getPartTimeFraction();
	},

	getHourWage: function (date) {
		var minMonthValue = this.getMinMonthWage(date);
		var min_hour_value = minMonthValue / HOURS_IＮ_MONTH;
		var hour_value = (min_hour_value > this.hourlyWage) ? min_hour_value : this.hourlyWage;
		//in case it is NaN for some odd reason
		if (hour_value > 0 && hour_value < 0)
			hour_value = min_hour_value;
		//if expansion date in passed
		if (date >= this.getExpansionDate()) {
			//hourly bonus
			var yearNum = getMonthsDiff(this.startWorkDate, date) / 12.0;
			if (yearNum >= 6) {
				hour_value += SIX_YEAR_VETERAN_BONUS;
			}
			else if (yearNum >= 2) {
				hour_value += TWO_YEAR_VETERAN_BONUS;
			}
		}
		return hour_value;
	},

	getNumWorkDaysInMonth: function () {
		return Worker.prototype.getNumWorkDaysInMonth.call(this) * this.getPartTimeFraction();
	},

	getExpansionDate: function () {
		return getExpansionDate(this.cleaningType);
	},

	getRecuperationValue: function (date) {
		if (date >= this.getExpansionDate())
			return CLEANING_RECUPERATION_VALUE;
		else
			return Worker.prototype.getRecuperationValue.call(this, date);
	},

	getMinMonthWage: function (date) {
		var minMonthValue = Worker.prototype.getMinMonthWage.call(this, date);
		if (date >= this.getExpansionDate()) {
			minMonthValue = Math.max(minMonthValue, C_TEMP_MIN_WAGE);
		}
		return minMonthValue;
	},

	getHishtalmutEligibleDay: function () { return HISHTALMUT_START },

	getPeriodPensionPercentage: function (date) {
		if (date < this.getExpansionDate())
			return Worker.prototype.getPeriodPensionPercentage.call(this, date);
		else
			return getItemByDate(pension_data_cleaner, date)[1];
	},

	getPeriodCompensationPercentage: function (date) {
		if (date < this.getExpansionDate())
			return Worker.prototype.getPeriodCompensationPercentage.call(this, date);
		else
			return getItemByDate(pension_data_cleaner, date)[2];
	},

	getPensionBottomLine: function (total_value, isEligibleToSeparationShowing) {
		var bottom_lines = [];
		var overtimeData = this.getOvertimePensionData();
		var overtimeTotal;
		//if(this.isEligibleToSeperation && (!isEligibleToSeparationShowing))
		if (this.isEligibleToSeperation) {
			overtimeTotal = overtimeData[0];
			bottom_lines.push(sprintf("<b>%s (%.2f%%): %.2f</b><br/>",
				STR.overtime_pension[LANG], this.getOvertimePensionPercentages()[0] * 100, overtimeTotal));
		}
		else {
			overtimeTotal = overtimeData[0] + overtimeData[1];
			bottom_lines.push(sprintf("<b>%s (%.2f%%+%.2f%%): %.2f</b><br/>",
				STR.overtime_pension[LANG], this.getOvertimePensionPercentages()[0] * 100,
				this.getOvertimePensionPercentages()[1] * 100, overtimeTotal));
		}
		var transportationCostsTotal = this.getTransportationCostsPension();
		total_value += overtimeTotal;
		total_value += transportationCostsTotal;
		bottom_lines.push(sprintf("<b>%s: %.2f</b><br/>", STR.transportationCosts_pension[LANG], transportationCostsTotal));

		bottom_lines.push(sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], total_value));
		return bottom_lines;
	},

	getOvertimePensionData: function () {
		var value = this.overtime125 * this.getHourWage() * 1.25 + this.overtime150 * this.getHourWage() * 1.5;
		return [value * this.getOvertimePensionPercentages()[0],
		value * this.getOvertimePensionPercentages()[1]];
	},

	getOvertimePensionPercentages: function () {
		var overtimePensionPercentage;
		var overtimeCompensationPercentage;
		if (this.endWorkDate < pension_data_cleaner_overtime[1][0]) {
			overtimePensionPercentage = pension_data_cleaner_overtime[1][1];
			overtimeCompensationPercentage = pension_data_cleaner_overtime[1][2];
		}
		else {
			overtimePensionPercentage = pension_data_cleaner_overtime[0][1];
			overtimeCompensationPercentage = pension_data_cleaner_overtime[0][2];
		}
		return [overtimePensionPercentage, overtimeCompensationPercentage]
	},

	getTransportationCostsPension: function () {
		return this.transportationCosts * pension_data_cleaner_transportation_costs;
	},

	getRecuperationDays: function (date, ignorePartial) {
		if (date >= this.getExpansionDate()) {
			var year = getYearsDiff(this.startWorkDate, date);
			var partial = this.getPartTimeFraction();
			if (ignorePartial)
				partial = 1;

			return partial * getItem(recuperation_days_cleaner, year);
		}
		else
			return Worker.prototype.getRecuperationDays.call(this, date, ignorePartial);
	},

	isEligibleToRecuperation: function (date) {
		if (date >= this.getExpansionDate())
			return true;
		return Worker.prototype.isEligibleToRecuperation.call(this, date);
	},
}
extend(Worker, CleaningWorker);

function getExpansionDate(cleaningType) {
	switch (cleaningType) {
		case C_PRIVATE:
			return new Date("3-1-2014 00:00:00");
		case C_PUBLIC　:
			return new Date("11-1-2013 00:00:00");
		case C_HOTEL　:
			return new Date("7-1-2014 00:00:00");
	}
}