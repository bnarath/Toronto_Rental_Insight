
function createMap (assetArray, rental, crime, data) {

  //create fsa layer from FSA geoJSON file

  var FSApath = "../data/Toronto2.geojson"

  var FSA = new L.LayerGroup();

  d3.json(FSApath, function(data) {
    L.geoJSON(data, {
        style: FSAStyle,
      // Call pop-up for FSA
      onEachFeature: function(feature, layer) {
        layer.bindTooltip(feature.properties.CFSAUID);
      }
        }).addTo(FSA)
      });

          // Define a baseMaps object to hold our base layers
  var baseLayers = [
        {
          name:  "Rental Postings",
          layer: rental
        },
        {
          name:  '2019 Homicides',
          layer: crime
        },
      ];

        //create overlay object
      var overLayers = [{
        collapsed: true,
        group: "Community Assets", 
        layers:[{
          name: '<p class="CS"> Community Services </p>',
          layer: assetArray[0]
        },
        {
          name: '<p class="EE"> Education & Employment </p>',
          layer: assetArray[1]
        },
        {
          name: '<p class="FS"> Financial Services </p>',
          layer: assetArray[2]
        },
        {
          name: '<p class="FH"> Food & Housing </p>',
          layer: assetArray[3]
        },
        {
          name: '<p class="HS"> Health Services </p>',
          layer: assetArray[4]
        },
        {
          name: '<p class="LG"> Law & Government </p>',
          layer: assetArray[5]
        },
        {
          name: '<p class="TR"> Transportation </p>',
          layer: assetArray[6]
        }],
        
      }];
      

  // create tile layer
  var streetview = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          tileSize: 512,
          maxZoom: 18,
          zoomOffset: -1,      
          id: "streets-v11",
          accessToken: API_KEY
        });


  // Create the map object with layers
  var TorontoMap = L.map("map", {
    center: [43.72, -79.35],
    zoom: 12,
    layers : [streetview, FSA, rental]
  });

  //set limits on zoom
  TorontoMap.options.maxZoom = 20;

  TorontoMap.options.minZoom = 12;

  // Pass map layers into layer control and add the layer control to the map
  TorontoMap.addControl( new L.Control.PanelLayers(baseLayers, overLayers, {collapsibleGroups: true}));

  RentalCrimeInteraction(rental, data, TorontoMap)

};

function ReadLayersDisplay () {

    //create community asset layers

  var communityAssetpath = `${url}/communityAssets`;

  var servicesAsset = new L.LayerGroup();
  var healthAsset = new L.LayerGroup();
  var foodAsset = new L.LayerGroup();
  var transportAsset = new L.LayerGroup();
  var lawAsset = new L.LayerGroup();
  var educationAsset = new L.LayerGroup();
  var financialAsset = new L.LayerGroup();

  d3.json(communityAssetpath, function(data){
      
      data.forEach(row=> {

        var lat = parseFloat(row.latitude).toFixed(10);
        var long = parseFloat(row.longitude).toFixed(10);
        var category = row.category;
        var agencyName = row.agency_name;
    
        if (row.category == "Community Services") {
          markerAllocation(agencyName, category, lat, long, servicesAsset)
        }
        else if (row.category == "Education & Employment") {
          markerAllocation(agencyName,category, lat, long, educationAsset)
        }
        else if (row.category == "Financial Services") {
          markerAllocation(agencyName, category, lat, long, financialAsset)
        }
        else if (row.category == "Food & Housing") {
          markerAllocation(agencyName, category, lat, long, foodAsset)
        }
        else if (row.category == "Health Services") {
          markerAllocation(agencyName, category, lat, long, healthAsset)
        }
        else if (row.category == "Law & Government") {
          markerAllocation(agencyName, category, lat, long, lawAsset)
        }
        else if (row.category == "Transportation") {
          markerAllocation(agencyName, category, lat, long, transportAsset)
        }
        else {
        }
    });

    var assetArray = [servicesAsset, educationAsset, 
                      financialAsset, foodAsset, 
                      healthAsset, lawAsset, transportAsset]

          //read rental posting dataset

          var rentalPath = `${url}availableRental`;

          d3.json(rentalPath, function(rental){

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
              });

              var rentalMarkerGroup = L.layerGroup(rentalMarkers);
              
              var CrimeMarkers = [];

              //read crime dataset
              var crimePath = `${url}crimeLastSixMonths`;

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
                  }).bindPopup(row.MCI));
                
                });
                
                //create layer
                var CrimeMarkerGroup = L.layerGroup(CrimeMarkers);
                   
                createMap(assetArray, rentalMarkerGroup, CrimeMarkerGroup, fullcrime);
                
              
          });
       });

      });
};

ReadLayersDisplay ();

//function for styling FSA polygons
function FSAStyle (feature) {
  return {
      fillColor: null,
      color: "grey",
      fillOpacity: 0
  };
};

// function for styling community assets

function assestColors(type){
  switch (type) {
    case "Community Services":
      return  "rgb(235, 201, 8)";
    case "Education & Employment":
      return "rgb(168, 9, 168)";
    case "Financial Services":
      return "rgb(7, 161, 7)";
    case "Food & Housing":
      return "rgb(214, 13, 13)";
    case "Health Services":
      return "rgb(13, 117, 214)";
    case "Law & Government":
      return "rgb(15, 59, 100)";
    case "Transportation":
        return "rgb(14, 248, 236)";
    default:
      return "black";
    }
  
};

//function to create markers and add to layer

function markerAllocation(agencyName, category, lat, long, array){

    // For each station, create a marker and bind a popup with the station's name
    var marker = L.circle([lat, long], {
      color: assestColors(category),
      fillColor: assestColors(category),
      fillOpacity: 0.4,
      radius: 90
      });

    marker.bindPopup(agencyName);
    
    // Add the marker to array
    array.addLayer(marker);

    return array
};


//function to determine text on rental icons

function rentalText (text){
  if(text > 0){
    return parseInt(text)
      }
  else{
    return "?"
  };
};

//function to draw circle around rental posting and display crime incidences within it
function RentalCrimeInteraction(rentalMarkerGroup, data, map){

      var radius = 1000;
      var activeCircle = false;

      var r = 0; //in meters
      var circleCenterPoint = [0,0]; //gets the circle's center latlng
      var isInCircleRadius = false;

      var intCrimeMarkerGroup = L.layerGroup([]);

      //Draw circle when clicked
      rentalMarkerGroup.getLayers().forEach(function(obj) {
        
        obj.on('click', function(e) {
          // marker clicked is e.target
       
          if(intCrimeMarkerGroup) {
            map.removeLayer(intCrimeMarkerGroup);
          };

          // remove active circle if any
          if(activeCircle) {
            map.removeLayer(activeCircle);
          }
          // draw a 1km circle with the same center as the marker 
          activeCircle = L.circle(e.target.getLatLng(), { 
            radius: radius ,
             fillColor: "grey",
             color: "grey"
             }).addTo(map);

          r = activeCircle.getRadius(); //in meters

          circleCenterPoint = activeCircle.getLatLng(); //gets the circle's center latlng
          
          allCrimeMarkers = [];

          for (var i = 0; i < data.length; i++) {
            isInCircleRadius = Math.abs(circleCenterPoint.distanceTo([data[i].lat, data[i].long])) <= r;
            
            var crimeIcon = L.ExtraMarkers.icon({
              markerColor: crimeColors(data[i].MCI),
              icon: crimeIcons(data[i].MCI),
              iconColor: "white",
              shape: "penta"          
            });

            // add marker only if the point is within the area
            if (isInCircleRadius) {
              allCrimeMarkers.push(L.marker([data[i].lat, data[i].long], {
                icon: crimeIcon
              }).bindPopup(data[i].MCI)
              );
            };
        };
            intCrimeMarkerGroup = L.layerGroup(allCrimeMarkers).addTo(map);
          });
        });
  };

// function for styling crime marker colors
function crimeColors(type){
  switch (type) {
    case "Assault":
      return "yellow";
    case "Auto Theft":
      return "red";
    case "Break and Enter":
      return "orange-dark";
    case "Homicide":
      return "blue";
    case "Robbery":
      return "purple";
    case "Theft Over":
        return "#0079A4";
    default:
      return "black";
    }
  
};

  // function for styling crime icons
  function crimeIcons(type){
    switch (type) {
      case "Assault":
        return "ion-person-stalker";
      case "Auto Theft":
        return "ion-android-car";
      case "Break and Enter":
        return "ion-android-home";
      case "Homicide":
        return "ion-alert";
      case "Robbery":
        return "ion-android-hand";
      case "Theft Over":
          return "ion-android-hand";
      default:
        return "ion-alert";
      }
  };
 
//income choropleuth color function 

function incomeColors(value){

  var Path = "static/js/Toronto_FSA";

  var holderIncomeAvg = 0;

  d3.csv(FSAPath, function(data) {
      
      data.forEach(d =>{

      if(d.FSA == value){
          holderIncomeAvg = d.avgIncome
         }
       else{};
      });
  });

  if (holderIncomeAvg < 20000){
    return "#C9A4E4";
  }
  else if(holderIncomeAvg => 20000 && value <30000){
    return "#A365D1";
  }
  else if(holderIncomeAvg => 30000 && value <40000){
    return "#7A34AE";
  }
  else if(holderIncomeAvg => 40000 && value <50000){
    return "#7A34AE";
  }
  else if(holderIncomeAvg => 50000 && value <60000){
    return "#7A34AE";
  }
  else if(holderIncomeAvg => 60000 && value <70000){
    return "#7A34AE";
  }
  else if(holderIncomeAvg=> 70000){
    return "#7A34AE";
  }
  else{
    return null;
  }
};