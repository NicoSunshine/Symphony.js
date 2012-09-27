/*!
 * Symphony
 * Site coming soon
 *
 * Copyright 2012 Nicolas Santangelo <nicosunshine@gmail.com>
 * Released under the MIT license
 * 
 *
 */
(function (window, undefined) {

    //Private functions
    var arrayFromSequence = function (sequence) {
        for (var arr = [], i = 0, len = sequence.length; i < len; i++) {
            arr.push(sequence[i]);
        }
        return arr;
    },
    change = function (key, value, tmpTemplate) {
        if (value !== undefined) {
            //Remove the leading $ if it exists, and use the Regex to replace the key with the value
            if (key[0] === "$") {
                key = key.slice(1);
            }
            return tmpTemplate.replace(new RegExp("{\\/\\$" + key + "((\\?([\\w\\s\\'\\\"]+)})|})", "g"), value);
        }
        return tmpTemplate;
    },
    find = function (value, object) {
        //Return the value of the property taking into account if the object is a document or not
        var returnMe = "";

        if(object.nodeType) {
            returnMe = object.getElementsByTagName(value)[0];
            if(returnMe !== "" && returnMe !== null && returnMe !== undefined) {
                returnMe = (returnMe.textContent || returnMe.text || returnMe.innerText);
            }
        } else {
            returnMe = object[value];
        }
        return returnMe;
    },
    replaceFunctionWithObject = function (matchedValue, key, findAndChangeObject) {
        var returnMe = matchedValue, 
            foundedValue = "", 
            slicedValue = "";

        //Strip the value inside the {/}, with or without $ and ?
        slicedValue = matchedValue.slice(2).replace(key, "").replace("$", ""); 

        //Find and return the value in the object. 
        //If is not found, and a ? is present, return the value after it. 
        //Otherwise, return the entire match
        foundedValue = findAndChangeObject.find(slicedValue);

        //If it exists see if it's a string of a function
        if(foundedValue !== undefined && foundedValue !== null) {
            if(foundedValue.slice && foundedValue !== "") {
                returnMe = foundedValue;
            } else if(typeof foundedValue === "function") { 
                returnMe = foundedValue(findAndChangeObject);
            }
        } else if (key !== "}") {
            //Use the default
            returnMe = key.slice(1, -1);
        }

        return returnMe;
    };

    //Local and global creator
    var Symphony = window.Symphony = function (options) {
        return this.setOptions(options || Symphony.DEFAULTOPTIONS);
    };

    //Object properties
    Symphony.DEFAULTOPTIONS = {
        template: "",
        elementName: "",
        replaceFunction: undefined,
        callback: undefined,    
        generatedOutput: ""
    };
    Symphony.create = function(options) {
        return new Symphony(options);
    };

    Symphony.prototype = {  
        //Add or set every property of the options parameter to the current instance
        setOptions: function (options) {
            for (var opt in options) {
                if(options.hasOwnProperty(opt)) {
                    this[opt] = options[opt];
                }
            }
            return this;
        },
        //Main method, generate a string from the template saved in the template property, with the replace arguments.
        compose: function (valuesToReplace, options) {
            var tmpTemplate = "",
                object,
                findAndChangeObject = {
                    find: function(value) { 
                        return find(value, object); 
                    },
                    change: function(key, value) { 
                        tmpTemplate = change(key, value, tmpTemplate); 
                    }
                },
                innerReplaceFunction = function(matchedValue, key) {
                    return replaceFunctionWithObject(matchedValue, key, findAndChangeObject); 
                };
            
            this.generatedOutput = "";

            //Set the options to be used, or set the callback
            if(typeof options !== "function") {
                this.setOptions(options);
            } else {
                this.callback = options;
            }    
            
            //Set a fallback just in case
            valuesToReplace = valuesToReplace || [{}];
            
            //Transform the values to replace to an array
            if(this.elementName && valuesToReplace.nodeType) {
                valuesToReplace = arrayFromSequence(valuesToReplace.getElementsByTagName(this.elementName));
            } else if(!valuesToReplace.length) {
                valuesToReplace = [valuesToReplace];
            }

            //Main replace loop
            for (var i = 0, len = valuesToReplace.length; i < len; i++) {
                
                //Set the template to use later, and the current value
                tmpTemplate = this.template;
                object = valuesToReplace[i];
                
                //Use the replaceFunction
                if(this.replaceFunction) {
                    this.replaceFunction(findAndChangeObject);
                }
                
                // Replace the temporal template with the values in the object
                // Examples: {/Rawr} {/$Rawr} {/Rawr?default} {/$Rawr?default}
                //
                //                        Begining:{\ w/o $ -> key -> default values -> Ending:}
                this.generatedOutput += tmpTemplate.replace(/\{\/\$?\w+((\?([\w\s\'\"]+)\})|\})/g, innerReplaceFunction);

            }
            //If we have a callback fire it
            if (this.callback) {
                this.callback(this.generatedOutput);
            }
            
            return this.generatedOutput;
        }
    };

})(window);