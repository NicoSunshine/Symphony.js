(function(){
  
  var mydiv = document.createElement("div");
  
  with(mydiv) {
    id = "performanceTest";
    innerHTML = "Start profiling and click here";
  }
  with(mydiv.style) {
    backgroundColor = "#FE57A1";
    width = "100px";
    heigth = "100px";
    borderRadius = "5px";
    textAlign = "center";
    position =  "absolute";
    top = "20px";
    left = "20px";
    cursor = "pointer";
  }

  mydiv.onclick = function() {

    var teststr = "This is a string with a {/value} value in it {/$custom1} {/$custom2} I like {/pet?Dogs}, do you like {/otherPet?Cats}?";

    var testObj = [],
        cont = 1000;

    while (cont--) {
        testObj.push({
            value: "peperoni",
            something: "yaay",
            pip: "ooouh"
        });
    }

    var newCreator = new Symphony({
        template: teststr,
        replaceFunction: function(data) {
            var change = data.change,
                find = data.find;
            change("custom1", "Raaawr");
            change("custom2", find("something") + find("pip"));
        }
    });

    newCreator.compose(testObj, function(generatedHtml) {
        generatedHtml += "....tasty!";
    });

  };

  document.getElementsByTagName("body")[0].appendChild(mydiv);
})();