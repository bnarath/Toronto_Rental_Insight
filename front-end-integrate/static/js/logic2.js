 //the url for the earthquake data
 var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 function chooseColor(mag) {
   mag=+mag;
   if(mag<1){
     return "green";
   }
   else if(mag<2){
     return "#91cf60";
   }
   else if(mag<3){
     return "#ffffbf";
   }
   else if(mag<4){
     return "#fc8d59"
   }
   else if(mag<5){
     return "#d95f0ecf"
   }
   else{
     return "#f03b20"
   }
 }

 //Perform a GET requet to the query URL
 d3.json(url, function(earthquakeData){
     console.log(earthquakeData.features.map(d => d.geometry.coordinates[0]));
     // Once we get a response, send the data.features object to the createFeatures function
 //createFeatures(data.features);

   var earthquakes = L.geoJSON(earthquakeData, {
     pointToLayer: function (feature, latlng) {
      
         return L.circleMarker(latlng, {
           radius: feature.geometry.coordinates[2],
           fillColor: chooseColor(feature.properties.mag),
           color: "white",
           weight: 1,
           opacity: 1,
           fillOpacity: 0.75
       }).bindPopup("<h3>" + feature.properties.place +
       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
       
     }

     
   });
 
   // Sending our earthquakes layer to the createMap function
   createMap(earthquakes);
 
 
 function createMap(earthquakes) {
 
   // Define streetmap and darkmap layers
   var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 18,
     zoomOffset: -1,
     id: "mapbox/streets-v11",
     accessToken: API_KEY
   });
 
   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: "dark-v10",
     accessToken: API_KEY
   });
 
   // Define a baseMaps object to hold our base layers
   var baseMaps = {
     "Street Map": streetmap,
     "Dark Map": darkmap
   };
 
   // Create overlay object to hold our overlay layer
   var overlayMaps = {
     Earthquakes: earthquakes
   };
 
   // Create our map, giving it the streetmap and earthquakes layers to display on load
   var myMap = L.map("map-id", {
     center: [
       37.09, -95.71
     ],
     zoom: 5,
     layers: [streetmap, earthquakes]
   });
 
   // Create a layer control
   // Pass in our baseMaps and overlayMaps
   // Add the layer control to the map
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(myMap);
   // Set up the legend
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "info legend");
     var limits = ["1-2","2-3", "3-4","4-5", "5+"];
     var colors = ["green", "#91cf60", "#ffffbf", "#fc8d59", "#d95f0ecf", "#f03b20"];
     var labels = [];
 
     // Add min & max
     var legendInfo = "<h4>Earthquake Magnitude</h4>" +
       "<div class=\"labels\">" +
         "<div class=\"min\">" + limits[0] + "</div>" +
         "<div class=\"center\">" + limits[1] + "</div>" +
         "<div class=\"center\">" + limits[2] + "</div>" +
         "<div class=\"center\">" + limits[3] + "</div>" +
         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
       "</div>";
 
     div.innerHTML = legendInfo;
 
     limits.forEach(function(limit, index) {
       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
     });
 
     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
     return div;
   };
 
   // Adding legend to the map
   legend.addTo(myMap);

   //sidebar
   var sidebar = L.control.sidebar('sidebar').addTo(myMap);
 }
 
})