//test json files

// var path = '../static/js/crimeLastYear.json';

// d3.json(path, function(data) {
//   console.log(data)
//         });
var heatmap;
var heatmapMarker = false;
var activeCircle = false;
var intCrimeMarkerGroup = L.layerGroup([]);
var circleCenterPoint = [0,0]; //gets the circle's center latlng
var isInCircleRadius = false;
var r = 0;
var radius = 1000;
var TorontoMap;
var rentalMarkerGroup;
var CrimeMarkerGroup;
var assetArray;
var rentalDetails=[];
var dataDisplayed=[];
var rentalPath = `${url}availableRental`;
//var rentalPath ="https://sogramemon.github.io/plotly-javascript-challenge/data/minavailableRental.json";


function createHeatmap(){

  // Function to map opacity based on MCI
  function findOpacity(MCI){

    switch(MCI) {
      case "Assault":
        return 0.7;
      case "Auto Theft":
          return 0.1;
      case "Homicide":
        return 0.9;
      case "Break and Enter":
        return 0.4;
      case "Robbery":
        return 0.4;
      case "Theft Over":
        return 0.1;
    }


  }

  var myMap = L.map("crime-heatmap", {
    center: [43.728754, -79.388561],
    zoom: 9,
    minZoom: 9,
    maxZoom: 12
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    minZoom: 9,
    maxZoom: 12,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  var url = "http://127.0.0.1:5000/CrimeLastMonth";
  d3.json(url, function(fullcrime){
    var heatArray = fullcrime.map(d=>[d.lat, d.long, findOpacity(d.MCI)]);
    var heat = L.heatLayer(heatArray, {
      radius: 20,
      blur: 35
    }).addTo(myMap);

  });
  
 
  // // To handle changing window
  // const resizeObserver = new ResizeObserver(() => {
  //   myMap.invalidateSize();
  // });
  // const mapDiv = document.getElementById("crime-heatmap");
  // resizeObserver.observe(mapDiv);
  return myMap;


}


function createMap (assetArray, rental, crime, data) {

    //create fsa layer from FSA geoJSON file
  
    //var FSApath = "../data/Toronto2.geojson"
    var FSApath = "https://sogramemon.github.io/plotly-javascript-challenge/data/Toronto2.geojson";
  
    var FSA = new L.LayerGroup();
    

    d3.json(FSApath, function(data) {
      L.geoJSON(data, {
          style: FSAStyle,
        // Call pop-up for FSA
        onEachFeature: function(feature, layer) {
          layer.bindTooltip(feature.properties.CFSAUID).on('click', function(e){
            //deactivate crime circle
            console.log("here");
            //sidebar open rental trends when FSA clicked
            sidebar.open("rental");
            //bind data
          });
        }
          }).addTo(FSA)
        });
  
      // Create an overlayMaps object to hold the community asset layer
    var overlayMaps = {
        //"Average Income" : incomeChloropleuth,
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
      TorontoMap = L.map("map", {
      center: [43.72, -79.35],
      zoom: 12,
      layers : [streetview, FSA, rental]
    }).on('click', function(e){
      // console.log(e.latlng["lat"], e.latlng["lng"]);
      if(activeCircle) {
        if (Math.abs(circleCenterPoint.distanceTo([e.latlng["lat"], e.latlng["lng"]])) > r)
        {           
          TorontoMap.removeLayer(activeCircle);   
          TorontoMap.removeLayer(intCrimeMarkerGroup);       
        };

            }
            });
  
    //set limits on zoom
    TorontoMap.options.maxZoom = 20;
  
    TorontoMap.options.minZoom = 12;
  
    // Pass map layers into layer control and add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {collapsed:true}).addTo(TorontoMap);
  
    mapLegend(TorontoMap)
  
    RentalCrimeInteraction(rental, data, TorontoMap)
  
};
  
  function ReadLayersDisplay (rentalPath) {

    heatmap= createHeatmap();
  
      //create community asset layers
  
    //var communityAssetpath = `${url}communityAssets`;
    var communityAssetpath = "https://sogramemon.github.io/plotly-javascript-challenge/data/communityAssets.json";
  
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
  
      assetArray = [servicesAsset, educationAsset, 
                        financialAsset, foodAsset, 
                        healthAsset, lawAsset, transportAsset]
  
            //read rental posting dataset
  
            //var rentalPath = `${url}availableRental`;
            //var rentalPath ="https://sogramemon.github.io/plotly-javascript-challenge/data/minavailableRental.json";
  
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
                     
                  createMap(assetArray, rentalMarkerGroup, CrimeMarkerGroup, fullcrime);
                  
                
            });
         });
  
    });
    
    };
  
  ReadLayersDisplay (rentalPath);
  
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
  
      marker.bindPopup(agencyName)
      .on('click', function(e){
        // open sidebar when community asset clicked
        sidebar.open("communityListing");
        //select div tags and bind data
        displayCommunityListing(agencyName, category, lat, long);
      });
      
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
  
        //var radius = 1000;
        //var activeCircle = false;
  
        //var r = 0; //in meters
        //var circleCenterPoint = [0,0]; //gets the circle's center latlng
        //var isInCircleRadius = false;
  
        //var intCrimeMarkerGroup = L.layerGroup([]);
  
        //Draw circle when clicked
        rentalMarkerGroup.getLayers().forEach(function(obj, i) {
          
          obj.on('click', function(e) {
            // marker clicked is e.target
            // marker clicked is e.target

            sidebar.open('rentalListing',0);
            if(heatmapMarker){
              curr_zoom = console.log(heatmap.getZoom());
              heatmap.removeLayer(heatmapMarker);
            }
            heatmapMarker = L.marker(e.target.getLatLng(), {markerColor:'red'}).addTo(heatmap);
            heatmap.setView([43.728754, -79.388561], 9);
         
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
            console.log("In function");
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
                    dataDisplayed.push(data[i]);
                    allCrimeMarkers.push(L.marker([data[i].lat, data[i].long], {
                    icon: crimeIcon
                    }).bindPopup(data[i].MCI).on('click', function(e){
                      //open sidebar crime tab when a crime is clicked
                      sidebar.open("crime");
                      displayCrime(dataDisplayed);
                    })
                    );
                }
            };
  
            intCrimeMarkerGroup = L.layerGroup(allCrimeMarkers).addTo(map);

            //open sidebar for rental listing
            sidebar.open("rentalListing");
            //call function to create rental display
            displayRentalListing(e.target.getLatLng(), e.target.getPopup().getContent());
            //displayRentalListing(e.target.getPopup().getContent());
            
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

    
            

    

    