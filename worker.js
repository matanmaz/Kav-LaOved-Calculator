function Worker(startWorkDate, endWorkDate, isEligibleToSeperation) {
	this.startWorkDate = startWorkDate;
	this.endWorkDate = endWorkDate;
	this.isEligibleToSeperation = isEligibleToSeperation;
  this.daysPerWeek = DEFAULT_WORK_WEEK;
  this.dateDiff = getDateDiff(startWorkDate, endWorkDate);
}

Worker.prototype = {
  getCompensation: function(){
	return this.getMonthWage(this.endWorkDate) * (this.dateDiff[0] + this.dateDiff[1]/12);
  },

  isEligibleEarlyNoticeCompensation: function(){
	return this.isSeparationEligible || this.dateDiff[0]<=0
  },

  isEligibleToSeparationCompensation: function(){
	return this.isEligibleToSeperation && this.dateDiff[0]>=1;
  },

  getPensionTable: function(isEligibleToSeparationShowing) {
	var total_value = 0;//running total

	//start filling the table
	var rows = [];

	//init pension calculation variables
	var total_months = 0;
	var months_waited = 0;
	var doneWaiting = false;
	var periodStart = new Date(this.startWorkDate);
	var periodEnd, period;
	var running_date = new Date(this.startWorkDate);

	//handle case that work started before pension_data:
	if(this.startWorkDate < pension_data[0][0]){
	  months_waited += getMonthsDiff(this.startWorkDate, pension_data[0][0]);
	  periodStart = new Date(pension_data[0][0]);
	}

	while(running_date<this.endWorkDate){
	  var num_months = 0;

	  var periodMinWage = this.getPeriodMinWage(periodStart);
	  var periodPensionPercentage = this.getPeriodPensionPercentage(periodStart);
	  var periodCompensationPercentage = this.getPeriodCompensationPercentage(periodStart);
	  var periodPensionTotal = 0;
	  var periodCompensationTotal = 0;
	  var periodHishtalmutTotal = 0;
	  var periodTotal = 0;
	  var hishtalmutPercentage = HISHTALMUT_PERCENTAGE;

	  //run date up a day at a time (SLOW!!) until pension changed, this defines the period/row
	  while(running_date < this.endWorkDate
		&& this.isPensionSame(periodStart, running_date)){
		running_date.setDate(running_date.getDate()+1);
	  }

	  if(running_date == this.endWorkDate){
		periodEnd = new Date(this.endWorkDate);
		period = getMonthsDiff(periodStart, periodEnd);
		periodEnd.setDate(periodEnd.getDate()-1);
	  }
	  else
	  {
		periodEnd = new Date(running_date);
		periodEnd.setDate(periodEnd.getDate()-1);
		period = getMonthsDiff(periodStart, periodEnd);

	  }

	  i = 0;
	  while(period>0){
		partial = 1;
		if(period<1){
		  partial = period;
		}
		months_waited += partial;
		//has the worker waited enough time to get pension?
		pastWaiting = months_waited - getPensionWaiting(addMonth(periodStart,i));
		if(!doneWaiting && pastWaiting>0) {
		  doneWaiting = true;
		  if(pastWaiting < 1)
			partial = pastWaiting;
		}

		if(doneWaiting){
		  num_months += partial; total_months+= partial;

		}

		period--;
	  }
	  //calculate the period totals using the number of months that count
	  periodPensionTotal += this.getPeriodPensionTotal(periodStart, num_months);
	  periodCompensationTotal += this.getPeriodCompensationTotal(periodStart, num_months);

	  //to include the compensation in the total?
	  if(this.isEligibleToSeperation && (!isEligibleToSeparationShowing))
		periodTotal += periodPensionTotal;
	  else
		periodTotal += periodPensionTotal + periodCompensationTotal;

	  //hishtalmut
	  if(this.hasHishtalmut(periodEnd)){
		running_date = new Date(periodStart);
		while(!this.hasHishtalmut(running_date)){
		  running_date.setDate(running_date.getDate()+1);
		}
		hishtalmutPeriod = getMonthsDiff(running_date, periodEnd);
		periodHishtalmutTotal += this.getMonthWage(periodStart) * hishtalmutPercentage * hishtalmutPeriod;
		periodTotal += periodHishtalmutTotal;
	  }

	  //add to the total of the entire table
	  total_value += periodTotal;

	  //period string
	  period = dateToString(periodStart,1) + " - " + dateToString(periodEnd,1);

	  //whether we show X% or X%+X% or X%+X%+Y%:
	  var hishtalmutPercentageString = sprintf("%.2f%%", hishtalmutPercentage*100);
	  var periodPensionPercentageString = sprintf("%.2f%%", periodPensionPercentage*100);
	  var periodCompensationPercentageString = sprintf("%.2f%%", periodCompensationPercentage*100);
	  var periodPercentageString = (this.isEligibleToSeperation && (!isEligibleToSeparationShowing))? periodPensionPercentageString : periodPensionPercentageString + "+" + periodCompensationPercentageString;
	  periodPercentageString = (this.hasHishtalmut(periodStart))? periodPercentageString + "+" + hishtalmutPercentageString : periodPercentageString;

	  //different columns depending on sep:
	  if(this.isEligibleToSeperation && (!isEligibleToSeparationShowing) ){
		if(this.hasHishtalmut(this.endWorkDate)){
		  rows.push([period, num_months, this.getMonthWage(periodStart), periodPercentageString, periodPensionTotal, periodHishtalmutTotal, periodTotal]);
		}
		else{
		  rows.push([period, num_months, this.getMonthWage(periodStart), periodPercentageString, periodPensionTotal, periodTotal]);
		}
	  }
	  else {
		if(this.hasHishtalmut(this.endWorkDate)){
		  rows.push([period, num_months, this.getMonthWage(periodStart), periodPercentageString, periodPensionTotal, periodPensionTotal, periodHishtalmutTotal, periodTotal]);
		}
		else{
		  rows.push([period, num_months, this.getMonthWage(periodStart), periodPercentageString, periodPensionTotal, periodPensionTotal, periodTotal]);
		}
	  }

	  periodStart = new Date(periodEnd);
	  periodStart.setDate(periodEnd.getDate()+1);
	  running_date = new Date(periodStart);
	}
	var bottom_lines = this.getPensionBottomLine(total_value, isEligibleToSeparationShowing);
	return [total_value, rows, bottom_lines];
  },

  getPensionBottomLine: function(total_value, isEligibleToSeparationShowing) {
	return [sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], total_value)];
  },

  getRecuperationTable: function() {
	var rows = [];
	var recuperationValues = [];

	var partial = this.getPartTimeFraction();//part time consideration

	var recuperation_total = 0;//running total
	var recuperation_total_without_oldness = 0;

	//calculate and ignore oldness and calculate what will be shown
	var running_date = new Date(this.startWorkDate);
	while(running_date <= this.endWorkDate)
	{
	  var days = this.getRecuperationDays(running_date) / 12.0;
	  var irecuperation_value = 0;
	  if(this.isEligibleToRecuperation(running_date))
		 irecuperation_value = days * this.getRecuperationValue(running_date);
	  recuperation_total_without_oldness += irecuperation_value;
	  if((this.endWorkDate-running_date)/TIME_IN_MONTH < 2*12)//oldness calc: include last two years
      {
        recuperation_total += irecuperation_value;
      }
	  recuperationValues.push([days, irecuperation_value]);

	  //increment date by a month
	  running_date.setMonth(running_date.getMonth()+1);
	}
	for(i=0; i<recuperationValues.length/12;i++){
	  var yearsDaysTotal = 0;
	  var yearsRecuperationTotal = 0;
	  var running_date = (new Date(this.startWorkDate)).setYear(this.startWorkDate.getUTCFullYear()+i);
	  for(j=i*12; j<(i+1)*12 && j < this.dateDiff[0]*12 + this.dateDiff[1]; j++){
		yearsDaysTotal += recuperationValues[j][0];
		yearsRecuperationTotal += recuperationValues[j][1];
	  }
	  rows[i]=[i, this.getRecuperationDays(running_date, true), yearsDaysTotal, yearsRecuperationTotal];

	}
	return [this.getRecuperationValue(this.endWorkDate), recuperation_total, recuperation_total_without_oldness, rows];
  },

  getVacationTable: function() {
	  var rows = [];
	  var vacationValues = [];

	  var vacation_total = 0;//running total
	  var vacation_total_without_oldness = 0;

	  var running_date = new Date(this.startWorkDate);
	  //loop on all of the months of work
	  while(running_date <= this.endWorkDate)
	  {
	    //calc if this is a partial month
	    var partial = (this.endWorkDate-running_date)/TIME_IN_MONTH;
	    partial = partial > 1 ? partial = 1 : partial;

		var days = this.getVacationDays(running_date) / 12.0;
		var ivacation_value = partial * days * this.getVacationDayValue(running_date);
		//update totals
		vacation_total_without_oldness += ivacation_value;
		if((this.endWorkDate-running_date)/TIME_IN_MONTH < 3*12) //only include last three years
		{
            vacation_total += ivacation_value;
        }
		vacationValues.push([days, ivacation_value]);
		//increment date by a month
		running_date.setMonth(running_date.getMonth()+1);
	  }
	  //sum up each year's months
	  for(i=0; i<vacationValues.length/12;i++){
        var yearsDaysTotal = 0;
        var yearsVacationTotal = 0;
        var running_date = (new Date(this.startWorkDate)).setYear(this.startWorkDate.getUTCFullYear()+i);
        for(j=i*12; j<(i+1)*12 && j < this.dateDiff[0]*12 + this.dateDiff[1]; j++){
          yearsDaysTotal += vacationValues[j][0];
          yearsVacationTotal += vacationValues[j][1];
        }
        //TODO: may need to deal with rounding
        rows[i]=[i, this.getVacationDays(running_date), yearsDaysTotal, yearsVacationTotal];
	  }
	  return [vacation_total, vacation_total_without_oldness, rows];
	},

  isEligibleToRecuperation: function(date) {
	var yearAfterStart = new Date(this.startWorkDate);
	yearAfterStart.setYear(yearAfterStart.getUTCFullYear()+1);
	yearAfterStart.setDate(yearAfterStart.getDate()-1);
	return this.endWorkDate>=yearAfterStart;
  },

  getPeriodPensionTotal: function(date, months) {
	return months * this.getMonthWage(date) * this.getPeriodPensionPercentage(date);
  },

  getPeriodCompensationTotal: function(date, months) {
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

  getMinMonthWage: function(date) {
	return getPensionData(date)[PENSION_MIN];
  },

  getNumWorkDaysInMonth: function () {
	//abstract
	return 0;
  },

  getVacationDayValue : function (date){
	//Calculate the value of a vacation day based minimum wage on the pension data of the end of work date
	minMonthValue = pension_data[getPensionDataIndex(this.endWorkDate)][1];
	month_value = this.getMonthWage(date);
	return month_value / this.getNumWorkDaysInMonth();
  },

  getPartTimeFraction: function() {
	//abstract
	return 1;
  },

  getRecuperationDays: function(date, ignorePartial) {
	var year = getDateDiff(this.startWorkDate,date)[0];
	var partial = this.getPartTimeFraction();
	if(ignorePartial)
	  partial = 1;

	return partial*getItem(recuperation_days, year);
  },

  getRecuperationValue: function(date){
	return latest_recuperation_value;
  },

  getVacationDays: function (date) {
    var year = getDateDiff(this.startWorkDate,date)[0];
	fiveDayWeekVacation = getItem(five_day_week_vacations, year);
	sixDayWeekVacation = getItem(six_day_week_vacations, year);

	if(this.daysPerWeek != 6)
	  return fiveDayWeekVacation;
	else
	  return sixDayWeekVacation;
  },

  roundVacationDays: function(vacation_days){
	//the lawyers decided that if a worker earned 90% of their day they deserve it
	if(vacation_days - Math.floor(vacation_days) >= 0.9)
	  return Math.floor(vacation_days)+1;
	else
	  return Math.floor(vacation_days);
  },

  getNumWorkDaysInMonth: function(){
	if(this.daysPerWeek==6)
	  return SIX_WORK_DAYS_IN_MONTH;
	else if(this.daysPerWeek==5)
	  return FIVE_WORK_DAYS_IN_MONTH
  },

  getNumDaysEarlyNotice: function(){
	numDays = 0;
	if(this.dateDiff[0]<1 && this.dateDiff[1]<6)
	  numDays = this.dateDiff[1];
	else if(this.dateDiff[0]==0)
	  numDays = 2.5*(this.dateDiff[1]-6)+6;
	else
	{
	  return -2;
	}
	return numDays;
  },

  getDayWage: function (minMonthValue, date) {
	var month_value = this.getMonthWage (date);

	if(this.daysPerWeek == 6)
	  return month_value / SIX_WORK_DAYS_IN_MONTH;
	else
	  return month_value / FIVE_WORK_DAYS_IN_MONTH;
  },

  isPensionSame: function (dateA, dateB) {
	//whether the pension in the index is the same considering the wage and the percentage
	var indexA = getPensionDataIndex(dateA);
	var indexB = getPensionDataIndex(dateB);
	//check wage diff
	var wageA = this.getMonthWage(dateA);
	var wageB = this.getMonthWage(dateB);
	if(wageA != wageB)
	  return false;
	//check pension percentage diff
	for(var i=2;i<pension_data[indexA].length;i++)
	  if(pension_data[indexA][i]!=pension_data[indexB][i])
		return false;
	if(this.hasHishtalmut(dateA)!=this.hasHishtalmut(dateB))
	  return false;
	return true;
  },

  getHolidayValue: function (date) {
	return holiday_ratio * this.getVacationDayValue(date);
  },

  hasHishtalmut: function(date) { return false},



}

function HourlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, dailyWage, daysPerWeek, hoursPerWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation);
	this.daysPerWeek = daysPerWeek ? daysPerWeek : 0;
	this.hoursPerWeek = hoursPerWeek ? hoursPerWeek : 0;
	this.dailyWage = dailyWage ? dailyWage : 0;
}

HourlyWorker.prototype = {

  getPartTimeFraction: function() {
	hours = this.hoursPerWeek;
	hours = hours > HOURS_IN_WEEK ? HOURS_IN_WEEK : hours;
	if(!hours)
	  alert(STR.alert_no_hours_in_week[LANG]);
	return hours / HOURS_IN_WEEK;
  },

  getVacationDays: function(year, months){
	year = year - 1;
	fiveDayWeekVacation = getItem(five_day_week_vacations, year);

	if(this.daysPerWeek>=1)
	{
	  lastYearInTable = x_day_week_vacations[this.daysPerWeek-1].length;
	  xDayWeekVacation = getItem(x_day_week_vacations[this.daysPerWeek-1], year);
	}

	if(this.daysPerWeek>=1)
	  vacation_days = xDayWeekVacation*months/12;
	else if(months==12)
	  vacation_days = fiveDayWeekVacation * this.daysPerWeek * 52 / 200;
	else vacation_days = fiveDayWeekVacation * this.daysPerWeek * months * WEEKS_IN_MONTH / 240;
	return this.roundVacationDays(vacation_days);
  },

  getNumWorkDaysInMonth: function(){
	//hourly workers estimate the work days in a week based on the weeks in a month
	return this.daysPerWeek * WEEKS_IN_MONTH;
  },

  getNumDaysEarlyNotice: function(){
	numDays = 0;
	if(this.dateDiff[0]<1)
	  numDays = this.dateDiff[1];
	else if(this.dateDiff[0]<2)
	  numDays = 14 + this.dateDiff[1]/2;
	else if(this.dateDiff[0]<3)
	  numDays = 21 + this.dateDiff[1]/2;
	else
	{
	  return -2;
	}
	return numDays;
  },

  getMonthWage: function (date) {
	var minMonthValue = this.getMinMonthWage(date);
	var num_hours_in_day = this.hoursPerWeek / this.daysPerWeek;
	var hour_value = this.dailyWage / num_hours_in_day;
	var min_hour_value = minMonthValue / WEEKS_IN_MONTH / HOURS_IN_WEEK;
	if(isUndefined(this.dailyWage) || hour_value<min_hour_value)
	  return min_hour_value * this.hoursPerWeek * WEEKS_IN_MONTH;
	return this.dailyWage * num_days_in_week * WEEKS_IN_MONTH;
  },

  getDayWage: function (date) {
	var month_value = getMonthWage (date);
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
  getPartTimeFraction: function() {
	return this.workPercentage/100;
  },
  getMonthWage: function (date) {
	//the objects monthly wage variable is the user input, not the actual wage
	var monthWage = this.monthlyWage
	var minMonthValue = this.getMinMonthWage(date);
	minMonthValue = minMonthValue*(this.workPercentage/100);
	if(minMonthValue > monthWage){
	  monthWage = minMonthValue;
	}
	return monthWage;
  },

}

extend(Worker, MonthlyWorker);

function AgriculturalWorker(startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage, allowance) {
	MonthlyWorker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage);
  this.daysPerWeek = 6;
  this.allowance = allowance;
}

AgriculturalWorker.prototype = {
  getRecuperationDays: function (year, ignorePartial) {
	var partial = this.getPartTimeFraction();
	if(ignorePartial)
	  partial = 1;
	return partial*recuperation_days_agr;
  },

  getVacationDays: function (year, months) {
	year = year - 1;
	var vacation_days = getItem(agr_vacations, year)*months/12;
	return this.roundVacationDays(vacation_days);
  },

  getMonthWage: function (date) {
	//first get the input wage by using 0 as minimum wage
	var monthWage = this.monthlyWage;
	//add pocket money
	monthWage += this.allowance * WEEKS_IN_MONTH;
	//agr addition to min wage
	minMonthValue += getItem(agr_min_wage_bonus, date);
	monthWage = MonthlyWorker.prototype.getMonthWage.call(this, date);
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
	//add pocket money
	monthWage += this.allowance * WEEKS_IN_MONTH;
	monthWage = MonthlyWorker.prototype.getMonthWage.call(this, date);
	return monthWage;
	},
}
extend(MonthlyWorker, Caretaker);

//עובדי נקיון
function CleaningWorker(startWorkDate, endWorkDate, isEligibleToSeperation, workPercentage, hourlyWage, cleaningType, transportationCosts, overtime125, overtime150) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, false);
  this.workPercentage = workPercentage;
  this.hourlyWage = hourlyWage;
  this.cleaningType = cleaningType;
  this.transportationCosts = transportationCosts;
  this.overtime125 = overtime125;
  this.overtime150 = overtime150;
}

C_PRIVATE　= "1";
C_PUBLIC　= "2";
C_HOTEL　= "3";
CleaningWorker.prototype = {

  getCompensation: function(){
	//from normal wage
	var compen = this.getMonthWage(this.endWorkDate) * (this.dateDiff[0] + this.dateDiff[1]/12);
	//add overtime
	compen += this.getOvertimePensionData()[1];
	return compen;
  },

  getPartTimeFraction : function() {
	return this.workPercentage / 100.0;
  },

  getMonthWage: function (date) {
	 return this.getHourWage(date) * HOURS_IＮ_MONTH * this.getPartTimeFraction();
  },

  getHourWage: function(date) {
	var minMonthValue = this.getMinMonthWage(date);
	var min_hour_value = minMonthValue / HOURS_IＮ_MONTH;
	var hour_value = (min_hour_value > this.hourlyWage) ? min_hour_value : this.hourlyWage;
	//in case it is NaN for some odd reason
	if(hour_value>0 && hour_value<0)
	  hour_value = min_hour_value;
	//if expansion date in passed
	if(date >= this.getExpansionDate()){
	  //hourly bonus
	  var yearNum = getMonthsDiff(this.startWorkDate, date)/12.0;
	  if(yearNum >= 6){
		hour_value += SIX_YEAR_VETERAN_BONUS;
	  }
	  else if(yearNum >= 2)
	  {
		hour_value += TWO_YEAR_VETERAN_BONUS;
	  }
	}
	return hour_value;
  },

  getNumWorkDaysInMonth: function() {
	return FIVE_WORK_DAYS_IN_MONTH * this.getPartTimeFraction();
  },

  getExpansionDate: function() {
  	return getExpansionDate(this.cleaningType);
  },

  getRecuperationValue: function(date){
	if(date >= this.getExpansionDate())
	  return CLEANING_RECUPERATION_VALUE;
	else
	  return Worker.prototype.getRecuperationValue.call(this, date);
  },

  getMinMonthWage: function(date){
	var minMonthValue = Worker.prototype.getMinMonthWage.call(this, date);
	if(date >= this.getExpansionDate()){
	  minMonthValue = Math.max(minMonthValue, C_TEMP_MIN_WAGE);
	}
	return minMonthValue;
  },

  hasHishtalmut: function(date) { return date >= HISHTALMUT_START},

  getPeriodPensionPercentage: function (date) {
	if(date < this.getExpansionDate())
	  return Worker.prototype.getPeriodPensionPercentage.call(this, date);
	else
	  return pension_data_cleaner[0];
  },

  getPeriodCompensationPercentage: function (date) {
	if(date < this.getExpansionDate())
	  return Worker.prototype.getPeriodCompensationPercentage.call(this, date);
	else
	  return pension_data_cleaner[1];
  },

  getPensionBottomLine: function(total_value, isEligibleToSeparationShowing) {
	var bottom_lines = [];
	var overtimeData = this.getOvertimePensionData();
	var overtimeTotal;
	//if(this.isEligibleToSeperation && (!isEligibleToSeparationShowing))
	if(this.isEligibleToSeperation){
	  overtimeTotal = overtimeData[0];
	  bottom_lines.push(sprintf("<b>%s (%.2f%%): %.2f</b><br/>",
		STR.overtime_pension[LANG], this.getOvertimePensionPercentages()[0]*100, overtimeTotal));
	}
	else{
	  overtimeTotal = overtimeData[0] + overtimeData[1];
	  bottom_lines.push(sprintf("<b>%s (%.2f%%+%.2f%%): %.2f</b><br/>",
		STR.overtime_pension[LANG], this.getOvertimePensionPercentages()[0]*100,
		this.getOvertimePensionPercentages()[1]*100, overtimeTotal));
	}
	var transportationCostsTotal = this.getTransportationCostsPension();
	total_value += overtimeTotal;
	total_value += transportationCostsTotal;
	bottom_lines.push(sprintf("<b>%s: %.2f</b><br/>", STR.transportationCosts_pension[LANG], transportationCostsTotal));

	bottom_lines.push(sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], total_value));
	return bottom_lines;
  },

  getOvertimePensionData: function() {
	var value = this.overtime125 * this.getHourWage() * 1.25 + this.overtime150 * this.getHourWage() * 1.5;
	return [value * this.getOvertimePensionPercentages()[0],
	  value * this.getOvertimePensionPercentages()[1]];
  },

  getOvertimePensionPercentages: function() {
	var overtimePensionPercentage;
	var overtimeCompensationPercentage;
	if(this.endWorkDate < pension_data_cleaner_overtime[1][0]){
	  overtimePensionPercentage = pension_data_cleaner_overtime[1][1];
	  overtimeCompensationPercentage  = pension_data_cleaner_overtime[1][2];
	}
	else{
	  overtimePensionPercentage = pension_data_cleaner_overtime[0][1];
	  overtimeCompensationPercentage  = pension_data_cleaner_overtime[0][2];
	}
	return [overtimePensionPercentage, overtimeCompensationPercentage]
  },

  getTransportationCostsPension: function() {
	return this.transportationCosts * pension_data_cleaner_transportation_costs;
  },

  getRecuperationDays: function(date, ignorePartial) {
	if(date >= this.getExpansionDate()){
	  var year = getDateDiff(this.startWorkDate,date)[0];
	  var partial = this.getPartTimeFraction();
	  if(ignorePartial)
		partial = 1;

	  return partial*getItem(recuperation_days_cleaner, year);
	}
	else
	  return Worker.prototype.getRecuperationDays.call(this, date, ignorePartial);
  },

  isEligibleToRecuperation: function(date) {
	if(date >= this.getExpansionDate())
	  return true;
	return Worker.prototype.isEligibleToRecuperation.call(this, date);
  },

  getVacationDays: function (date) {
	if(date >= this.getExpansionDate()){
		var year = getDateDiff(this.startWorkDate,date)[0];
		return getItem(cleaning_vacations_six, year);
	  }
	else
		return Worker.prototype.getVacationDays.call(this, date);
  },
}
extend(Worker, CleaningWorker);

function getExpansionDate(cleaningType) {
  switch(cleaningType){
    case C_PRIVATE:
    return new Date("3-1-2014");
    case C_PUBLIC　:
    return new Date("11-1-2013");
    case C_HOTEL　:
    return new Date("7-1-2014");
  }
}