function createMap (assetArray, rental, crime, data) {

  //create fsa layer from FSA geoJSON file

  var FSApath = "static/js/Toronto2.geojson"

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

    // Create an overlayMaps object to hold the community asset layer
  var overlayMaps = {
      "Community Services" : assetArray[0],
      "Education & Employment": assetArray[1],
      "Financial Services" : assetArray[2],
      "Food & Housing" : assetArray[3],
      "Health Services" : assetArray[4],
      "Law & Government": assetArray[5],
      "Tranportation" : assetArray[6]
    };

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
          "Rental Postings" : rental,
          "2019 Homicides" : crime
      };
  

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
  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(TorontoMap);

  mapLegend(TorontoMap)

  RentalCrimeInteraction(rental, data, TorontoMap)

  // rental.popupclose()
    //Your code here

};

function ReadLayersDisplay () {

    //create fsa layer from geoJSON file

  var communityAssetpath = "static/js/community_assets_with_cooridnates.csv";

  var servicesAsset = new L.LayerGroup();
  var healthAsset = new L.LayerGroup();
  var foodAsset = new L.LayerGroup();
  var transportAsset = new L.LayerGroup();
  var lawAsset = new L.LayerGroup();
  var educationAsset = new L.LayerGroup();
  var financialAsset = new L.LayerGroup();

  d3.csv(communityAssetpath, d => {

      d.forEach(row=> {

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
          d3.csv('static/js/Rental_Craigslist.csv', function(rental){

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
              d3.csv('static/js/Crime.csv', function(fullcrime){

                var crimeIcon = L.ExtraMarkers.icon({
                  icon: "ion-person-stalker",
                  iconColor: "white",
                  markerColor: "blue",
                  shape: "penta"
                });

                var murder = fullcrime.filter(d=>d.MCI=="Homicide");

                murder.forEach(row => {
                  CrimeMarkers.push(L.marker([row.lat, row.long],{
                    icon: crimeIcon
                  }).bindPopup(row.MCI));
                
                });
                
                var CrimeMarkerGroup = L.layerGroup(CrimeMarkers);

                createMap(assetArray, rentalMarkerGroup, CrimeMarkerGroup, fullcrime);
                
              });
          });
    });


};

ReadLayersDisplay ();

//function for creating legend
function mapLegend (map) {

  colors = ["yellow", "red", "orange", "green", "purple", "blue", "#0079A4"];

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
                  categories = ["Community Services", 
                                'Education & Employment',
                                "Financial Services",
                                "Food & Housing",
                                "Health Services",
                                "Law & Government",
                                "Transportation"
                              ],
                  labels =[];
    
    div.innerHTML += '<strong> Community Asset </strong> <br>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + colors[i] + '"></i> ' +
            categories[i] + '<br>';
    };
    return div;
 };
legend.addTo(map);

};

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
      return "yellow";
    case "Education & Employment":
      return "red";
    case "Financial Services":
      return "orange";
    case "Food & Housing":
      return "green";
    case "Health Services":
      return "purple";
    case "Law & Government":
      return "blue";
    case "Transportation":
        return "#0079A4";
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

    marker.bindTooltip(`<h2> ${agencyName}</h2>`);
    
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
             fillColor: "grey"
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
              }).bindPopup(data[i].MCI));

            }
          intcrimeMarkerGroup = L.layerGroup(allCrimeMarkers).addTo(map);
          }

        });
    });
  };

  // function for styling crime marker

function crimeColors(type){
  switch (type) {
    case "Assault":
      return "yellow";
    case "Auto Theft":
      return "red";
    case "Break and Enter":
      return "orange";
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

  