QUnit.test( "Basic Recuper", function( assert ) {
	var good = '<div id="div_output_header"><table width="100%"><tbody><tr><td width="10%">22-10-2015</td><td style="text-align:left;" width="90%"></td></tr></tbody></table><br>שם עובד: <br>שם המעסיק: <br>שם עורך החישוב: <br>שנים: 1, &nbsp;&nbsp;&nbsp;&nbsp; חודשים: 0.00<br>תקופת עבודה: (23-10-2014) - (22-10-2015)<br>אחוז משרה: 100.0%<br>הערות: <br><br></div>\n<div id="div_output_body"><u>חישוב דמי הבראה (תשלום ליום הבראה: 378 ש"ח)</u><table border="1" id="output_table0"><tbody><tr><td><b>שנים</b></td><td><b>ימי זכאות</b></td><td><b>ימים לעובד</b></td><td><b>סכום בכל שנה</b></td></tr><tr><td>1</td><td style="text-align:center;">5.00</td><td style="text-align:center;">4.98</td><td style="text-align:center;">1,882.25</td></tr><tr></tr></tbody></table><b>סה"כ: 1,882.25</b><br><br><u>חישוב חופשה (תשלום ליום חופשה: 186.00 ש"ח)</u><table border="1" id="output_table1"><tbody><tr><td><b>שנים</b></td><td><b>ימים לשנה מלאה</b></td><td><b>ימי חופשה לעובד</b></td><td><b>סכום בכל שנה</b></td></tr><tr><td>1</td><td style="text-align:center;">12</td><td style="text-align:center;">12</td><td style="text-align:center;">2,232.00</td></tr><tr></tr></tbody></table><b>סה"כ: 2,232.00</b><br><br></div>\n<div id="div_output_footer" style="align:center;padding-right:0.5cm;padding-left:0.5cm;padding-top:1cm"></div>';
	showForm(1);
	$("#formElement2-1").val("2014-10-23");
	$("#formElement3-1").val("2015-10-22");
	resetOutput();main([calcRecuper,calcVacation,calcHolidays]);
	var result = $('#div_output').html();
	good = good.replace(/[\t\n\s]+/g, "");
	good = good.substring(90);
	result = result.replace(/[\t\n\s]+/g, "");
	result = result.substring(90);
	assert.equal( result, good, "Simple recuperation" );
});

QUnit.test("Basic Pension", function(assert) {
	var good = ' \
<div id="div_output_header"><table width="100%"><tbody><tr><td width="10%">22-10-2015</td><td style="text-align:left;" width="90%"></td></tr></tbody></table><br>שם עובד: <br>שם המעסיק: <br>שם עורך החישוב: <br>שנים: 1, &nbsp;&nbsp;&nbsp;&nbsp; חודשים: 0.00<br>תקופת עבודה: (23-10-2014) - (22-10-2015)<br>אחוז משרה: 100.0%<br>הערות: <br><br></div> \
<div id="div_output_body"><u></u> על פי חוק, החישוב נעשה על בסיס שכר המינימום בישראל או השכר בפועל - הגבוה מביניהם<br><u>חישוב פנסיה</u> (הפרשות המעסיק בלבד, החל מהחודש השביעי לעבודה)<table border="1" id="output_table2"><tbody><tr><td><b>תקופה</b></td><td><b>מס חודשים לחישוב</b></td><td><b>שכר בסיס</b></td><td><b>אחוזים</b></td><td><b>רכיב הגמל</b></td><td><b>רכיב הפיצויים</b></td><td><b>סכום תקופה</b></td></tr><tr><td>23-10-2014 - 31-03-2015</td><td style="text-align:center;">0.00</td><td style="text-align:center;">4,300.00</td><td style="text-align:center;">6.00%+6.00%</td><td style="text-align:center;">0.00</td><td style="text-align:center;">0.00</td><td style="text-align:center;">0.00</td></tr><tr></tr><tr><td>01-04-2015 - 22-10-2015</td><td style="text-align:center;">6.00</td><td style="text-align:center;">4,650.00</td><td style="text-align:center;">6.00%+6.00%</td><td style="text-align:center;">1,674.00</td><td style="text-align:center;">1,674.00</td><td style="text-align:center;">3,348.00</td></tr><tr></tr></tbody></table><b>סה"כ: 3,348.00</b><br><br></div> \
<div id="div_output_footer" style="align:center;padding-right:0.5cm;padding-left:0.5cm;padding-top:1cm"></div>';
	showForm(1);
	$("#formElement2-1").val("2014-10-23");
	$("#formElement3-1").val("2015-10-22");
	resetOutput();main([calcPension,calcCompen,calcEarly]);
	var result = $('#div_output').html();
	good = good.replace(/[\t\n\s]+/g, "");
	good = good.substring(90);
	result = result.replace(/[\t\n\s]+/g, "");
	result = result.substring(90);
	assert.equal( result, good, "Simple pension" );
})

QUnit.test("Half day a week", function(assert) {
	var good = ' \
		<div id="div_output_header"><table width="100%"><tbody><tr><td width="10%">02-11-2015</td><td style="text-align:left;" width="90%"></td></tr></tbody></table><br>שם עובד: <br>שם המעסיק: <br>שם עורך החישוב: <br>שנים: 1, &nbsp;&nbsp;&nbsp;&nbsp; חודשים: 0.00<br>תקופת עבודה: (03-11-2014) - (02-11-2015)<br>אחוז משרה: 11.6%<br>הערות: <br><br></div> \
		<div id="div_output_body"><u></u> על פי חוק, החישוב נעשה על בסיס שכר המינימום בישראל או השכר בפועל - הגבוה מביניהם<br><u>חישוב פנסיה</u> (הפרשות המעסיק בלבד, החל מהחודש השביעי לעבודה)<table border="1" id="output_table3"><tbody><tr><td><b>תקופה</b></td><td><b>מס חודשים לחישוב</b></td><td><b>שכר בסיס</b></td><td><b>אחוזים</b></td><td><b>רכיב הגמל</b></td><td><b>רכיב הפיצויים</b></td><td><b>סכום תקופה</b></td></tr><tr><td>03-11-2014 - 02-11-2015</td><td style="text-align:center;">6.00</td><td style="text-align:center;">2,150.00</td><td style="text-align:center;">6.00%+6.00%</td><td style="text-align:center;">774.00</td><td style="text-align:center;">774.00</td><td style="text-align:center;">1,548.00</td></tr><tr></tr></tbody></table><b>סה"כ: 1,548.00</b><br><br></div> \
		<div id="div_output_footer" style="align:center;padding-right:0.5cm;padding-left:0.5cm;padding-top:1cm"></div>';
	showForm(2);
	$("#formElement2-2").val("2014-11-03");
	$("#formElement3-2").val("2015-11-02");
	$("#formElement5-2").val("1000");
	$("#formElement8-2").val("0.5");
	$("#formElement9-2").val("5");
	
	resetOutput();main([calcPension,calcCompen,calcEarly]);
	var result = $('#div_output').html();
	good = good.replace(/[\t\n\s]+/g, "");
	good = good.substring(90);
	result = result.replace(/[\t\n\s]+/g, "");
	result = result.substring(90);
	assert.equal( result, good, "Simple pension" );
})