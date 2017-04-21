'use strict';

// Object containing starting wages for various 4 year degrees
var degreeSWage = require('./degreeSWage.json');
// File containing some of our utility functions (already written)
var util = require('./util.js');

//TODO: You need to write this function AND utilize it.
// bracketFromGPA(decimal GPA);
function bracketFromGPA(gpa) {
	if(gpa < 2.5)
		return 0;
	if(gpa < 3.0)
		return 1;
	if(gpa < 3.5)
		return 2;
	// 4-3.5, 3.49 - 3.0, 2.99 - 2.5
	return 3; //some form of bracket number
}

// TODO: recruiter( Array of hireables )
function recruiter(internArr) {

	var astrologyArray = internArr.slice();
	astrologyArray = [];
	var astrologyIndex = 0;
	// Below is just to help show the syntax you need,
	// you'll need to process ALL of the hireables like this one and sort
	for(var i = internArr.length - 1; i >= 0; i--){
		var index = i;
		var iname = internArr[index].name;
		var idegr = internArr[index].degree;
		var igpa = internArr[index].gpa;
		var iexp = internArr[index].experiance;
		var iwage, ivalue, ibracket, imetric;

		idegr = idegr.toLowerCase();
		iwage = degreeSWage[idegr];

		if(idegr == "astrology"){ //for astrology degrees
			astrologyArray[astrologyIndex] = internArr[index];

			internArr.splice(index, 1);

			ivalue = util.getValueFromWageAndExp(iwage, Math.floor(iexp));
			ibracket = bracketFromGPA (igpa);

			imetric = 4*ivalue + ibracket;
			astrologyArray[astrologyIndex].metric = imetric;

			astrologyIndex++;
		}
		else if(igpa < 2.5 || iwage == undefined){ //remove students under 2.5 gpa or unrecognized degree

			internArr.splice(index, 1);

			index = index - 1;
		}
		else{
			ivalue = util.getValueFromWageAndExp(iwage, Math.floor(iexp));
			ibracket = bracketFromGPA (igpa);

			// Hmm... this doesn't seem to follow the spec - fix it
			imetric = 4*ivalue + ibracket;

			// We really want to add our sorting number "metric" to objects (it really is this easy)
			internArr[index].metric = imetric;
		}

	}

	// and then sort them all (it doesn't return anything, it modifies the array sent)
	util.sortInternObjects( internArr );
	util.sortInternObjects( astrologyArray );	//sort astrology by metric

	internArr = internArr.concat(astrologyArray);	//stick astrology at end of array

	// Output
	// An array of HIREABLE 'intern objects' (in order of most valueable to least valueable)
	// with at least the properties "name", "metric", "degree"
	// You can come up with any number you want for "metric" as long as it corresponds to the spec
	// and people earlier in the array have equal or greater values for "metric" than
	// people further down.

	if(internArr.length > 0){
		for(var j = 0; j < internArr.length; j++){
			console.log(internArr[j].name + " " + internArr[j].metric + " " + internArr[j].degree);
		}
		return internArr;
	}else{
		return astrologyArray;
	}
};

module.exports = {
	recruiter: recruiter,
	bracketFromGPA: bracketFromGPA
};
