WEEKS_IN_MONTH = 4.3;
SIX_WORK_DAYS_IN_MONTH = 25;
FIVE_WORK_DAYS_IN_MONTH = 21;
HOURS_IN_WEEK = 43;
TOTAL_DAYS_IN_MONTH = 30;

holiday_ratio = 1.5;
agr_holiday_ratio = 1.75;

recuperation_days = [5,6,6,7,7,7,7,7,7,7,8,8,8,8,8,9,9,9,9,10];
latest_recuperation_value = 374;
recuperation_days_agr = 7;

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

pension_waiting_data = [
[new Date('2008-01-01'),9],
[new Date('2009-01-01'),6],
];

pension_data=[
[new Date('2008-01-01'),3710,0.00833,0.00833],
[new Date('2008-02-01'),3710,0.00833,0.00833],
[new Date('2008-03-01'),3710,0.00833,0.00833],
[new Date('2008-04-01'),3710,0.00833,0.00833],
[new Date('2008-05-01'),3710,0.00833,0.00833],
[new Date('2008-06-01'),3710,0.00833,0.00833],
[new Date('2008-07-01'),3850,0.00833,0.00833],
[new Date('2008-08-01'),3850,0.00833,0.00833],
[new Date('2008-09-01'),3850,0.00833,0.00833],
[new Date('2008-10-01'),3850,0.00833,0.00833],
[new Date('2008-11-01'),3850,0.00833,0.00833],
[new Date('2008-12-01'),3850,0.00833,0.00833],
[new Date('2009-01-01'),3850,0.0166,0.0166],
[new Date('2009-02-01'),3850,0.0166,0.0166],
[new Date('2009-03-01'),3850,0.0166,0.0166],
[new Date('2009-04-01'),3850,0.0166,0.0166],
[new Date('2009-05-01'),3850,0.0166,0.0166],
[new Date('2009-06-01'),3850,0.0166,0.0166],
[new Date('2009-07-01'),3850,0.0166,0.0166],
[new Date('2009-08-01'),3850,0.0166,0.0166],
[new Date('2009-09-01'),3850,0.0166,0.0166],
[new Date('2009-10-01'),3850,0.0166,0.0166],
[new Date('2009-11-01'),3850,0.0166,0.0166],
[new Date('2009-12-01'),3850,0.0166,0.0166],
[new Date('2010-01-01'),3850,0.025,0.025],
[new Date('2010-02-01'),3850,0.025,0.025],
[new Date('2010-03-01'),3850,0.025,0.025],
[new Date('2010-04-01'),3850,0.025,0.025],
[new Date('2010-05-01'),3850,0.025,0.025],
[new Date('2010-06-01'),3850,0.025,0.025],
[new Date('2010-07-01'),3850,0.025,0.025],
[new Date('2010-08-01'),3850,0.025,0.025],
[new Date('2010-09-01'),3850,0.025,0.025],
[new Date('2010-10-01'),3850,0.025,0.025],
[new Date('2010-11-01'),3850,0.025,0.025],
[new Date('2010-12-01'),3850,0.025,0.025],
[new Date('2011-01-01'),3850,0.03333,0.03333],
[new Date('2011-02-01'),3850,0.03333,0.03333],
[new Date('2011-03-01'),3850,0.03333,0.03333],
[new Date('2011-04-01'),3890,0.03333,0.03333],
[new Date('2011-05-01'),3890,0.03333,0.03333],
[new Date('2011-06-01'),3890,0.03333,0.03333],
[new Date('2011-07-01'),4100,0.03333,0.03333],
[new Date('2011-08-01'),4100,0.03333,0.03333],
[new Date('2011-09-01'),4100,0.03333,0.03333],
[new Date('2011-10-01'),4100,0.03333,0.03333],
[new Date('2011-11-01'),4100,0.03333,0.03333],
[new Date('2011-12-01'),4100,0.03333,0.03333],
[new Date('2012-01-01'),4100,0.0416,0.0416],
[new Date('2012-02-01'),4100,0.0416,0.0416],
[new Date('2012-03-01'),4100,0.0416,0.0416],
[new Date('2012-04-01'),4100,0.0416,0.0416],
[new Date('2012-05-01'),4100,0.0416,0.0416],
[new Date('2012-06-01'),4100,0.0416,0.0416],
[new Date('2012-07-01'),4100,0.0416,0.0416],
[new Date('2012-08-01'),4100,0.0416,0.0416],
[new Date('2012-09-01'),4100,0.0416,0.0416],
[new Date('2012-10-01'),4300,0.0416,0.0416],
[new Date('2012-11-01'),4300,0.0416,0.0416],
[new Date('2012-12-01'),4300,0.0416,0.0416],
[new Date('2013-01-01'),4300,0.05,0.05],
[new Date('2013-02-01'),4300,0.05,0.05],
[new Date('2013-03-01'),4300,0.05,0.05],
[new Date('2013-04-01'),4300,0.05,0.05],
[new Date('2013-05-01'),4300,0.05,0.05],
[new Date('2013-06-01'),4300,0.05,0.05],
[new Date('2013-07-01'),4300,0.05,0.05],
[new Date('2013-08-01'),4300,0.05,0.05],
[new Date('2013-09-01'),4300,0.05,0.05],
[new Date('2013-10-01'),4300,0.05,0.05],
[new Date('2013-11-01'),4300,0.05,0.05],
[new Date('2013-12-01'),4300,0.05,0.05],
[new Date('2014-01-01'),4300,0.06,0.06],
];
