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
}

Worker.prototype = {
	
}

function HourlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, daysPerWeek, hoursPerWeek, dailyWage) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation);
	this.daysPerWeek = daysPerWeek;
	this.hoursPerWeek = hoursPerWeek;
	this.dailyWage = dailyWage;
}

extend(Worker, HourlyWorker);

function MonthlyWorker(startWorkDate, endWorkDate, isEligibleToSeperation, monthlyWage) {
	Worker.call(this, startWorkDate, endWorkDate, isEligibleToSeperation);
	this.monthlyWage = monthlyWage;
}

extend(Worker, MonthlyWorker);

//var AgriculturalWorker = Object.create(MonthlyWorker);
//סיעוד
//var Caretaker = Object.create(MonthlyWorker);
//עובדי נקיון
//var CleaningWorker = Object.create(HourlyWorker);

