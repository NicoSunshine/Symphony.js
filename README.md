<p>
Symphony.js is a simple and lightweight (~= 700 bytes gzipped) templating script for creating dynamic content for your site.

The main idea behind the script is the insertion of new content via innerHTML.
</p>

#Template Options

The template string supports the following options:
 * {/key}: the "key" will be searched in the object or html passed as a parameter to the compose method and replaced by it's value.
 * {/$key}: the "key" will be left intact but will be accesible to replace using a custom function (this can be done passing a replace function in the constructor or, if you're using an object to pass parameters, passing a function. Tests for more info, at least for now).
 * {/key?default}: same as above, but if the "key" isn't present in the object or html, the "default" is left instead.
 * {/$key?default}: same as above, but if the "key" isn't replaced, the "default" is left instead.

Some use exaples are:

#Basic usage

	var html= "This is {/something} with one {/otherthing} in it.";
			  
	var creator = Symphony.create({
	    template: html
	});

	creator.compose([{
	    something: "some awesome thing",
	    otherthing: "epic value"
	},{
	    something: "fantastic stuff",
	    otherthing: "amazing thing"
	}]);

	//Result
	//"This is some awesome thing with one epic value in it.
	//"This is fantastic stuff with one amazing thing in it.

#Custom values and default

	// <div id='test' style='display:none;'>
	// 		<div>
	// 	    	<span>from the html</span>
	// 		</div>
	// 		<div>
	// 	    	<a href="#">won't find me</a>
	//		</div>
	// </div>
	var html= "This is a {/$firstcustom} and a value {/span?default}.";
  	
  	var cont = 0;
	var creator = Symphony.create({
	    template: html,
	    elementName: "div",
	    replaceFunction: function(data) {
	    	return "custom value n°" + (cont++);
	    }
	});

	creator.compose(document.getElementById("test"), function(generatedOutput) {
		//do something
	});

	//Result
	//"This is a custom value n°0 and a value from the html."
	//"This is a custom value n°1 and a value default."


Website coming soon, if you want to see more examples, feel free to browse the tests.