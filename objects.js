function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  // for a polyfill
  // Also, do a recursive merge of two prototypes, so we don't overwrite 
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);
  for (var key in origProto)  {
     sub.prototype[key] = origProto[key];
  }
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
  // In ECMAScript5+ (all modern browsers), you can make the constructor property
  // non-enumerable if you define it like this instead
  Object.defineProperty(sub.prototype, 'constructor', { 
    enumerable: false, 
    value: sub 
  });
}

function Worker(startWorkDate, endWorkDate, isEligibleToSeperation) {
	this.startWorkDate = startWorkDate;
	this.endWorkDate = endWorkDate;
	this.isEligibleToSeperation = isEligibleToSeperation;
  this.daysPerWeek = DEFAULT_WORK_WEEK;
  this.dateDiff = getDateDiff(startWorkDate, endWorkDate);
}

Worker.prototype = {
	getMonthWage: function (minMonthValue, yearNum) {
		return minMonthValue;
	},

  getNumWorkDaysInMonth: function () {
    //abstract
    return 0;
  },

  getVacationDayValue : function (yearNum){
    //Calculate the value of a vacation day based minimum wage on the pension data of the end of work date
    minMonthValue = pension_data[getPensionDataIndex(this.endWorkDate)][1];
    month_value = this.getMonthWage(minMonthValue, yearNum);
    return month_value / this.getNumWorkDaysInMonth();
  },

  isSeparationEligible: function() {
    //simple enough
    return isEligibleToSeperation;
  },

  getPartTimeFraction: function() {
    //abstract
    return 1;
  },

  getRecuperationDays: function(year, ignorePartial) {
    var partial = this.getPartTimeFraction();
    if(ignorePartial)
      partial = 1;

    if(year-1 < recuperation_days.length)
      return partial*recuperation_days[year-1];
    else
      return partial*recuperation_days[recuperation_days.length-1];
  },

  getRecuperationValue: function(date){
  return latest_recuperation_value;
  },

  getVacationDays: function (year, months) { 
    year = year - 1;
    fiveDayWeekVacation = getItem(five_day_week_vacations, year);
    sixDayWeekVacation = getItem(six_day_week_vacations, year);

    if(this.daysPerWeek != 6)
      vacation_days = fiveDayWeekVacation*months/12;
    else
      vacation_days = sixDayWeekVacation*months/12;
    
    return this.roundVacationDays(vacation_days);
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

  getMonthWage: function (minMonthValue, yearNum) {
    //abstract
  },

  getDayWage: function (minMonthValue, yearNum) {
    var month_value = getMonthWage (minMonthValue, yearNum);

    if(daysPerWeek == 6)
      return month_value / SIX_WORK_DAYS_IN_MONTH;
    else
      return month_value / FIVE_WORK_DAYS_IN_MONTH;
  },

  isPensionSame: function (indexA, indexB, yearNum, periodMinWage) {
    //whether the pension in the index is the same considering the wage and the percentage
    var minWageA = pension_data[indexA][1];
    var minWageB = pension_data[indexB][1];
    var monthWage = this.getMonthWage(periodMinWage, yearNum)
    var isEarningMinWage = monthWage <= minWageB*this.getPartTimeFraction();
    var startIndex = isEarningMinWage ? 1 : 2;
    for(var i=startIndex;i<pension_data[indexA].length;i++)
      if(pension_data[indexA][i]!=pension_data[indexB][i])
        return false;
    return true;
  },

  getHolidayValue: function (yearNum) {
    return holiday_ratio * this.getVacationDayValue(yearNum);
  },
}

function HourlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, dailyWage, daysPerWeek, hoursPerWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation);
	this.daysPerWeek = daysPerWeek ? daysPerWeek : 0;
	this.hoursPerWeek = hoursPerWeek ? hoursPerWeek : 0;
	this.dailyWage = dailyWage ? dailyWage : 0;
}

HourlyWorker.prototype = {

  getPartTimeFraction: function() {
    hours = hoursPerWeek;
    hours = hours > HOURS_IN_WEEK ? HOURS_IN_WEEK : hours;
    if(!hours)
      alert(STR.alert_no_hours_in_week[LANG]);
    return hours / HOURS_IN_WEEK;
  },

  getVacationDays: function(year, months){
    year = year - 1;
    fiveDayWeekVacation = getItem(five_day_week_vacations, year);
    sixDayWeekVacation = getItem(six_day_week_vacations, year);

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

  getMonthWage: function (minMonthValue, yearNum) {
    var num_hours_in_day = hoursPerWeek / hoursPerWeek;
    var hour_value = dailyWage / num_hours_in_day;
    var min_hour_value = minMonthValue / WEEKS_IN_MONTH / HOURS_IN_WEEK;
    if(isUndefined(dailyWage) || hour_value<min_hour_value)
      return min_hour_value * hoursPerWeek * WEEKS_IN_MONTH;
    return dailyWage * num_days_in_week * WEEKS_IN_MONTH;
  },

  getDayWage: function (minMonthValue, yearNum) {
    var month_value = getMonthWage (minMonthValue, yearNum);
    return month_value / daysPerWeek / WEEKS_IN_MONTH;
  },
}

extend(Worker, HourlyWorker);

function MonthlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage, workPercentage, daysPerWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation);
	this.monthlyWage = isUndefined(monthlyWage) ? 0 : monthlyWage;
  this.workPercentage = isUndefined(workPercentage) ? 100 : workPercentage;
  this.daysPerWeek = daysPerWeek ? daysPerWeek : DEFAULT_WORK_WEEK;
}

MonthlyWorker.prototype = {
  getPartTimeFraction: function() {
    return workPercentage/100;
  },
  getMonthWage: function (minMonthValue, yearNum) {
    //the objects monthly wage variable is the user input, not the actual wage
    var monthWage = this.monthlyWage
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

  getMonthWage: function (minMonthValue, yearNum) {
    //the agr addition to min wage
    minMonthValue += getItem(agr_min_wage_bonus, yearNum);
    var monthWage = MonthlyWorker.prototype.getMonthWage.call(this, minMonthValue, yearNum);

    //add pocket money
    monthWage += this.allowance * WEEKS_IN_MONTH;

    return monthWage;
  },

  getHolidayValue: function (yearNum) {
    return agr_holiday_ratio * this.getVacationDayValue(yearNum);
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
  getMonthWage: function (minMonthValue, yearNum) {
      var monthWage = MonthlyWorker.prototype.getMonthWage.call(this, minMonthValue, yearNum);

      //add pocket money
      monthWage += this.allowance * WEEKS_IN_MONTH;
      
      return monthWage;
    },
}
extend(MonthlyWorker, Caretaker);

//עובדי נקיון
function CleaningWorker(startWorkDate, endWorkDate, isEligibleToSeperation, daysPerWeek, hoursPerWeek, dailyWage) {
	HourlyWorker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, daysPerWeek, hoursPerWeek, dailyWage);
}

extend(MonthlyWorker, CleaningWorker);