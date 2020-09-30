var baseUrl= "http://127.0.0.1:5000/";
var availableRentalUrl= "availableRental";
function filterInint(){
    //define parameters
    var selectedPriceMin="0";
    var selectedPriceMax="-1";
    var selectedFSA="";
    var selectedBedroomsMin="0";
    var selectedBedroomsMax="-1";
    //var selectedBathrooms="1";
    //select dropdowns
    //select dropdown menu for rental 
    var rentalPrice=[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]
    var dropDownMin= d3.select("#priceMin")
    dropDownMin.append("option").text("All Price");
    //give the dropdow id values
    rentalPrice.forEach(element => {
        dropDownMin.append("option").text(element);
    });
    //select dropdown menu for price 
    var dropDownMax= d3.select("#priceMax")
    dropDownMax.append("option").text("All Price");
    //give the dropdow id values
    rentalPrice.forEach(element => {
        dropDownMax.append("option").text(element);
    });
    
    
    //get no of bedrooms and bathrooms
    //get available rental data
    
    var dataPromiseIncome= d3.json((baseUrl+availableRentalUrl),function(data){
        //var bathrooms= data.map(d=> d.bathrooms);
        //bathrooms=bathrooms.filter((item, i, ar) => ar.indexOf(item) === i);
        //bathrooms= bathrooms.filter(d => +d).sort();
        var bedrooms= data.map(d=> d.bedrooms);
        bedrooms=bedrooms.filter((item, i, ar) => ar.indexOf(item) === i);
        bedrooms= bedrooms.filter(d => +d).sort();

        var dropDownBedroomsMin= d3.select("#bedroomsMin")
        dropDownBedroomsMin.append("option").text("All options");
        //give the dropdow id values
        bedrooms.forEach(element => {
            dropDownBedroomsMin.append("option").text(element);
        });
        var dropDownBedroomsMax= d3.select("#bedroomsMax")
        dropDownBedroomsMax.append("option").text("All options");
        //give the dropdow id values
        bedrooms.forEach(element => {
            dropDownBedroomsMax.append("option").text(element);
        });
        //select dropdown menu for price 
        //var dropDownBathrooms= d3.select("#bathrooms")
        //dropDownBathrooms.append("option").text("All options");
        //give the dropdow id values
        //bathrooms.forEach(element => {
            //dropDownBathrooms.append("option").text(element);
        //});
        dataM = data.filter(d =>d.FSA.substring(0,1)=="M");
        FSA =  dataM.map(d => d.FSA).reverse();
        FSA = FSA.filter((item, i, ar) => ar.indexOf(item) === i).sort();
        var dropDownFSA= d3.select("#fsa_filter")
        dropDownFSA.append("option").text("All FSA");
        //give the dropdow id values
        FSA.forEach(element => {
                dropDownFSA.append("option").text(element);
        });

        //when dropdown changed save value
        dropDownMin.on("change", function(){
            var i= this.selectedIndex;
            selectedPriceMin= rentalPrice[i-1];
            if(i==0){
                selectedPriceMin="0";
            }
        });
        dropDownMax.on("change", function(){
            var i= this.selectedIndex;
            selectedPriceMax= rentalPrice[i-1];
            if(i==0){
                selectedPriceMax="-1";
            }
        });
        dropDownBedroomsMin.on("change", function(){
            var i= this.selectedIndex;
            selectedBedroomsMin= bedrooms[i-1];
            if(i==0){
                selectedBedroomsMin="0";
            }
        });
        dropDownBedroomsMax.on("change", function(){
            var i= this.selectedIndex;
            selectedBedroomsMax= bedrooms[i-1];
            if(i==0){
                selectedBedroomsMax="-1";
            }
        });
        //dropDownBathrooms.on("change", function(){
        //     var i= this.selectedIndex;
        //     selectedBathrooms= bathrooms[i-1];
        //     if(i==0){
        //         selectedBathrooms="1";
        //     }
        // });
        dropDownFSA.on("change", function(){
            var i= this.selectedIndex;
            selectedFSA= FSA[i-1];
            if(i==0){
                selectedFSA="";
            }
        });

        //select button
        var button = d3.select("#submitFilter");
        button.on('click', function(){
            //construct the filtered url
            var filteredUrl;
            if(selectedFSA==""){
                var filteredURL= `availableRental?price=[${selectedPriceMin},${selectedPriceMax}]&bedrooms=[${selectedBedroomsMin},${selectedBedroomsMax}]`;
           
            }
            else{
            var filteredURL= `availableRental?price=[${selectedPriceMin},${selectedPriceMax}]&bedrooms=[${selectedBedroomsMin},${selectedBedroomsMax}]&FSA=${selectedFSA}`;
            }
            console.log(filteredURL);
            //get data from constructed url
            if(activeCircle) {
                TorontoMap.removeLayer(activeCircle);   
                TorontoMap.removeLayer(intCrimeMarkerGroup);       
              }
            TorontoMap.removeLayer(rentalMarkerGroup);
            //ReadLayersDisplay(baseUrl+filteredURL);
            var dataPromiseFilter= d3.json((baseUrl+filteredURL), function(rental){
                //console.log(data);
                //updateRentalMarkers(data);
                //create rental posting layer
                var rentalMarkers = [];
  
                rental.forEach(function(feature) {
  
                  var rental = L.ExtraMarkers.icon({
                    markerColor: "green-light",
                    svg: true,
                    number: rentalText(feature.bedrooms),
                    shape: 'circle',
                    iconColor: "white",
                    icon: 'fa-number'
                  });

                  rentalMarkers.push(L.marker([feature.lat, feature.long], {
                    icon: rental
                  }).bindPopup(feature.title));
                  rentalDetails.push(feature);
                });
  
                rentalMarkerGroup = L.layerGroup(rentalMarkers);
                
                var CrimeMarkers = [];
  
                //read crime dataset
                //var crimePath = `${url}crimeLastSixMonths`;
                var crimePath = "https://sogramemon.github.io/plotly-javascript-challenge/data/crimeLastSixMonths.json";
  
                d3.json(crimePath, function(fullcrime){
  
                  var crimeIcon = L.ExtraMarkers.icon({
                    icon: "ion-alert",
                    iconColor: "white",
                    markerColor: "blue",
                    shape: "penta"
                  });
  
                  var murder = fullcrime.filter(d=>d.MCI=="Homicide");
  
                  //create markers 
                  murder.forEach(row => {
                    CrimeMarkers.push(L.marker([row.lat, row.long],{
                      icon: crimeIcon
                    }).bindPopup(row.MCI)
                    .on('click', function(e){
                      //open sidebar crime tab when a homicide crime is clicked
                      sidebar.open("crime");
                    }));
                  
                  });
                  
                  //create layer
                  CrimeMarkerGroup = L.layerGroup(CrimeMarkers);
                  TorontoMap.addLayer(rentalMarkerGroup);
                  //TorontoMap.addLayer(CrimeMarkerGroup);
                   // Create an overlayMaps object to hold the community asset layer
                //     var overlayMaps = {
                //         //"Average Income" : incomeChloropleuth,
                //         "Community Services" : assetArray[0],
                //         "Education & Employment": assetArray[1],
                //         "Financial Services" : assetArray[2],
                //         "Food & Housing" : assetArray[3],
                //         "Health Services" : assetArray[4],
                //         "Law & Government": assetArray[5],
                //         "Tranportation" : assetArray[6]
                //     };
                //   var baseMaps = {
                //     "Rental Postings" : rentalMarkerGroup,
                //     "2019 Homicides" : CrimeMarkerGroup 
                 //};
                //L.control.layers(baseMaps, overlayMaps, {collapsed:true}).addTo(TorontoMap);
                RentalCrimeInteraction(rentalMarkerGroup, fullcrime, TorontoMap)


                });
                

            })
            

        }) 

        

    });
    
}



filterInint();