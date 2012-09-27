QUnit.begin(function () {	
		var newTestMarkup = "<div id='test' style='display:none;'>" +
								"<div>" +
								    "<span>larva</span>" +
						            "<i>disgusting</i>" +
						        "</div>" +
						        "<div>" +
								    "<span>a cobra</span>" +
						            "<i>really disgusting</i>" +
						        "</div>" +
					        "</div>";

		document.getElementById("testMarkupContainer").innerHTML = newTestMarkup;
});

//--|
//|--
module("Script load");
test("script load test", function () {
    notEqual(Symphony, undefined, "Symphony loaded");
});

//--|
//|--
module("Instance creaton and setOptions");
test("Two ways to create an instance", function () {
    var newCreator = new Symphony();
    ok(newCreator instanceof Symphony, "new operator working correctly");

    var methodCreator = Symphony.create();
    ok(methodCreator instanceof Symphony, "new operator working correctly");
});
test("setOptions test", function () {
	var options = {
		template: "HTML UP IN THIS BEACH",
	    replaceFunction: function() { 
	    	console.log("mambo number five");
	    },
	    elementName: "Costanza",
	    callback: function() {
	    	console.log("who let the dogs out");
	    } 
	};

	var creator = Symphony.create(options);

	equal(creator.template, options.template, "template OK");

	deepEqual(creator.replaceFunction, options.replaceFunction, "replaceFunction OK");

	equal(creator.elementName, options.elementName, "elementName OK");

	deepEqual(creator.callback, options.callback, "callback OK");

});

//--|
//|--
module("Basic generation");
test("Generate an output from an object and an array of objects", function() {

	var creator =  Symphony.create({
	    template: "Honey Badger {/value}.",
	});

	//Object
	var myArgument = { value: "don't care" };

	creator.compose(myArgument, function(generatedOutput) {
		equal(generatedOutput, "Honey Badger don't care.", "String generated correctly from Object");
	});	

	//Array
	var argumentsArray = [
						  { value: "don't care" },
	    				  { value: "is a sleepy fuck"}
						 ];

	creator.compose(argumentsArray, function(generatedOutput) {
		equal(generatedOutput, "Honey Badger don't care.Honey Badger is a sleepy fuck.", "String generated correctly from an Array");
	});			
});
test("Generate an output from html in de DOM", function() {

	var creator = Symphony.create({
	    template: "Aww it eats {/span}, that's {/i}.",
	    elementName: "div"
	});

	creator.compose(document.getElementById("test"), function(generatedOutput) {
		equal(generatedOutput, "Aww it eats larva, that's disgusting.Aww it eats a cobra, that's really disgusting.", "String generated correctly from DOM");
	});
});

//--|
//|--
module("Custom generation");
test("Generate an output from an object and an array of objects, using a custom value. Replace function passed to the constructor", function() {

	var creator =  Symphony.create({
	    template: "Default {/value}. Custom: {/$Custom}.",
	    replaceFunction: function(data) {
	    	var customValue = data.find("customValue");
	    	data.change("Custom", "fairly " + customValue);
	    }
	});

	//Object
	var myArgument = { value: "don't care", customValue: "long body" };

	creator.compose(myArgument, function(generatedOutput) {
		equal(generatedOutput, "Default don't care. Custom: fairly long body.", "String generated correctly from an Object with a custom value");
	});	

	//Array
	var argumentsArray = [
						  	{ value: "don't care", customValue: "long body" },
	    				  	{ value: "is a sleepy fuck", customValue: "fixed set" }
						 ];

	creator.compose(argumentsArray, function(generatedOutput) {
		equal(generatedOutput, "Default don't care. Custom: fairly long body.Default is a sleepy fuck. Custom: fairly fixed set.", "String generated correctly from an Object with a custom value");
	});						 

});
test("Generate an output from html in de DOM, using a custom value. Replace function passed to the constructor", function() {

	var creator = Symphony.create({
	    template: "Default {/span}. Custom: {/$Custom}.",
	    elementName: "div",
	    replaceFunction: function(data) {
	    	var valueInITag = data.find("i");
	    	data.change("Custom", "that's " + valueInITag);
	    }
	});

	creator.compose(document.getElementById("test"), function(generatedOutput) {
		equal(generatedOutput, "Default larva. Custom: that's disgusting.Default a cobra. Custom: that's really disgusting.", "String generated correctly from DOM with a custom value");
	});
});
test("Generate an output from an object, using a custom value. Replace function in the arguments", function() {
	var creator =  Symphony.create({
	    template: "Default {/value}. Custom: {/$customValue}."
	});

	//Object
	var myArgument = { 
		value: "don't care", 
		customValue: function(data) {
	    	var anotherValue = data.find("anotherValue");
	    	return "fairly "+ anotherValue;
	    },
	    anotherValue: "long body"
	};

	creator.compose(myArgument, function(generatedOutput) {
		equal(generatedOutput, "Default don't care. Custom: fairly long body.", "String generated correctly from an Object with a custom value");
	});	
});

//--|
//|--
module("Custom generation with a default");
test("Generate an output from html in the DOM and an array of object, using a custom value. Replace function passed to the constructor", function() {

	var creator = Symphony.create({
	    template: "Honey Badger {/InSecondOnly?eatsLarva}."
	});
	
	var argumentsArray = [
						  	{ value: "don't care" },
	    				  	{ value: "is a sleepy fuck", InSecondOnly: "runs backwards" }
						 ];

	creator.compose(argumentsArray, function(generatedOutput) {
		equal(generatedOutput, "Honey Badger eatsLarva.Honey Badger runs backwards.", "String generated correctly with and without a default value");
	});

	creator.setOptions({ template: "{/rawr?don't care}"}).compose({value:"not here"}, function(generatedOutput) {
		equal(generatedOutput, "don't care", "String generated correctly with only a default value");
	});
});