var radius = 1000;
var activeCircle = false;
var heatmap;
var heatmapMarker = false;

var r = 0; //in meters
var circleCenterPoint = [0,0]; //gets the circle's center latlng
var isInCircleRadius = false;



function createHeatmap(murder){

  var myMap = L.map("crime-heatmap", {
    center: [43.728754, -79.388561],
    zoom: 9
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 9,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  var url = "http://127.0.0.1:5000/CrimeLastThreeMonths";
  
  d3.json(url, function(response) {
  
    console.log(response);
  
    var heatArray = response.map(d=>[d.lat, d.long]);
  
    // for (var i = 0; i < response.length; i++) {
    //   var location = response[i].location;
  
    //   if (location) {
    //     heatArray.push([location.coordinates[1], location.coordinates[0]]);
    //   }
    // }
  
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
        // center: [43.65, -79.36],
        center: [43.7052, -79.4264],
        zoom : 12,
        doubleClickZoom: false,
        layers: [outdoorTile, rentalMarkerGroup, crimeMarkerGroup]
      }).on('click', function(e){
        // console.log(e.latlng["lat"], e.latlng["lng"]);
        if(activeCircle) {
          if (Math.abs(circleCenterPoint.distanceTo([e.latlng["lat"], e.latlng["lng"]])) > r){
            map.removeLayer(activeCircle);
            map.removeLayer(crimeMarkerGroup);
          };
        }
      });
      var overlay = {
        "rental": rentalMarkerGroup,
        "crime": crimeMarkerGroup
      };

      //Draw circle when clicked
      rentalMarkerGroup.getLayers().forEach(function(obj) {
        
        obj.on('click', function(e) {
          // marker clicked is e.target

          sidebar.open('rentalListing',0);
          if(heatmapMarker){
            heatmap.removeLayer(heatmapMarker);
          }
          heatmapMarker = L.marker(e.target.getLatLng(), {markerColor:'red'}).addTo(heatmap);
          heatmap.setView([43.728754, -79.388561], 9);
          // remove active circle if any
          if(activeCircle) {
            map.removeLayer(activeCircle);
          }
          // draw a 10km circle with the same center as the marker 
          activeCircle = L.circle(e.target.getLatLng(), { radius: radius , color: "#ff0000" }).addTo(map);
          // console.log(activeCircle.getRadius())
          // console.log(crime.length);
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
    });

      // Create a layer control containing our baseMaps
      L.control.layers(baseMaps, overlay, {
        collapsed: true
      }).addTo(map);

      //sidebar
      var sidebar = L.control.sidebar('sidebar').addTo(map);
      
};

d3.json("http://127.0.0.1:5000/availableRental", function(rental){
  d3.json("http://127.0.0.1:5000/CrimeLastThreeMonths", function(fullcrime){

  // var murder = fullcrime.filter(d=>d.MCI=="Homicide");
  var murder = fullcrime
  // console.log(murder);
  heatmap = createHeatmap();
  CreateMap(rental, murder);
  // Plot heatmap

});
});





