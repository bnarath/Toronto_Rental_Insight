//define global variables


var avgIncomePerFSA;
var avgCrimePerFSA;
var avgAgePerFSA;
var FSA;
var NumRoom;
var avgRentPerNumRoom=[];
//var baseUrl="https://sogramemon.github.io/plotly-javascript-challenge/data/";
var baseUrl= "http://127.0.0.1:5000/";
function init(){
    //get unique FSA
    //use available rentals url
    
    
    var avgIncome= "fsaIncomeAge";
    var dataPromiseIncome= d3.json((baseUrl+avgIncome),function(data){
        //get data for fsa and income
        dataM = data.filter(d =>d.FSA.substring(0,1)=="M");
        FSA =  dataM.map(d => d.FSA).reverse();
        console.log(FSA);
        avgIncomePerFSA= dataM.map(d => d.avg_income).reverse();
        avgAgePerFSA= dataM.map(d => d.Avg_Age).reverse();
        //create dataChart for bar chart
        var dataChart= [{
            y:FSA,
            x:avgIncomePerFSA,
            orientation: 'h',
            type:"bar",
            
            //text: avgIncomePerFSA
        }];
        var layout={autosize: false,
            width: 450,
            height: 1000, 
            title: "Average Income Per FSA",
            yaxis:{title: "FSA"},
            xaxis:{title: "Avg Income"}
        };
        var config = {responsive: true}
        //plot bar chart for income
        Plotly.newPlot("bar_rentAvgIncome", dataChart, layout, config);
        //create dataChart for bar chart for age
        dataChart= [{
            y:FSA,
            x:avgAgePerFSA,
            orientation: 'h',
            type:"bar",
            
            //text: avgAgePerFSA
        }];
        layout={autosize: false,
            width: 450,
            height: 1000, 
            title: "Average Age Per FSA",
            yaxis:{title: "FSA"},
            xaxis:{title: "Avg Age"}
        };
        config = {responsive: true}
        //plot bar chart for Avg Age
        Plotly.newPlot("bar_rentAvgAge", dataChart, layout, config);
        // //avg rent vs num bedrooms
        // var availableRentalUrl= "availableRental";
        // var dataPromiseIncome= d3.json((baseUrl+availableRentalUrl),function(data){
        //     //dataFiltered= data.filter(d => d.FSA==selectedFSA);
        //     //console.log(dataFiltered.map(d => d.FSA));
        //     NumRoom = data.map(d => d.bedrooms);
        //     var numRoomUnique= NumRoom.filter((item, i, ar) => ar.indexOf(item) === i);
        //     numRoomUnique.forEach(n => {
        //         var priceFilteredData= data.filter(d => d.bedrooms==n);
        //         var total=0;
        //         for(var i in priceFilteredData) { total += priceFilteredData[i].price; }
        //         avgRentPerNumRoom.push(total/priceFilteredData.length);
        //         //console.log(avgRentPerNumRoom);
        //     })
        //     //plot bar chart
        //     //create dataChart for bar chart
        //     var dataChart= [{
        //         y:avgRentPerNumRoom,
        //         x:numRoomUnique,
        //         //orientation: 'h',
        //         type:"bar",
                
        //         //text: avgIncomePerFSA
        //     }];
        //     var layout={autosize: false,
        //         width: 400,
        //         height: 300, 
        //         title: `Average Rent vs Number of Rooms for FSA: `,
        //         yaxis:{title: "Avg Rent"},
        //         xaxis:{title: "Number of Rooms"},
        //         font: {
        //             size: 11
        //           }
        //     };
        //     var config = {responsive: true}
        //     //plot bar chart for income
        //     Plotly.newPlot("bar_rentAvgRentPerRoomNum", dataChart, layout, config);
            
        //});
        //select dropdown menu for rental 
        var dropDown= d3.select("#fsa_rent")
        dropDown.append("option").text("All FSA");
        //give the dropdow id values
        FSA.reverse().forEach(element => {
            dropDown.append("option").text(element);
        });
        //select dropdown menu for crime 
        var dropDown= d3.select("#fsa_crime")
        dropDown.append("option").text("All FSA");
        //give the dropdow id values
        FSA.forEach(element => {
            dropDown.append("option").text(element);
        });
    });
    // var crimeUrl= "crimeLastSixMonths.json";
    // //get crime data 
    // var dataPromiseCrime = d3.json((baseUrl+crimeUrl), function(data){
    //     console.log(data[0]);
    // });
        
    //     //create data for bubble chart
    //     var data=[{
    //         x: otuIds[0], //Use `otu_ids` for the x values.
    //         y: sampleValues[0], //Use `sample_values` for the y values.
    //         mode: "markers",
    //         marker:{
    //             size: sampleValues[0], //Use `sample_values` for the marker size.
    //             color: otuIds[0] //Use `otu_ids` for the marker colors.
    //         },
    //         text: otuLabels[0] //Use `otu_labels` for the text values
    //     }];
    //     var layout={width: 400, height: 800, title: "Crime Rate in ${FSA}",
    //         xaxis:{title: "OTU ID"},
    //         yaxis:{title: "Values"}
    //     };
    //     //Plot intial Bubble chart
    //     Plotly.newPlot("bubble_crime", data, layout); 
    //     //get metadata 
    //     var ethnicity= metadata[0]["ethnicity"];
    //     var gender= metadata[0]["gender"];
    //     var age= metadata[0]["age"];
    //     var location= metadata[0]["location"];
    //     var bbtype= metadata[0]["bbtype"];
    //     var wfreq= metadata[0]["wfreq"];
    //     //add metadata to html
    //     metadataHtml =d3.select("#sample-metadata");
    //     metadataHtml.append("p").text("Id: "+otuPersonId[0]);
    //     metadataHtml.append("p").text("Ethnicity: "+ethnicity);
    //     metadataHtml.append("p").text("Gender: "+gender);
    //     metadataHtml.append("p").text("Age: "+age);
    //     metadataHtml.append("p").text("Location: "+location);
    //     metadataHtml.append("p").text("bbtype: "+bbtype);
    //     metadataHtml.append("p").text("wfreq: "+wfreq);
        // //gauge chart
        // var data = [
        //     {
        //         domain: { x: [0, 1], y: [0, 1] },
        //         value: wfreq,
        //         title: { text: "Belly Button Wash Frequency" },
        //         gauge: {
        //             axis: { range: [null, 9] },
        //             steps: [
        //               { range: [0, 1], color: "red" },
        //               { range: [1, 2], color: "red" },
        //               { range: [2, 3], color: "orange" },
        //               { range: [3, 4], color: "orange" },
        //               { range: [4, 5], color: "lightgreen" },
        //               { range: [5, 6], color: "lightgreen" },
        //               { range: [6, 7], color: "green" },
        //               { range: [7, 8], color: "darkgreen" },
        //               { range: [8, 9], color: "darkgreen" }
        //             ]},
        //         type: "indicator",
        //         mode: "gauge+number"
        //     }
        // ];
        
        // var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        // Plotly.newPlot('gauge', data, layout);

        
    //});
    
    
}

init();
//select dropdown for rentalTrends
d3.select("#fsa_rent").on("change", function(){
    var i= this.selectedIndex;
    console.log(FSA[i-1]);
    updateRentFSA(FSA[i-1]);
});

function updateRentFSA(selectedFSA){
    //plot avg rent per number of rooms in selectedFSA
    //get data from selected FSA
    var availableRentalUrl= "availableRental";
    var dataPromiseIncome= d3.json((baseUrl+availableRentalUrl),function(data){
        dataFiltered= data.filter(d => d.FSA==selectedFSA);
        console.log(dataFiltered.map(d => d.FSA));
        NumRoom = dataFiltered.map(d => d.bedrooms);
        var numRoomUnique= NumRoom.filter((item, i, ar) => ar.indexOf(item) === i);
        numRoomUnique.forEach(n => {
            var priceFilteredData= dataFiltered.filter(d => d.bedrooms==n);
            var total=0;
            for(var i in priceFilteredData) { total += priceFilteredData[i].price; }
            avgRentPerNumRoom.push(total/priceFilteredData.length);
            //console.log(avgRentPerNumRoom);
        })
        //plot bar chart
        //create dataChart for bar chart
        //var x=numRoomUnique;
        //var y=avgRentPerNumRoom;
        var dataChart= [{
            y:avgRentPerNumRoom,
            x:numRoomUnique,
            //orientation: 'h',
            type:"bar",
            
            //text: avgIncomePerFSA
        }];
        var layout={autosize: false,
            width: 400,
            height: 300, 
            title: `Average Rent vs Number of Rooms for FSA: ${selectedFSA}`,
            yaxis:{title: "Avg Rent"},
            xaxis:{title: "Number of Rooms"},
            font: {
                size: 11
              }
        };
        var config = {responsive: true}
        //plot bar chart for avg rent
        Plotly.newPlot("bar_rentAvgRentPerRoomNum", dataChart, layout, config);
        //Plotly.restyle("bar_rentAvgRentPerRoomNum", x,[x]);
        //Plotly.restyle("bar_rentAvgRentPerRoomNum", y,[y]);
        
    });


}
//select dropdown and add event that updates the bar graph
// d3.select("#fsa_crime").on("change", function(){
//     var i= this.selectedIndex;
//     //update bar chart
//     var y= objectList[i]["sampleValues"].slice(0,10).reverse();
//     var x= objectList[i]["otuIds"].slice(0,10).reverse().map(sample => "OTU ".concat(sample));
//     var text= objectList[i]["otuLabels"].slice(0,10).reverse();
//     Plotly.restyle("bar_crime", "x", [x]);
//     Plotly.restyle("bar_crime", "y", [y]);
//     Plotly.restyle("bar", "text", [text]);
//     //update bubble chart
//     x= otuIds[i];
//     y= sampleValues[i];
//     var size= sampleValues[i];
//     var color= otuIds[i];
//     text= otuLabels[i];
//     Plotly.restyle("bubble", "x", [x]);
//     Plotly.restyle("bubble", "y", [y]);
//     Plotly.restyle("bubble", "size", [size]);
//     Plotly.restyle("bubble", "color", [color]);
//     Plotly.restyle("bubble", "text", [text]);
    // //update demographics data
    // //get metadata 
    // var ethnicity= metadata[i]["ethnicity"];
    // var gender= metadata[i]["gender"];
    // var age= metadata[i]["age"];
    // var location= metadata[i]["location"];
    // var bbtype= metadata[i]["bbtype"];
    // var wfreq= metadata[i]["wfreq"];
    // //add metadata to html
    // metadataHtml =d3.select("#sample-metadata");
    // metadataHtml.html("");
    // metadataHtml.append("p").text("Id: "+otuPersonId[i]);
    // metadataHtml.append("p").text("Ethnicity: "+ethnicity);
    // metadataHtml.append("p").text("Gender: "+gender);
    // metadataHtml.append("p").text("Age: "+age);
    // metadataHtml.append("p").text("Location: "+location);
    // metadataHtml.append("p").text("bbtype: "+bbtype);
    // metadataHtml.append("p").text("wfreq: "+wfreq);
    // //update gauge chart
    // Plotly.restyle('gauge', "value", wfreq);

//});
//select dropdown and add event that updates the bar graph
// d3.select("#fsa_rent").on("change", function(){
//     var i= this.selectedIndex;
//     //update bar chart
//     var y= objectList[i]["sampleValues"].slice(0,10).reverse();
//     var x= objectList[i]["otuIds"].slice(0,10).reverse().map(sample => "OTU ".concat(sample));
//     var text= objectList[i]["otuLabels"].slice(0,10).reverse();
//     Plotly.restyle("bar_rent", "x", [x]);
//     Plotly.restyle("bar_rent", "y", [y]);
//     Plotly.restyle("bar_rent", "text", [text]);
// });
