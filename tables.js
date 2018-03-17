MILI_IN_DAY = 24*3600*1000;
TIME_IN_MONTH = 30*3600*24*1000;
AVERAGE_TIME_IN_MONTH = 30.5*3600*24*1000;
WEEKS_IN_MONTH = 4.3;
SIX_WORK_DAYS_IN_MONTH = 25;
FIVE_WORK_DAYS_IN_MONTH = 21;
HOURS_IN_WEEK = 43;
TOTAL_DAYS_IN_MONTH = 30;
HOURS_IＮ_MONTH = 186;


holiday_ratio = 1.5;
agr_holiday_ratio = 1.75;

recuperation_days = [5,6,6,7,7,7,7,7,7,7,8,8,8,8,8,9,9,9,9,10];
latest_recuperation_value = 378;
recuperation_days_agr = [7,7,7,7,7,7,7,8,9,10];

DEFAULT_WORK_WEEK = 6;

four_day_week_vacations = [8,8,8,8,10,11,12,13,14,15,15,16,16,16];
three_day_week_vacations = [6,6,6,6,7,8,9,10,10,11,11,12,12,12];
two_day_week_vacations = [4,4,4,4,5,5,6,6,7,7,8,8,8,8];
one_day_week_vacations = [2,2,2,2,3,3,3,4,4,4,4,4,4,4];
x_day_week_vacations = [one_day_week_vacations,
	two_day_week_vacations,
	three_day_week_vacations,
	four_day_week_vacations,
];
function lookupVacationDays(date, days_per_week, workedSoFar, workLeft) {
	var years = workedSoFar[0];
	//are we talking about a work year that some part of it is post reform?
	var July2016 = new Date('07/01/2016');
	var January2017 = new Date('01/01/2017');
	var post2016Reform = getMonthsDiff(date, July2016) < 12 && (workLeft[0]*12 + workLeft[1]) > getMonthsDiff(date, July2016);
	var post2017Reform = getMonthsDiff(date, January2017) < 12 && (workLeft[0]*12 + workLeft[1]) > getMonthsDiff(date, January2017);
	switch(days_per_week){
		case 6:
			if (post2017Reform){
				data = [14,14,14,14,14,16,18,19,20,21,22,23,24,24];
				return getItem(data, years);
			}
			else if (post2016Reform){
				data = [13,13,13,13,14,16,18,19,20,21,22,23,24,24];
				return getItem(data, years);
			}
			else {
				data = [12,12,12,12,14,16,18,19,20,21,22,23,24,24];
				return getItem(data, years);
			}
		case 5:
			if (post2017Reform){
				data = [12,12,12,12,12,14,15,16,17,18,19,20,20];
				return getItem(data, years);
			}
			else if (post2016Reform){
				data = [11,11,11,11,12,14,15,16,17,18,19,20,20];
				return getItem(data, years);
			}
			else {
				data = [10,10,10,10,12,14,15,16,17,18,19,20,20];
				return getItem(data, years);
			}
		default:
			return getItem(x_day_week_vacations[days_per_week-1], years)
	}
}

agr_vacations = [14,14,14,16,16,18];
agr_min_wage_bonus = [0,17.5,35,52.5,70];

cleaning_workers_temporary_hourly_wage = 24.98;
cleaning_workers_temporary_monthly_wage = 4646;

C_TEMP_MIN_WAGE = 4646;
CLEANING_RECUPERATION_VALUE = 423;
TWO_YEAR_VETERAN_BONUS = 0.35;
SIX_YEAR_VETERAN_BONUS = 0.46;

pension_waiting_data = [
[new Date('2008-01-01 00:00:00'),9],
[new Date('2009-01-01 00:00:00'),6],
];

PENSION_DATE = 0;
PENSION_MIN = 1;
//gemel
PENSION_G = 2;
//pitzuim
PENSION_P = 3;

HISHTALMUT_PERCENTAGE = 0.075;
HISHTALMUT_START = new Date('10/1/2014 00:00:00');

//date, minimum wage, gemel, pitzuyim
pension_data=[
[new Date('2008-01-01 00:00:00'),3710,0.00833,0.00833],
[new Date('2008-07-01 00:00:00'),3850,0.00833,0.00833],
[new Date('2009-01-01 00:00:00'),3850,0.0166,0.0166],
[new Date('2010-01-01 00:00:00'),3850,0.025,0.025],
[new Date('2011-01-01 00:00:00'),3850,0.03333,0.03333],
[new Date('2011-04-01 00:00:00'),3890,0.03333,0.03333],
[new Date('2011-07-01 00:00:00'),4100,0.03333,0.03333],
[new Date('2012-01-01 00:00:00'),4100,0.0416,0.0416],
[new Date('2012-10-01 00:00:00'),4300,0.0416,0.0416],
[new Date('2013-01-01 00:00:00'),4300,0.05,0.05],
[new Date('2014-01-01 00:00:00'),4300,0.06,0.06],
[new Date('2015-04-01 00:00:00'),4650,0.06,0.06],
[new Date('2016-07-01 00:00:00'),4825,0.0625,0.06],
[new Date('2017-01-01 00:00:00'),5000,0.065,0.06],
[new Date('2017-12-01 00:00:00'),5300,0.065,0.06],
];

pension_data_cleaner=[
[new Date('2014-03-01 00:00:00'), 0.07, 0.0833],
[new Date('2015-07-01 00:00:00'), 0.075, 0.0833],
];

pension_data_cleaner_overtime=[
[new Date('2013-11-01 00:00:00'), 0.07, 0.06],
[new Date('2015-07-01 00:00:00'), 0.075, 0.06],
];
pension_data_cleaner_transportation_costs= 0.05;

recuperation_days_cleaner = [7,7,7,9,9,9,9,9,9,9,10,10,10,10,10,11,11,11,11,12,12,12,12,12,13];
cleaning_vacations_five = [10,10,11,11,13,18,19,19,23];
cleaning_vacations_six = [12,12,13,13,15,20,21,21,26];