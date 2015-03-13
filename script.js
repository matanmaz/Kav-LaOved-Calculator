last_update = "13.3.2015"

NUMBER_OF_FORMS = 4;
LANG = 1;
selectedForm = 0;
showImage = true;

CARETAKER_FORM = 1;
DAILY_WORKER_FORM = 2;
AGRICULTURAL_WORKER_FORM = 3;
MONTHLHY_WORKER_FORM = 4;

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

var $_GET = getQueryParams(document.location.search);
if($_GET.lang)
{
	if($_GET.lang=='en')
		LANG=0;
	else if($_GET.lang=='he')
		LANG=1;
	else if($_GET.lang=='ar')
		LANG=2;
}

function isPageLtr () {
	if(LANG==0)
		return true;
	return false;
}

$(function() {
	initPage();
 });

function initPage() {

	//initialization
	if(isPageLtr())
		document.body.dir="ltr";
	else
		document.body.dir="rtl";

	$("#div_main").append('Calculator from: ' + last_update + "<br/>");
	
	$("#div_main").append('<input id="lang0" type="button" value="English" onClick="setLang(0);"/> ');
	$("#div_main").append('<input id="lang0" type="button" value="עברית" onClick="setLang(1);"/><br/>');

	$("#div_main").append('<input type="button" value="'+STR.print[LANG]+'" onClick="printOutput();"/> ');
	$("#div_main").append('<input type="button" value="'+STR.reset[LANG]+'" onClick="resetOutput();"/><br/>');
	$("#div_main").append('<input id="option1" type="button" value="'+ STR.caretaker_menu[LANG] +'" onClick="showForm(1);"/> ');
	$("#div_main").append('<input id="option2" type="button" value="'+ STR.daily_worker_menu[LANG] +'" onClick="showForm(2);"/> ');
	$("#div_main").append('<input id="option3" type="button" value="'+ STR.agricultural_worker_menu[LANG] +'" onClick="showForm(3);"/> ');
	$("#div_main").append('<input id="option4" type="button" value="'+ STR.monthly_worker_menu[LANG] +'" onClick="showForm(4);"/> ');

	formElement1 = "<tr><td>"+STR.employee_name[LANG] + ":</td><td><input type='text' id='formElement1-%d'/></td></tr>";
	$("#form1").append(sprintf(formElement1,1));
	$("#form2").append(sprintf(formElement1,2));
	$("#form3").append(sprintf(formElement1,3));
	$("#form4").append(sprintf(formElement1,4));

	formElement22 = "<tr><td>"+STR.employer_name[LANG] + ":</td><td><input type='text' id='formElement22-%d'/></td></tr>";
	$("#form1").append(sprintf(formElement22,1));
	$("#form2").append(sprintf(formElement22,2));
	$("#form3").append(sprintf(formElement22,3));
	$("#form4").append(sprintf(formElement22,4));

	formElement21 = "<tr><td>"+STR.editor_name[LANG] + ":</td><td><input type='text' id='formElement21-%d'/></td></tr>";
	$("#form1").append(sprintf(formElement21,1));
	$("#form2").append(sprintf(formElement21,2));
	$("#form3").append(sprintf(formElement21,3));
	$("#form4").append(sprintf(formElement21,4));

	formElement23 = "<tr><td>"+STR.comments[LANG] + ":</td><td><textarea rows='2' cols='30' id='formElement23-%d'/></td></tr>";
	$("#form1").append(sprintf(formElement23,1));
	$("#form2").append(sprintf(formElement23,2));
	$("#form3").append(sprintf(formElement23,3));
	$("#form4").append(sprintf(formElement23,4));
	
	formElement2 = "<tr><td>"+STR.start_date[LANG] + ":</td><td><input type='date' id='formElement2-%d' value='2010-01-01'/></td></tr>";
	$("#form1").append(sprintf(formElement2,1));
	$("#form2").append(sprintf(formElement2,2));
	$("#form3").append(sprintf(formElement2,3));
	$("#form4").append(sprintf(formElement2,4));
	lastYear = new Date();
	lastYear.setYear(lastYear.getFullYear()-1);
	lastYear.setDate(lastYear.getDate() + 1);
	for(i=1;i<NUMBER_OF_FORMS+1;i++){
		$("#formElement2-"+i).val(dateToString(lastYear,2));
	}

	formElement3 = "<tr><td>"+STR.end_date[LANG] + ":</td><td><input type='date' id='formElement3-%d' value='2013-04-01'/></td></tr>";
    $("#form1").append(sprintf(formElement3,1));
	$("#form2").append(sprintf(formElement3,2));
	$("#form3").append(sprintf(formElement3,3));
	$("#form4").append(sprintf(formElement3,4));
	for(i=1;i<NUMBER_OF_FORMS+1;i++){
		$("#formElement3-"+i).val(dateToString(new Date(),2));
	}

	formElement4 = "<tr><td>"+STR.month_wage[LANG] + ":</td><td><input type='number' id='formElement4-%d'/></td></tr>";
	$("#form1").append(sprintf(formElement4,1));
	$("#form3").append(sprintf(formElement4,3));
	$("#form4").append(sprintf(formElement4,4));

	formElement20 = "<tr><td>"+STR.work_percentage[LANG] + ":</td><td><input type='number' value='100' id='formElement20-%d'/></td></tr>";
	$("#form4").append(sprintf(formElement20,4));

	formElement5 = "<tr><td>"+STR.daily_wage[LANG] + ":</td><td><input type='number' id='formElement5-%d'/></td></tr>";
	$("#form2").append(sprintf(formElement5,2));
	
	formElement6 = "<tr><td>"+STR.week_allowance[LANG] + ":</td><td><input type='number' id='formElement6-%d'/></td></tr>";
	$("#form1").append(sprintf(formElement6,1));
	$("#form3").append(sprintf(formElement6,3));

	formElement7 = "<tr><td>"+STR.holidays_for_calc[LANG] + ":</td><td><input type='number' id='formElement7-%d' value='0'/></td></tr>";
	$("#form1").append(sprintf(formElement7,1));
	$("#form3").append(sprintf(formElement7,3));
	$("#form4").append(sprintf(formElement7,4));

	formElement8 = "<tr><td>"+STR.num_days_in_week[LANG] + ":</td><td><input type='number' id='formElement8-%d' value='0'/></td></tr>";
	$("#form2").append(sprintf(formElement8,2));

	formElement9 = "<tr><td>"+STR.num_hours_in_week[LANG] + ":</td><td><input type='number' id='formElement9-%d' value='0'/></td></tr>";
	$("#form2").append(sprintf(formElement9,2));

	formElement19 = "<tr><td>"+STR.five_day_week[LANG] + ":</td><td><input type='checkbox' id='formElement19-%d'/></td></tr>";
	$("#form4").append(sprintf(formElement19,4));	

	formElement13 = "<tr><td>"+STR.elig_compen[LANG] + ":</td><td><input type='checkbox' id='formElement13-%d' onClick='checkedEligCompen()'/></td></tr>";
    $("#form1").append(sprintf(formElement13,1));
	$("#form2").append(sprintf(formElement13,2));
	$("#form3").append(sprintf(formElement13,3));
	$("#form4").append(sprintf(formElement13,4));
	
	formElement24 = "<tr id='formElementRow24-%d'><td>"+STR.show_elig_details[LANG] + ":</td><td><input type='checkbox' id='formElement24-%d'/></td></tr>";
    $("#form1").append(sprintf(formElement24,1,1));
	$("#form2").append(sprintf(formElement24,2,2));
	$("#form3").append(sprintf(formElement24,3,3));
	$("#form4").append(sprintf(formElement24,4,4));
	
	formElement14 = "<tr><td>"+STR.calc_total_w_oldness[LANG] + ":</td><td><input type='checkbox' id='formElement14-%d'/></td></tr>";
    $("#form1").append(sprintf(formElement14,1));
	$("#form2").append(sprintf(formElement14,2));
	$("#form3").append(sprintf(formElement14,3));
	$("#form4").append(sprintf(formElement14,4));

	formElement15 = "<tr><td><input type='button' value='"+STR.calc_recuper_vacation_and_holidays[LANG] + "' id='formElement15-%d' onClick='resetOutput();calcRecuper(true);calcVacation();calcHolidays()'/></td><td></td></tr>";
    $("#form1").append(sprintf(formElement15,1));
	$("#form2").append(sprintf(formElement15,2));
	$("#form3").append(sprintf(formElement15,3));
	$("#form4").append(sprintf(formElement15,4));

	formElement17 = "<tr><td><input type='button' value='"+STR.calc_compen[LANG] + "' id='formElement17-%d' onClick='resetOutput();calcPension(true);calcCompen();calcEarly();'/></td><td></td></tr>";
    $("#form1").append(sprintf(formElement17,1));
	$("#form2").append(sprintf(formElement17,2));
	$("#form3").append(sprintf(formElement17,3));
	$("#form4").append(sprintf(formElement17,4));

    showForm();
}

function checkedEligCompen(){
	sep_elig = $('#formElement13-'+selectedForm).is(':checked');
	if(sep_elig)
		$('#formElementRow24-'+selectedForm).show();
	else
		$('#formElementRow24-'+selectedForm).hide();
}

function showForm(formId){
	formId = formId || 0;
	for(i=1;i<=NUMBER_OF_FORMS;i++)
	{
		if(i==formId)
			$("#form"+i).show();
		else
			$("#form"+i).hide();
	}
	selectedForm = formId;
	checkedEligCompen()
}

function isSeparationEligible() {
	return $('#formElement13-'+selectedForm).is(':checked');
}

function isInputValid(dateA, dateB){
	//validate input
	if(selectedForm==0) {
		alert('Type of worker hasn\'t been selected');
		return false;
	}
	
	if(dateA == "Invalid Date" || dateB == "Invalid Date" || dateB<=dateA) {
		alert(STR.alert_no_dates[LANG]);
		return false;
	}
	
	dateDiff = getDateDiff(dateA, dateB)
	if(dateDiff[0]<1 && isSeparationEligible()){
		alert(STR.output_compen_less_than_year_alert[LANG]);
		return false;
	}
	
	if($('#formElement20-'+selectedForm).val() > 100) {
		alert(STR.alert_part_time_over_hundred[LANG]);
		return false;
	}

	if(selectedForm==DAILY_WORKER_FORM){
		num_days_in_week = $('#formElement8-2').val();
		if((!num_days_in_week>0) || num_days_in_week>6)
		{
			alert(STR.alert_bad_days_in_week[LANG]);
			return false;
		}
	}
	return true;
}

function getEndDate() {
	end_date = new Date($("#formElement3-"+selectedForm).val());
	return new Date(end_date.setDate(end_date.getDate()+1));
}

function getPartTimeFraction(){
	//returns achuz misra
	partial = 1;
	if(selectedForm==DAILY_WORKER_FORM)
	{
		hours = $('#formElement9-2').val();
		hours = hours > 43 ? 43 : hours;
		if(!hours)
			alert(STR.alert_no_hours_in_week[LANG]);
		partial = hours / 43;
	}
	if(selectedForm==MONTHLHY_WORKER_FORM)
	{
		partial = $('#formElement20-4').val()/100;
	}
	return partial;
}

function getRecuperationDays(year, ignorePartial){
	var partial = getPartTimeFraction();
	if(ignorePartial)
		partial = 1;
	if(selectedForm == AGRICULTURAL_WORKER_FORM)
		return partial*recuperation_days_agr;
	else
	{
		if(year-1 < recuperation_days.length)
			return partial*recuperation_days[year-1];
		else
			return partial*recuperation_days[recuperation_days.length-1];
	}
}

function getRecuperationValue(date){
	return latest_recuperation_value;
}

function getOldness(period, yearsBack){
	if($('#formElement14-'+selectedForm).is(':checked'))
		return period[0]>=yearsBack ? [period[0]-yearsBack, period[1]] : [0,0];
	return [0,0];
}

function getVacationDayValue(yearNum){
	min_month_value = pension_data[pension_data.length-1][1];
	month_value = getMonthWage(min_month_value, yearNum);
	return month_value / getNumWorkDaysInMonth();
}

function getVacationDays (year, months) {	
	year = year - 1;
	num_days_in_week = $('#formElement8-2').val();
	fiveDayWeekVacation = year >= five_day_week_vacations.length ? five_day_week_vacations[five_day_week_vacations.length-1] : five_day_week_vacations[year];
	sixDayWeekVacation = year >= six_day_week_vacations.length ? six_day_week_vacations[six_day_week_vacations.length-1] : six_day_week_vacations[year];
	if(num_days_in_week>=1)
	{
		lastYearInTable = x_day_week_vacations[num_days_in_week-1].length;
		xDayWeekVacation = year >= lastYearInTable ? x_day_week_vacations[num_days_in_week-1][lastYearInTable-1] : x_day_week_vacations[num_days_in_week-1][year];
	}
	
	if(selectedForm == DAILY_WORKER_FORM)
	{	
		if(num_days_in_week>=1)
			vacation_days = xDayWeekVacation*months/12;
		else if(months==12)
			vacation_days = fiveDayWeekVacation * num_days_in_week * 52 / 200;
		else vacation_days = fiveDayWeekVacation * num_days_in_week *
			months * WEEKS_IN_MONTH / 240;
	}
	else if(selectedForm == AGRICULTURAL_WORKER_FORM){
		vacation_days = agr_vacations[year]*months/12;
	}
	
	else if($('#formElement19-4').is(':checked'))
		vacation_days = fiveDayWeekVacation*months/12;
	else vacation_days = sixDayWeekVacation*months/12;
	
	if(vacation_days - Math.floor(vacation_days) >= 0.9)
		return Math.floor(vacation_days)+1;
	else
		return Math.floor(vacation_days);
}

function calcRecuper(isFirst){
	start_date = $("#formElement2-"+selectedForm).val();
	end_date = getEndDate()
	dateA = new Date(start_date);
	dateB = new Date(end_date);
	if(isFirst)
		if(!isInputValid(dateA, dateB))
			return;
	//convert dates to months and years of work
	dateDiff = getDateDiff(dateA, dateB);

	//define output table headers
	headers = [STR.years[LANG], STR.days_potential[LANG], STR.days_net[LANG], STR.amount_per_year[LANG]];

	partial = getPartTimeFraction();//part time consideration

	recuperation_value = getRecuperationValue(dateB);//value of each recuperation day
	recuperation_total = 0;//running total
	recuperation_total_without_oldness = 0;

	//start filling the table
	rows = [];

	//calculate and ignore oldness and calculate what will be shown
	for(i=1;i<=dateDiff[0];i++)
	{
		days = getRecuperationDays(i);
		irecuperation_value = days * recuperation_value;
		recuperation_total_without_oldness += irecuperation_value;
		rows[i-1]=[i, getRecuperationDays(i, true), days, irecuperation_value];
		if(dateDiff[0] - i < 2)//oldness calc: include last two years
		{
			recuperation_total += rows[i-1][3];
		}
	}
	//if worked part of a year this is the remainder
	remainder = getRecuperationDays(i) * dateDiff[1]/12;
	
	if(dateDiff[0]>0 && remainder>0){
		recuperation_total_without_oldness += remainder * recuperation_value;
		rows[i-1] = [i, getRecuperationDays(i, true), remainder, remainder * recuperation_value];
		recuperation_total += rows[i-1][3];
	}

	//get visual
	createOutputTable(isFirst, STR.output_recuper[LANG] + " (" + STR.recuper_day[LANG] + ": " + recuperation_value + " " + STR.shekels[LANG] + ")", dateDiff, headers, rows,['%d','%.2f','%.2f','%.2f']);
	
	output = $("#div_output");

	if($('#formElement14-'+selectedForm).is(':checked'))
		output_body.append(sprintf("<b>%s: %.2f</b><br/><b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			recuperation_total_without_oldness,STR.total_amount_oldness[LANG],recuperation_total));
	else
		output_body.append(sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			recuperation_total_without_oldness));
}

function calcVacation(isFirst){
	start_date = $("#formElement2-"+selectedForm).val();
	end_date = getEndDate()
	dateA = new Date(start_date);
	dateB = new Date(end_date);
	if(isFirst)
		if(!isInputValid(dateA, dateB))
			return;
	//convert dates to months and years of work
	dateDiff = getDateDiff(dateA, dateB);

	//define output table headers
	headers = [STR.years[LANG], STR.vacation_days_potential[LANG], STR.vacation_days_net[LANG], STR.amount_per_year[LANG]];

	total_value = 0;//running total
	total_value_without_oldness = 0;//running total

	//start filling the table
	rows = [];

	vacationDayValue = getVacationDayValue(dateDiff[0]);

	//this 'for loop' handles whole years
	//remainder is taken care of later
	for(i=1;i<=dateDiff[0];i++)
	{
		days = getVacationDays(i,12);
		i_day_value = days * vacationDayValue;
		total_value_without_oldness += i_day_value;
		rows[i-1]=[i, getVacationDays(i,12), days, i_day_value];
		if(dateDiff[0] - i < 3)//oldness calc: include last three years
		{
			total_value += rows[i-1][3];
		}
	}
	//if worked part of a year this is the remainder
	remainder = getVacationDays(i, dateDiff[1]);
	
	if(dateDiff[1]>0 && remainder>0){
		total_value_without_oldness += remainder * vacationDayValue;
		rows[i-1] = [i, getVacationDays(i,12), remainder, remainder * vacationDayValue];
		total_value += rows[i-1][3];
	}

	//get visual
	createOutputTable(isFirst, sprintf("%s (%s: %.2f " + STR.shekels[LANG] + ")",STR.output_vacation[LANG], STR.vacation_day[LANG], vacationDayValue), dateDiff, headers, rows,['%d','%d','%d','%.2f']);
	output = $("#div_output");

	if($('#formElement14-'+selectedForm).is(':checked'))
		output_body.append(sprintf("<b>%s: %.2f</b><br/><b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			total_value_without_oldness,STR.total_amount_oldness[LANG],total_value));
	else
		output_body.append(sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
			total_value_without_oldness));
}

sepPayTotal = 0;

function calcPension(isFirst){
	start_date = $("#formElement2-"+selectedForm).val();
	end_date = getEndDate()
	dateA = new Date(start_date);
	dateB = new Date(end_date);
	if(isFirst)
		if(!isInputValid(dateA, dateB))
			return;
	//convert dates to months and years of work
	dateDiff = getDateDiff(dateA, dateB);
	sep_elig = $('#formElement13-'+selectedForm).is(':checked');
	sep_elig_show_details = sep_elig && $('#formElement24-'+selectedForm).is(':checked');
	//define output table headers
	
	//different columns depending on separation stuff:
	if(sep_elig && (!sep_elig_show_details) ){
		headers = [STR.period[LANG], STR.num_months[LANG], STR.base_salary_for_calc[LANG], STR.percentages[LANG], STR.subtotal_pension[LANG], STR.subtotal_period[LANG]];
		printFormat = ['%s','%.2f','%.2f','%s','%.2f','%.2f']
	}
	else {
		headers = [STR.period[LANG], STR.num_months[LANG], STR.base_salary_for_calc[LANG], STR.percentages[LANG], STR.subtotal_pension[LANG], STR.subtotal_separation[LANG], STR.subtotal_period[LANG]];
		printFormat = ['%s','%.2f','%.2f','%s','%.2f','%.2f','%.2f']
	}
	total_value = 0;//running total

	//start filling the table
	rows = [];

	//init pension calculation variables
	total_months = 0;
	months_waited = 0;
	doneWaiting = false;
	periodStart = new Date(dateA);
	running_index = 0;

	//handle case that work started before pension_data:
	if(dateA < pension_data[running_index][0]){
		months_waited += getMonthsDiff(dateA, pension_data[running_index][0]);
		periodStart = new Date(pension_data[running_index][0]);
	}
	else{
		//find the first pension_data by running on running index
		while(dateA >= pension_data[running_index][0])
			running_index++;
		running_index--;
	}

	while(running_index<pension_data.length && pension_data[running_index][0]<dateB){
		num_months = 0;
		startIndex = running_index;
		periodMinWage = pension_data[running_index][1];
		
		periodPercentage = pension_data[running_index][2];

		periodTotal = 0;
		while(pension_data.length > running_index 
			&& pension_data[running_index][0] < dateB 
			&& isPensionSame(startIndex,running_index, Math.floor(total_months/12))){
			running_index++;
		}
		if(pension_data.length == running_index){
			periodEnd = new Date(dateB);
			period = getMonthsDiff(periodStart, periodEnd);
			periodEnd.setDate(periodEnd.getDate()-1);
		}
		else if(pension_data[running_index][0] >= dateB){
			periodEnd = new Date(dateB);
			period = getMonthsDiff(periodStart, periodEnd);
		}
		else
		{
			periodEnd = new Date(pension_data[running_index][0]);
			period = getMonthsDiff(periodStart, periodEnd);
			periodEnd.setDate(periodEnd.getDate()-1);
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
				periodTotal += partial * getMonthWage(periodMinWage, Math.floor(total_months/12)) * periodPercentage;
			}

			period--;
		}
		(sep_elig && (!sep_elig_show_details))? total_value += periodTotal : total_value += periodTotal * 2;
		
		period = dateToString(periodStart,1) + " - " + dateToString(periodEnd,1);
		
		//whether we show X% or X%+X%:
		periodPercentageString = sprintf("%.2f%%", periodPercentage*100)
		periodPercentageString = (sep_elig && (!sep_elig_show_details))? periodPercentageString : periodPercentageString + "+" + periodPercentageString
		
		//different columns depending on sep:
		if(sep_elig && (!sep_elig_show_details) ){
			rows.push([period, num_months, getMonthWage(periodMinWage, Math.floor(total_months/12)), periodPercentageString, periodTotal, periodTotal]);
		}
		else {
			rows.push([period, num_months, getMonthWage(periodMinWage, Math.floor(total_months/12)), periodPercentageString, periodTotal, periodTotal, periodTotal*2]);
		}

		periodStart = new Date(periodEnd);
		periodStart.setDate(periodEnd.getDate()+1);
	}

	//get visual	
	createOutputTable(isFirst, "</u>" + STR.pension_statement[LANG] + "<br/><u>" + STR.output_pension[LANG] + "</u> " + STR.output_pension_expl[LANG], dateDiff, headers, rows, printFormat);
	output = $("#div_output");
	output_body.append(sprintf("<b>%s: %.2f</b><br/><br/>", STR.total_amount[LANG], 
		total_value));
	
	//In case both checkmarks are checked, we need the separation pay total saved so that we can deduct it from the compensation total
	sepPayTotal = 0
	if(sep_elig && sep_elig_show_details){
		sepPayTotal = total_value / 2;
	}
}

function calcHolidays(isFirst){
	if(selectedForm == DAILY_WORKER_FORM)
		return;
	start_date = $("#formElement2-"+selectedForm).val();
	end_date = getEndDate()
	dateA = new Date(start_date);
	dateB = new Date(end_date);
	if(isFirst)
		if(!isInputValid(dateA, dateB))
			return;
	numHolidays = $('#formElement7-'+selectedForm).val();
	dateDiff = getDateDiff(dateA, dateB);
	output_table_id = createOutputTable(isFirst, sprintf("%s (%s: %.2f " + STR.shekels[LANG] + ")",STR.output_holidays[LANG], STR.holiday_day[LANG], getHolidayValue(dateDiff[0])), dateDiff, [], [], ['%d','%d','%d','%.2f']);
	table = $("#output_table"+output_table_id);
	if(numHolidays!="")
		table.append(sprintf("<tr><td>%s: %s</td><td>%s: %.2f</td></tr>",
			STR.num_holidays[LANG], numHolidays, STR.total_amount_holidays[LANG], getHolidayTotal(dateDiff[0],$('#formElement7-'+selectedForm).val())));
}

function calcCompen (isFirst) {
	start_date = $("#formElement2-"+selectedForm).val();
	end_date = getEndDate()
	dateA = new Date(start_date);
	dateB = new Date(end_date);
	sep_elig = $('#formElement13-'+selectedForm).is(':checked');
	sep_elig_show_details = sep_elig && $('#formElement24-'+selectedForm).is(':checked');
	
	if(isFirst)
		if(!isInputValid(dateA, dateB))
			return;
	min_month_value = pension_data[pension_data.length-1][1];
	dateDiff = getDateDiff(dateA, dateB);

	//case when compensation is not to be show:
	//if worker isn't eligible
	if(!$('#formElement13-'+selectedForm).is(':checked'))
		return;

	month_value = getMonthWage(min_month_value, dateDiff[0]);
	
	createOutputTable(isFirst, STR.output_compen[LANG], dateDiff, [], [], []);
	output = $("#div_output");
	
	//alert that worker isn't eligible due to working less than a year
	if(dateDiff[0]<1) {
		output_body.append("<p>" + STR.output_compen_less_than_year[LANG] + "<p/>");
	}
	//in this case indeed some money is deserved and we show the calculation
	else {
		compensation = month_value * (dateDiff[0] + dateDiff[1]/12);

		
		
		if(sep_elig && (!sep_elig_show_details) ){
			output_body.append(sprintf("%s:<p " + (isPageLtr()? "" : "style='text-align:right;' ") +
			 "dir='ltr'>%.2f X %.2f = <b>%.2f</b></p>",
					STR.compen_label1[LANG], dateDiff[0] + dateDiff[1]/12, month_value, compensation));
		}
		if(sep_elig && sep_elig_show_details){
			output_body.append(sprintf("%s:<p " + (isPageLtr()? "" : "style='text-align:right;' ") +
			 "dir='ltr'>%.2f X %.2f - %.2f = <b>%.2f</b></p>",
					STR.output_compen_complement[LANG], dateDiff[0] + dateDiff[1]/12, month_value, sepPayTotal, compensation - sepPayTotal));
		}
	}
}

function calcEarly (isFirst) {
	start_date = $("#formElement2-"+selectedForm).val();
	end_date = getEndDate()
	dateA = new Date(start_date);
	dateB = new Date(end_date);
	if(isFirst)
		if(!isInputValid(dateA, dateB))
			return;
	min_month_value = pension_data[pension_data.length-1][1];
	dateDiff = getDateDiff(dateA, dateB);

	//case when early notice is not to be show:
	//if worker isn't eligible and has worked at least a year 
	if(!$('#formElement13-'+selectedForm).is(':checked') && dateDiff[0]>0)
		return;

	numDays = getNumDaysEarlyNotice(dateDiff, dateB);
	isMonthEarlyNotice = numDays==-2;

	if(!isMonthEarlyNotice){
		runningDate = new Date(dateB);

		runningDate.setDate(runningDate.getDate()+1);
		workDays = 0;
		num_days_in_week = getNumDaysInWeek();
		while(numDays>0) {
			if(numDays<1)
				workDays+=numDays;
			else if(runningDate.getDay()<num_days_in_week)
				workDays++;
			runningDate.setDate(runningDate.getDate()+1);
			numDays--;
		}

		min_month_value = pension_data[pension_data.length-1][1];
		earlyPay = getDayWage(min_month_value, dateDiff[0]) * workDays;
	}
	else{
		min_month_value = pension_data[pension_data.length-1][1];
		earlyPay = getMonthWage(min_month_value, dateDiff[0]);
	}
	output_table_id = createOutputTable(isFirst, STR.output_early[LANG], dateDiff, [], [], []);
	table = $("#output_table"+output_table_id);
	if(isMonthEarlyNotice)
		table.append(sprintf("<tr><td>%s:</td><td><b>%s</b></td></tr>",
			STR.compen_label2[LANG], STR.month[LANG]));
	else
		table.append(sprintf("<tr><td>%s:</td><td><b>%.1f</b></td></tr>",
			STR.compen_label2[LANG], getNumDaysEarlyNotice(dateDiff, dateB)));
	if(selectedForm != DAILY_WORKER_FORM){
		if(!isMonthEarlyNotice){
			table.append(sprintf("<tr><td>%s:</td><td><b>%.1f</b></td></tr>",
					STR.compen_label3[LANG], workDays));
		}
		table.append(sprintf("<tr><td>%s:</td><td><b>%.2f</b></td></tr>",
				STR.compen_label4[LANG], earlyPay));
	}
}

function getNumDaysInWeek () {
	if(selectedForm == CARETAKER_FORM || selectedForm == AGRICULTURAL_WORKER_FORM)
		return 6;
	if(selectedForm == 2)
		return $('#formElement8-2').val();
	if(selectedForm == 4){
		if($('#formElement19-4').is(':checked'))
			return 5;
		else
			return 6;
	}
}

function getNumWorkDaysInMonth () {
	if(selectedForm == CARETAKER_FORM || selectedForm == AGRICULTURAL_WORKER_FORM)
		return SIX_WORK_DAYS_IN_MONTH;
	if(selectedForm == 2)
		return $('#formElement8-2').val() * WEEKS_IN_MONTH;
	if(selectedForm == 4){
		if($('#formElement19-4').is(':checked'))
			return FIVE_WORK_DAYS_IN_MONTH;
		else
			return SIX_WORK_DAYS_IN_MONTH;
	}
}

function getNumDaysEarlyNotice (dateDiff, dateB) {
	numDays = 0;
	if(selectedForm == DAILY_WORKER_FORM){
		if(dateDiff[0]<1)
			numDays = dateDiff[1];
		else if(dateDiff[0]<2)
			numDays = 14 + dateDiff[1]/2;
		else if(dateDiff[0]<3)
			numDays = 21 + dateDiff[1]/2;
		else
		{
			return -2;
		}
	}
	else{
		if(dateDiff[0]<1 && dateDiff[1]<6)
			numDays = dateDiff[1];
		else if(dateDiff[0]==0)
			numDays = 2.5*(dateDiff[1]-6)+6;
		else
		{
			return -2;
		}
	}
	return numDays;
}

function getMonthsDiff (dateA, dateB) {
	periodDateDiff = getDateDiff(dateA, dateB);
	return periodDateDiff[0]*12+periodDateDiff[1];
}

function getPensionWaiting (date) {
	i=0;
	pension_waiting = pension_waiting_data[0][1];
	while(i < pension_waiting_data.length && date >= pension_waiting_data[i][0]){
		pension_waiting = pension_waiting_data[i][1];
		i++;
	}
	return pension_waiting;
}

function dateToString (date, format) {
	if(format==0)
		return date.getMonth()+1 + "/" + date.getFullYear();
	else if(format==1){
		month = (date.getMonth()+1);
		if(month<10)
			month = "0"+month;
		day = date.getDate();
		if(day<10)
			day = "0"+day;
		return  day + "-" + month + "-" + date.getFullYear();
	}
	else if(format==2){
		day = ("0" + date.getDate()).slice(-2);
    	month = ("0" + (date.getMonth() + 1)).slice(-2);

    	return date.getFullYear()+"-"+(month)+"-"+(day) ;
	}
}

function addMonth (date, month) {
	newDate = new Date(date);
	newDate.setMonth(date.getMonth()+month);
	return newDate;
}

function getMonthWage (min_month_value, yearNum) {
	if(selectedForm == DAILY_WORKER_FORM){
		day_value = $('#formElement5-2').val();
		num_days_in_week = $('#formElement8-2').val();
		num_hours_in_week = $('#formElement9-2').val();
		num_hours_in_day = num_hours_in_week / num_days_in_week;
		hour_value = day_value / num_hours_in_day;
		min_hour_value = min_month_value / WEEKS_IN_MONTH / HOURS_IN_WEEK;
		if(day_value=="" || num_hours_in_week=="" || hour_value<min_hour_value)
			return min_hour_value * num_hours_in_week * WEEKS_IN_MONTH;
		return day_value * num_days_in_week * WEEKS_IN_MONTH;
	}
	month_value = 1*$('#formElement4-'+selectedForm).val();
	if(selectedForm == CARETAKER_FORM || selectedForm == AGRICULTURAL_WORKER_FORM)
	{
		//add pocket money
		month_value += $('#formElement6-'+selectedForm).val() * WEEKS_IN_MONTH;
	}
	//adjust minimum wage to the percentage of work of full time
	if(selectedForm == MONTHLHY_WORKER_FORM)
		min_month_value = min_month_value*getPartTimeFraction();

	//minimum wage for agricultural workers is higher according to years they've worked
	if(selectedForm == AGRICULTURAL_WORKER_FORM)
	{
		if(yearNum < agr_min_wage_bonus.length) 
			min_month_value += agr_min_wage_bonus[yearNum];
		else
			min_month_value += agr_min_wage_bonus[agr_min_wage_bonus.length - 1];
	}
	
	if(min_month_value > month_value){
		month_value = min_month_value;
	}
	
	return month_value;
}

function getDayWage (min_month_value, yearNum) {
	month_value = getMonthWage (min_month_value, yearNum);
	if(selectedForm == DAILY_WORKER_FORM){
		num_days_in_week = $('#formElement8-2').val();
		return month_value / num_days_in_week / WEEKS_IN_MONTH;
	}
	if(selectedForm == CARETAKER_FORM || selectedForm == AGRICULTURAL_WORKER_FORM)
	{
		return month_value / SIX_WORK_DAYS_IN_MONTH;
	}

	if(selectedForm == MONTHLHY_WORKER_FORM)
	{
		if($('#formElement19-4').is(':checked'))
			return month_value / FIVE_WORK_DAYS_IN_MONTH;
		else
			return month_value / SIX_WORK_DAYS_IN_MONTH;
	}
}

function isPensionSame (indexA, indexB, yearNum) {
	//whether the pension in the index is the same considering the wage and the percentage
	minWageA = pension_data[indexA][1];
	minWageB = pension_data[indexB][1];
	monthWage = getMonthWage(periodMinWage, yearNum)
	isEarningMinWage = monthWage <= minWageB*getPartTimeFraction();
	var startIndex = isEarningMinWage ? 1 : 2;
	for(i=startIndex;i<pension_data[indexA].length;i++)
		if(pension_data[indexA][i]!=pension_data[indexB][i])
			return false;
	return true;
}

tableId = 0;

function createOutputTable(isFirst, title, dateDiff, headers, rows, formats){
	employee_name = $('#formElement1-'+selectedForm).val();
	employer_name = $('#formElement22-'+selectedForm).val();
	comments = $('#formElement23-'+selectedForm).val();
	editor_name = $('#formElement21-'+selectedForm).val();
	output = $("#div_output");
	output_header = $("#div_output_header");
	output_body = $("#div_output_body");
	output_footer = $("#div_output_footer");
	table2 = $("<table border='1' id='output_table"+(tableId++)+"'></table>");
	
	if(isFirst){
		table1 = $("<table width='100%'></table>");
		table1.append(sprintf("<tr><td width='10%%'>%s</td><td style='text-align:left;' width='90%%'>%s</td></tr>",dateToString(new Date(),1),showImage?"<img src='cropped-logo.gif'/>":"",1));
		output_header.append(table1);
		output_header.append(sprintf("<br/>%s: %s<br/>",STR.employee_name[LANG], employee_name));
		output_header.append(sprintf("%s: %s<br/>",STR.employer_name[LANG], employer_name));
		output_header.append(sprintf("%s: %s<br/>",STR.editor_name[LANG], editor_name));
		output_header.append(sprintf("%s: %d, &nbsp&nbsp&nbsp&nbsp %s: %.2f<br/>",
			STR.years[LANG], dateDiff[0], STR.months[LANG], dateDiff[1]));
		output_header.append(sprintf("%s: (%s) - (%s)<br/>",
			STR.work_period[LANG], dateToString(dateA,1), dateToString(dateB,1)));
		output_header.append(sprintf("%s: %.1f%%<br/>", STR.work_percentage[LANG], 
			getPartTimeFraction()*100))
		output_header.append(sprintf("%s: %s<br/><br/>",STR.comments[LANG], comments));
		
		//show contact details
		if(showImage){
			output_footer.append("<img width='100%' src='contact-info.jpg'/>");
		}
	}

	output_body.append("<u>"+title+"</u>");
	
	headerHtml = "<tr>";
	for(header in headers){
		headerHtml += sprintf("<td><b>%s</b></td>",headers[header]);
	}
	headerHtml += "</tr>";
	table2.append(headerHtml);

	for(row in rows){
		rowHtml = "<tr>";
		i=0;
		for(cell in rows[row]){
			rowHtml += sprintf("<td" + (cell==0 ? "" : " style='text-align:center;'") + ">" + formats[i++] + "</td>",rows[row][cell]);
		}
		rowHtml += "<tr>";
		table2.append(rowHtml);
	}
	output_body.append(table2);
	return tableId-1;
}

function resetOutput () {
	output_header = $("#div_output_header");
	output_header.empty();
	output_body = $("#div_output_body");
	output_body.empty();
	output_footer = $("#div_output_footer");
	output_footer.empty();
	
}

function getHolidayTotal (yearNum, numHolidays) {
	return getHolidayValue(yearNum) * numHolidays;
}

function getHolidayValue (yearNum) {
	ratio = holiday_ratio;
	if(selectedForm == AGRICULTURAL_WORKER_FORM)
		ratio = agr_holiday_ratio;
	return ratio * getVacationDayValue(yearNum);
}

function getNumDaysInMonth(year,month){
	return (new Date(year,month,0)).getDate();
}

function getDateDiff(dateA, dateB) {
	//calculates B - A
	if(dateA == "Invalid Date" || dateB == "Invalid Date")
	{
		alert(STR.alert_no_dates[LANG]);
		return;
	}
	yearA = dateA.getYear();
	yearB = dateB.getYear();
	monthA = dateA.getMonth();
	monthB = dateB.getMonth();
	dayA = dateA.getDate();
	dayB = dateB.getDate();
	years = yearB - yearA;
	if(monthB<monthA || (monthB==monthA && dayA>dayB))
	{
		monthB+=12;
		years--;
	}
	months = monthB-monthA;	
	if(dayB<dayA){
		months-=1;
		dayB += TOTAL_DAYS_IN_MONTH;
	}
	months += (dayB-dayA)/getNumDaysInMonth(dateB.getFullYear(), monthB+1);

	return [years, months];
}

function resetPage(){
	$('#div_main').empty();
	for(i=1;i<=NUMBER_OF_FORMS;i++)
		$('#form'+i).empty();
	resetOutput();
	initPage();
}

function setLang(lang){
	if(lang==LANG)
		return;
	LANG = lang;
	resetPage();
}

function printOutput() {
    //Get the HTML of div
    $('#div_main').hide();
    $('#div_form').hide();
    $('#hr_divide').hide();
    //Print Page
    window.print();
 	$('#div_main').show();
    $('#div_form').show();
    $('#hr_divide').show();
}
