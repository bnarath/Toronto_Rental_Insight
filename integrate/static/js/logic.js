var radius = 1000;
var activeCircle = false;

var r = 0; //in meters
var circleCenterPoint = [0,0]; //gets the circle's center latlng
var isInCircleRadius = false;


// var MyDemoClass = L.Class.extend({

//   // A property with initial value = 42
//   myDemoProperty: 42,   

//   // A method 
//   myDemoMethod: function() { return this.myDemoProperty; }
  
// });


function CreateMap(rental, crime){


    //Create a outdoor tileObject using mapbox tile
    outdoorTile = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
    });
  
  
      // Define a baseMaps object to hold our base layers
      var baseMaps = {
          "Outdoors": outdoorTile,
      };
  
      var rentalMarkers = [];
      rental.forEach(function(feature) {
        rentalMarkers.push(L.marker([feature.lat, feature.long]).bindPopup(feature.title));
      });
      //console.log(markers);
      var rentalMarkerGroup = L.layerGroup(rentalMarkers);

      
      //console.log(markers);
      var crimeMarkerGroup = L.layerGroup([]);




      // Create a new map
      map = L.map("map-id", {
        //center : [39.8283, -98.5795],
        center: [43.65, -79.36],
        zoom : 15,
        layers: [outdoorTile, rentalMarkerGroup, crimeMarkerGroup]
      });
      var overlay = {
        "rental": rentalMarkerGroup,
        "crime": crimeMarkerGroup
      };

      //Draw circle when clicked
      rentalMarkerGroup.getLayers().forEach(function(obj) {
        
        obj.on('click', function(e) {
          // marker clicked is e.target
          //print to console
          console.log("Here");
          sidebar.open('rentalListing',0);


          
          // remove active circle if any
          if(activeCircle) {
            map.removeLayer(activeCircle);
          }
          // draw a 10km circle with the same center as the marker 
          activeCircle = L.circle(e.target.getLatLng(), { radius: radius , color: "#ff0000" }).addTo(map);
          console.log(activeCircle.getRadius())
          //console.log(crime.length);
          r = activeCircle.getRadius(); //in meters
          circleCenterPoint = activeCircle.getLatLng(); //gets the circle's center latlng
          if(crimeMarkerGroup) {
            map.removeLayer(crimeMarkerGroup);
          }
          crimeMarkers = []
          for (var i = 0; i < crime.length; i++) {
            isInCircleRadius = Math.abs(circleCenterPoint.distanceTo([crime[i].lat, crime[i].long])) <= r;
            // add marker only if the point is within the area
            if (isInCircleRadius) {
              crimeMarkers .push(L.circle([crime[i].lat, crime[i].long], {
                radius: 50
              }).bindPopup(crime[i].MCI));
            }
            crimeMarkerGroup = L.layerGroup(crimeMarkers).addTo(map);
          }

        });

        // if (obj instanceof L.Marker) { // test if the object is a marker
        //     // get the position of the marker with getLatLng
        //     // and draw a circle at that position
    
        //     L.circle(obj.getLatLng(), radius, {
        //         color: 'blue',
        //         fillColor: 'blue'
        //     }).addTo(map);
        // }
    });

      // Create a layer control containing our baseMaps
      L.control.layers(baseMaps, overlay, {
        collapsed: true
      }).addTo(map);

      //sidebar
var sidebar = L.control.sidebar('sidebar').addTo(map);
      



};

d3.csv('static/data/Rental_Craigslist.csv', function(rental){

  d3.csv('static/data/Crime.csv', function(fullcrime){

  //var murder = fullcrime.filter(d=> d.MCI=="Homicide");
  //console.log(murder);
  CreateMap(rental);

      
});
});





