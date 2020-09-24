function createMap (holder1, holder2, holder3, holder4, holder5, holder6, holder7, rental) {

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
      FSA: FSA,
      "community Services" : holder1,
      "Education & Employment": holder2,
      "Financial Services" : holder3,
      "Food & Housing" : holder4,
      "Health Services" : holder5,
      "Law & Government": holder6,
      "Tranportation" : holder7, 
      "Rental Postings" : rental
    };

  // create tile layer
  var streetview = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          tileSize: 512,
          maxZoom: 20,
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

  // Pass map layers into layer control and add the layer control to the map
  L.control.layers(null, overlayMaps, {collapsed:false}).addTo(TorontoMap);
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

          //create rental and crime postings
          d3.csv('static/data/Rental_Craigslist.csv', function(rental){

              //rental posting layer
              var rentalMarkers = [];

              rental.forEach(function(feature) {
                rentalMarkers.push(L.marker([feature.lat, feature.long]).bindPopup(feature.title));
              });

              var rentalMarkerGroup = L.layerGroup(rentalMarkers);

            createMap(servicesAsset, educationAsset, 
              financialAsset, foodAsset, 
              healthAsset, lawAsset, transportAsset, rentalMarkerGroup);
          
          });
    });


};

ReadLayersDisplay ();



//function for styling polygons
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
        return "grey";
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
      radius: 50
      });

    marker.bindTooltip(`<h2> ${agencyName}</h2>`);
    
    // Add the marker to array
    array.addLayer(marker);

    return array
};