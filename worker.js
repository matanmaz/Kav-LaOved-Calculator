function Worker(startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation) {
	this.startWorkDate = startWorkDate;
	this.endWorkDate = endWorkDate;
	this.isEligibleToSeperation = isEligibleToSeperation;
  this.daysPerWeek = DEFAULT_WORK_WEEK;
  this.dateDiff = getDateDiff(startWorkDate, endWorkDate);
}

Worker.prototype = {
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
    var running_index = 0;

    //handle case that work started before pension_data:
    if(this.startWorkDate < pension_data[running_index][0]){
      months_waited += getMonthsDiff(this.startWorkDate, pension_data[running_index][0]);
      periodStart = new Date(pension_data[running_index][0]);
    }
    else{
      //find the first pension_data by running on running index
      running_index = getPensionDataIndex(this.startWorkDate);
    }

    while(running_index<pension_data.length && pension_data[running_index][0]<this.endWorkDate){
      var num_months = 0;
      var startIndex = running_index;
      var periodMinWage = pension_data[running_index][1];
      var periodPercentage = pension_data[running_index][2];
      var periodTotal = 0;

      //run index up until pension changed, this defines the period/row
      while(pension_data.length > running_index 
        && pension_data[running_index][0] < this.endWorkDate 
        && this.isPensionSame(startIndex,running_index, Math.floor(total_months/12), periodMinWage)){
        running_index++;
      }

      if(pension_data.length == running_index){
        periodEnd = new Date(this.endWorkDate);
        period = getMonthsDiff(periodStart, periodEnd);
        periodEnd.setDate(periodEnd.getDate()-1);
      }
      else if(pension_data[running_index][0] >= this.endWorkDate){
        periodEnd = new Date(this.endWorkDate);
        period = getMonthsDiff(periodStart, periodEnd);
      }
      else
      {
        periodEnd = new Date(pension_data[running_index][0]);
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
          periodTotal += partial * this.getMonthWage(periodMinWage, Math.floor(total_months/12)) * periodPercentage;
        }

        period--;
      }
      (this.isEligibleToSeperation && (!isEligibleToSeparationShowing))? total_value += periodTotal : total_value += periodTotal * 2;
      
      period = dateToString(periodStart,1) + " - " + dateToString(periodEnd,1);
      
      //whether we show X% or X%+X%:
      periodPercentageString = sprintf("%.2f%%", periodPercentage*100)
      periodPercentageString = (this.isEligibleToSeperation && (!isEligibleToSeparationShowing))? periodPercentageString : periodPercentageString + "+" + periodPercentageString
      
      //different columns depending on sep:
      if(this.isEligibleToSeperation && (!isEligibleToSeparationShowing) ){
        rows.push([period, num_months, this.getMonthWage(periodMinWage, Math.floor(total_months/12)), periodPercentageString, periodTotal, periodTotal]);
      }
      else {
        rows.push([period, num_months, this.getMonthWage(periodMinWage, Math.floor(total_months/12)), periodPercentageString, periodTotal, periodTotal, periodTotal*2]);
      }

      periodStart = new Date(periodEnd);
      periodStart.setDate(periodEnd.getDate()+1);
    }
    return [total_value, rows];
  },

  getRecuperationTable: function() {
    var rows = [];

    var partial = this.getPartTimeFraction();//part time consideration

    var recuperation_value = this.getRecuperationValue(this.endWorkDate);//value of each recuperation day
    var recuperation_total = 0;//running total
    var recuperation_total_without_oldness = 0;

    //calculate and ignore oldness and calculate what will be shown
    for(i=1;i<=this.dateDiff[0];i++)
    {
      var days = this.getRecuperationDays(i);
      var irecuperation_value = days * recuperation_value;
      recuperation_total_without_oldness += irecuperation_value;
      rows[i-1]=[i, this.getRecuperationDays(i, true), days, irecuperation_value];
      if(dateDiff[0] - i < 2)//oldness calc: include last two years
      {
        recuperation_total += rows[i-1][3];
      }
    }
    //if worked part of a year this is the remainder
    var remainder = this.getRecuperationDays(i) * dateDiff[1]/12;
    
    if(dateDiff[0]>0 && remainder>0){
      recuperation_total_without_oldness += remainder * recuperation_value;
      rows[i-1] = [i, this.getRecuperationDays(i, true), remainder, remainder * recuperation_value];
      recuperation_total += rows[i-1][3];
    }
    return [recuperation_value, recuperation_total, recuperation_total_without_oldness, rows];
  },

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
    var month_value = this.getMonthWage (minMonthValue, yearNum);

    if(this.daysPerWeek == 6)
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

function HourlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, dailyWage, daysPerWeek, hoursPerWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation);
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
    var num_hours_in_day = this.hoursPerWeek / this.daysPerWeek;
    var hour_value = this.dailyWage / num_hours_in_day;
    var min_hour_value = minMonthValue / WEEKS_IN_MONTH / HOURS_IN_WEEK;
    if(isUndefined(this.dailyWage) || hour_value<min_hour_value)
      return min_hour_value * this.hoursPerWeek * WEEKS_IN_MONTH;
    return this.dailyWage * num_days_in_week * WEEKS_IN_MONTH;
  },

  getDayWage: function (minMonthValue, yearNum) {
    var month_value = getMonthWage (minMonthValue, yearNum);
    return month_value / this.daysPerWeek / WEEKS_IN_MONTH;
  },
}

extend(Worker, HourlyWorker);

function MonthlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, monthlyWage, workPercentage, isFiveDayWeek) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation);
	this.monthlyWage = isUndefined(monthlyWage) ? 0 : monthlyWage;
  this.workPercentage = isUndefined(workPercentage) ? 100 : workPercentage;
  this.daysPerWeek = isFiveDayWeek ? 5 : 6;
}

MonthlyWorker.prototype = {
  getPartTimeFraction: function() {
    return this.workPercentage/100;
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

function AgriculturalWorker(startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, monthlyWage, allowance) {
	MonthlyWorker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, monthlyWage);
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
    //first get the input wage by using 0 as minimum wage
    var monthWage = MonthlyWorker.prototype.getMonthWage.call(this, 0, yearNum);
    //add pocket money
    monthWage += this.allowance * WEEKS_IN_MONTH;
    //agr addition to min wage
    minMonthValue += getItem(agr_min_wage_bonus, yearNum);
    monthWage = MonthlyWorker.prototype.getMonthWage.call(this, minMonthValue, yearNum);
    return monthWage;
  },

  getHolidayValue: function (yearNum) {
    return agr_holiday_ratio * this.getVacationDayValue(yearNum);
  },
}
extend(MonthlyWorker, AgriculturalWorker);

//סיעוד
function Caretaker(startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, monthlyWage, allowance) {
	MonthlyWorker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, monthlyWage);
  this.allowance = allowance;
  this.daysPerWeek = 6;
}

Caretaker.prototype = {
  getMonthWage: function (minMonthValue, yearNum) {
      //first get the input wage by using 0 as minimum wage
    var monthWage = MonthlyWorker.prototype.getMonthWage.call(this, 0, yearNum);
    //add pocket money
    monthWage += this.allowance * WEEKS_IN_MONTH;
    monthWage = MonthlyWorker.prototype.getMonthWage.call(this, minMonthValue, yearNum);
    return monthWage;
    },
}
extend(MonthlyWorker, Caretaker);

//עובדי נקיון
function CleaningWorker(startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, daysPerWeek, hoursPerWeek, dailyWage, cleaningType, overtime125, overtime150) {
	HourlyWorker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation, isEligibleCompensation, daysPerWeek, hoursPerWeek, dailyWage);
  this.cleaningType = cleaningType;
  this.overtime125 = overtime125;
  this.overtime150 = overtime150;
}

extend(HourlyWorker, CleaningWorker);