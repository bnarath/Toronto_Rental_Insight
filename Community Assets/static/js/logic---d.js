var holder = "";

function style(feature) {

  var Path = '../data/fsaIncomeAge.json';

  d3.json(Path, function(data) {

          data.forEach(d =>{

            

          if(d.FSA == feature.properties.CFSAUID){
            holder = d.FSA;

            
          }
        });
       
  });

  

  console.log(holder)
  if (holder == "M6R") {
      return {
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.3,
          fillColor: '#ff0000'
      };
  } else {
      return {
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.3,
          fillColor: '#666666'
      };
    };
}
function createMap (/*assetArray, rental, crime, data*/) { //}, incomeChloropleuth) {

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

  var incomeChloropleuth = new L.LayerGroup();

  var holderIncomeAvg;

  d3.json(FSApath, function(data) {

      L.geoJSON(data, {
        style: style



        //   

        //   var value = feature.properties.CFSAUID

        //   console.log(value)

        //   d3.json(Path, function(data) {

        //       data.forEach(d =>{

        //       if(d.FSA == value){
              
        //       holderIncomeAvg = parseInt(d.avg_income) 

        //         if(holderIncomeAvg >= 20000 && holderIncomeAvg < 30000){
        //           console.log("20-30")
        //           return {color: null, fillColor: "#7A34AE"}
        //         }
        //         else if(holderIncomeAvg >= 30000 && holderIncomeAvg < 40000){
        //           console.log("30-40")
        //           return {color: "#7A34AE"}
        //         }
        //         else if(holderIncomeAvg >= 40000 && holderIncomeAvg < 50000){
        //           console.log("40-50")
        //           return {color: "#7A34AE"}
        //           }
        //         else if(holderIncomeAvg >= 50000 && holderIncomeAvg < 60000){
        //           console.log("50-60")
        //           return {color: "#7A34AE"}
        //         }
        //         else if(holderIncomeAvg >= 60000 && holderIncomeAvg < 70000){
        //           console.log("60-70")
        //           return  {color: "#7A34AE"}
        //         }
        //         else if(holderIncomeAvg >= 70000){
        //           console.log(">70")
        //           return  {color: "#7A34AE"}
        //         }
        //         else{
        //           console.log("error")
        //           return null;
        //         };
        //       }          
        //   else{};

        // });
        // });
        // }
            }).addTo(incomeChloropleuth)
          });

    // Create an overlayMaps object to hold the community asset layer
  var overlayMaps = {
      //"Average Income" : incomeChloropleuth,
      // "Community Services" : assetArray[0],
      // "Education & Employment": assetArray[1],
      // "Financial Services" : assetArray[2],
      // "Food & Housing" : assetArray[3],
      // "Health Services" : assetArray[4],
      // "Law & Government": assetArray[5],
      // "Tranportation" : assetArray[6]
    };

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
          // "Rental Postings" : rental,
          // "2019 Homicides" : crime
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
    layers : [streetview, FSA, incomeChloropleuth /*rental*/]
  });

  //set limits on zoom
  TorontoMap.options.maxZoom = 20;

  TorontoMap.options.minZoom = 12;

  // Pass map layers into layer control and add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {collapsed:true}).addTo(TorontoMap);

  mapLegend(TorontoMap)

  //RentalCrimeInteraction(rental, data, TorontoMap)

};

function ReadLayersDisplay () {

    //create community asset layers

    var communityAssetpath = "static/js/community_assets_with_cooridnates.csv";

  var servicesAsset = new L.LayerGroup();
  var healthAsset = new L.LayerGroup();
  var foodAsset = new L.LayerGroup();
  var transportAsset = new L.LayerGroup();
  var lawAsset = new L.LayerGroup();
  var educationAsset = new L.LayerGroup();
  var financialAsset = new L.LayerGroup();

  // d3.csv(communityAssetpath, function(data){
      
  //     data.forEach(row=> {

  //       var lat = parseFloat(row.latitude).toFixed(10);
  //       var long = parseFloat(row.longitude).toFixed(10);
  //       var category = row.category;
  //       var agencyName = row.agency_name;
    
  //       if (row.category == "Community Services") {
  //         markerAllocation(agencyName, category, lat, long, servicesAsset)
  //       }
  //       else if (row.category == "Education & Employment") {
  //         markerAllocation(agencyName,category, lat, long, educationAsset)
  //       }
  //       else if (row.category == "Financial Services") {
  //         markerAllocation(agencyName, category, lat, long, financialAsset)
  //       }
  //       else if (row.category == "Food & Housing") {
  //         markerAllocation(agencyName, category, lat, long, foodAsset)
  //       }
  //       else if (row.category == "Health Services") {
  //         markerAllocation(agencyName, category, lat, long, healthAsset)
  //       }
  //       else if (row.category == "Law & Government") {
  //         markerAllocation(agencyName, category, lat, long, lawAsset)
  //       }
  //       else if (row.category == "Transportation") {
  //         markerAllocation(agencyName, category, lat, long, transportAsset)
  //       }
  //       else {
  //       }
  //   });

  //   var assetArray = [servicesAsset, educationAsset, 
  //                     financialAsset, foodAsset, 
  //                     healthAsset, lawAsset, transportAsset]


  //    //create FSA choropleuth from income data

  //   var averageIncome = [];
        
  //   // create array of average income and FSA
  //   d3.csv('static/js/Toronto_FSA.csv', function(incomeData){
        
  //     incomeData.forEach(row =>{
        
  //       var FSA = row.FSA;
  //       var avg = row.Average_Income;
          
  //       averageIncome.push( {FSA : FSA, avgIncome : avg})
  //     });
  //   });

  //         //read rental posting dataset
  //         d3.csv('static/js/Rental_Craigslist.csv', function(rental){

  //             //create rental posting layer
  //             var rentalMarkers = [];

  //             rental.forEach(function(feature) {

  //               var rental = L.ExtraMarkers.icon({
  //                 markerColor: "green-light",
  //                 svg: true,
  //                 number: rentalText(feature.bedrooms),
  //                 shape: 'circle',
  //                 iconColor: "white",
  //                 icon: 'fa-number'
  //               });

  //               rentalMarkers.push(L.marker([feature.lat, feature.long], {
  //                 icon: rental
  //               }).bindPopup(feature.title));
  //             });

  //             var rentalMarkerGroup = L.layerGroup(rentalMarkers);
              
  //             var CrimeMarkers = [];

  //             //read crime dataset
  //             d3.csv('static/js/Crime.csv', function(fullcrime){

  //               var crimeIcon = L.ExtraMarkers.icon({
  //                 icon: "ion-alert",
  //                 iconColor: "white",
  //                 markerColor: "blue",
  //                 shape: "penta"
  //               });

  //               var murder = fullcrime.filter(d=>d.MCI=="Homicide");

  //               //create markers 
  //               murder.forEach(row => {
  //                 CrimeMarkers.push(L.marker([row.lat, row.long],{
  //                   icon: crimeIcon
  //                 }).bindPopup(row.MCI));
                
  //               });
                
  //               //create layer
  //               var CrimeMarkerGroup = L.layerGroup(CrimeMarkers);

                // //create income level layer
                
                // var incomeMarkers = [];

                // var FSAPath = "..data/Toronto2.geojson";

                // var incomeMarkersgroup = new L.LayerGroup();

                // d3.json(FSApath, function(data) {

                //   L.geoJSON(data, {
                //     fillColor: incomeColors(properties.CFSAUID),
                //     color: "grey",
                //     fillOpacity: 0
                //     }).addTo(incomeMarkerGroup)

                //     });
                   
                createMap()/*assetArray, rentalMarkerGroup, CrimeMarkerGroup, fullcrime)*/ //, incomeMarkerGroup);
                
              
          // });
      //  });

      // });
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

  var holderIncomeAvg;

//income choropleuth color function 

function incomeColors(feature){

  var Path = '../data/fsaIncomeAge.json';

  var value = feature.properties.CFSAUID

  // console.log(feature)

  d3.json(Path, function(data) {

      data.forEach(d =>{

      if(d.FSA == value){
      
      holderIncomeAvg = parseInt(d.avg_income) 

        if(holderIncomeAvg >= 20000 && holderIncomeAvg < 30000){
          console.log("20-30")
          return {color: null, fillColor: "#7A34AE"}
        }
        else if(holderIncomeAvg >= 30000 && holderIncomeAvg < 40000){
          console.log("30-40")
          return {color: "#7A34AE"}
        }
        else if(holderIncomeAvg >= 40000 && holderIncomeAvg < 50000){
          console.log("40-50")
          return {color: "#7A34AE"}
          }
        else if(holderIncomeAvg >= 50000 && holderIncomeAvg < 60000){
          console.log("50-60")
          return {color: "#7A34AE"}
        }
        else if(holderIncomeAvg >= 60000 && holderIncomeAvg < 70000){
          console.log("60-70")
          return  {color: "#7A34AE"}
        }
        else if(holderIncomeAvg >= 70000){
          console.log(">70")
          return  {color: "#7A34AE"}
        }
        else{
          console.log("error")
          return null;
        };
      }          
  else{};

});
});
};

// if(holderIncomeAvg >= 20000 && holderIncomeAvg <30000){
//   console.log("20-30")
//   return {   
//     // weight: 2,
//     // opacity: 1,
//     // color: 'white',
//     // dashArray: '3',
//     // fillOpacity: 0.3,
//     "#A365D1"}
// }
// else if(holderIncomeAvg >= 30000 && holderIncomeAvg <40000){
//   console.log("30-40")
//   return {   
//     // weight: 2,
//     // opacity: 1,
//     // color: 'white',
//     // dashArray: '3',
//     // fillOpacity: 0.3,
//     "blue"}
// }
// else if(holderIncomeAvg >= 40000 && holderIncomeAvg <50000){
//   console.log("40-50")
//   return {   
//     // weight: 2,
//     // opacity: 1,
//     // color: 'white',
//     // dashArray: '3',
//     // fillOpacity: 0.3,
//    "red"}
// }
// else if(holderIncomeAvg >= 50000 && holderIncomeAvg <60000){
//   console.log("50-60")
//   return {   
//     // weight: 2,
//     // opacity: 1,
//     // color: 'white',
//     // dashArray: '3',
//     // fillOpacity: 0.3,
//     "#7A34AE"}
// }
// else if(holderIncomeAvg >= 60000 && holderIncomeAvg <70000){
//   console.log("60-70")
//   return {   
//     // weight: 2,
//     // opacity: 1,
//     // color: 'white',
//     // dashArray: '3',
//     // fillOpacity: 0.3,
//     "#7A34AE"}
// }
// else if(holderIncomeAvg >= 70000){
//   console.log(">70")
//   return {   
//     // weight: 2,
//     // opacity: 1,
//     // color: 'white',
//     // dashArray: '3',
//     // fillOpacity: 0.3,
//     "#7A34AE"}
// }
// else{
//   console.log("error")
//   return null;
// };