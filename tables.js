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
recuperation_days_agr = 7;

DEFAULT_WORK_WEEK = 6;

six_day_week_vacations = [12,12,12,12,14,16,18,19,20,21,22,23,24,24];
five_day_week_vacations = [10,10,10,10,12,14,15,16,17,18,19,20,20];
four_day_week_vacations = [8,8,8,8,10,11,12,13,14,15,15,16,16,16];
three_day_week_vacations = [6,6,6,6,7,8,9,10,10,11,11,12,12,12];
two_day_week_vacations = [4,4,4,4,5,5,6,6,7,7,8,8,8,8];
one_day_week_vacations = [2,2,2,2,3,3,3,4,4,4,4,4,4,4];
x_day_week_vacations = [one_day_week_vacations,
	two_day_week_vacations,
	three_day_week_vacations,
	four_day_week_vacations,
	five_day_week_vacations,
	six_day_week_vacations,
];

agr_vacations = [12,12,12,16,16];
agr_min_wage_bonus = [0,17.5,35,52.5,70];

cleaning_workers_temporary_hourly_wage = 24.98;
cleaning_workers_temporary_monthly_wage = 4646;

C_TEMP_MIN_WAGE = 4646;
CLEANING_RECUPERATION_VALUE = 423;
TWO_YEAR_VETERAN_BONUS = 0.35;
SIX_YEAR_VETERAN_BONUS = 0.46;

pension_waiting_data = [
[new Date('2008-01-01'),9],
[new Date('2009-01-01'),6],
];

PENSION_DATE = 0;
PENSION_MIN = 1;
//gemel
PENSION_G = 2;
//pitzuim
PENSION_P = 3;

HISHTALMUT_PERCENTAGE = 0.075;
HISHTALMUT_START = new Date('2014-10-1');

//date, minimum wage, gemel, pitzuyim
pension_data=[
[new Date('2008-01-01'),3710,0.00833,0.00833],
[new Date('2008-07-01'),3850,0.00833,0.00833],
[new Date('2009-01-01'),3850,0.0166,0.0166],
[new Date('2010-01-01'),3850,0.025,0.025],
[new Date('2011-01-01'),3850,0.03333,0.03333],
[new Date('2011-04-01'),3890,0.03333,0.03333],
[new Date('2011-07-01'),4100,0.03333,0.03333],
[new Date('2012-01-01'),4100,0.0416,0.0416],
[new Date('2012-10-01'),4300,0.0416,0.0416],
[new Date('2013-01-01'),4300,0.05,0.05],
[new Date('2014-01-01'),4300,0.06,0.06],
[new Date('2015-04-01'),4650,0.06,0.06],
];

pension_data_cleaner=[0.07, 0.0833];
pension_data_cleaner_overtime=[
[new Date('2013-11-01'), 0.07, 0.06],
[new Date('2015-07-01'), 0.075, 0.06],
];
pension_data_cleaner_transportation_costs= 0.05;

recuperation_days_cleaner = [7,7,7,9,9,9,9,9,9,9,10,10,10,10,10,11,11,11,11,12,12,12,12,12,13];