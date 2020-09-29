//define global variables
var avgIncomePerFSA;
var avgCrimePerFSA;
var FSA;

var sampleValues;
var otuIds;
var otuLabels;
var otuPersonId;
var metadata;
var objectList=[];
function init(){
    //initializes default graph
    //read data from samples.json
    //var filepath="../data/samples.json"; //localhost file path
    var filepath="https://sogramemon.github.io/plotly-javascript-challenge/data/samples.json" //using url
    //var filepath="../plotly-javascript-challenge/data/samples.json" //github pages file path
    var dataPromise= d3.json(filepath, function(data) {
        //get the values for the first otu_id
        sampleValues= data.samples.map(sample => sample.sample_values);
        otuIds= data.samples.map(sample => sample.otu_ids);
        otuLabels= data.samples.map(sample => sample.otu_labels);
        otuPersonId= data.samples.map(sample => sample.id);
        metadata=data.metadata
        //sort data
        //populate objectList with a list of objects
        for(var i=0;i<otuIds.length; i++){
            objectList.push({
                "otuIds": otuIds[i],
                "sampleValues": sampleValues[i],
                "otuLabels": otuLabels[i]
            });
        }
        //sort objectList based on sampleValues
        objectList.sort(function(a,b) {return a.sampleValues - b.sampleValues});
        console.log(objectList[0]["otuIds"].slice(0,10));
        //create data for Bar char plotly
        var data=[{
            y: objectList[0]["sampleValues"].slice(0,10).reverse(),
            x: objectList[0]["otuIds"].slice(0,10).reverse().map(sample => "OTU ".concat(sample)), //add str OTU before each OTU_id
            type: "bar",
            //orientation: "h", //horizontal bar
            text: objectList[0]["otuLabels"].slice(0,10).reverse() //hovertext
        }];
        var layout={autosize: false,
            width: 450,
            height: 500, title: "Average Crime Per FSA"};
        //plot graph
        Plotly.newPlot("bar_crime", data, layout);
        //select dropdown menu 
        var dropDown= d3.select("#fsa_crime")
        //give the dropdow id values
        otuPersonId.forEach(element => {
            dropDown.append("option").text(element);
        });
        //sort data
        //populate objectList with a list of objects
        for(var i=0;i<otuIds.length; i++){
            objectList.push({
                "otuIds": otuIds[i],
                "sampleValues": sampleValues[i],
                "otuLabels": otuLabels[i]
            });
        }
        //sort objectList based on sampleValues
        objectList.sort(function(a,b) {return a.sampleValues - b.sampleValues});
        console.log(objectList[0]["otuIds"].slice(0,10));
        //create data for Bar char plotly
        var data=[{
            y: objectList[0]["sampleValues"].slice(0,10).reverse(),
            x: objectList[0]["otuIds"].slice(0,10).reverse().map(sample => "OTU ".concat(sample)), //add str OTU before each OTU_id
            type: "bar",
            //orientation: "h", //horizontal bar
            text: objectList[0]["otuLabels"].slice(0,10).reverse() //hovertext
        }];
        var layout={autosize: false,
            width: 450,
            height: 500,
            title: "Belly Bacteria population"};
        //plot graph
        Plotly.newPlot("bar_rent", data, layout);
        //select dropdown menu 
        var dropDown= d3.select("#fsa_rent")
        //give the dropdow id values
        otuPersonId.forEach(element => {
            dropDown.append("option").text(element);
        });
        //create data for bubble chart
        var data=[{
            x: otuIds[0], //Use `otu_ids` for the x values.
            y: sampleValues[0], //Use `sample_values` for the y values.
            mode: "markers",
            marker:{
                size: sampleValues[0], //Use `sample_values` for the marker size.
                color: otuIds[0] //Use `otu_ids` for the marker colors.
            },
            text: otuLabels[0] //Use `otu_labels` for the text values
        }];
        var layout={width: 400, height: 800, title: "Crime Rate in ${FSA}",
            xaxis:{title: "OTU ID"},
            yaxis:{title: "Values"}
        };
        //Plot intial Bubble chart
        Plotly.newPlot("bubble_crime", data, layout); 
        //get metadata 
        var ethnicity= metadata[0]["ethnicity"];
        var gender= metadata[0]["gender"];
        var age= metadata[0]["age"];
        var location= metadata[0]["location"];
        var bbtype= metadata[0]["bbtype"];
        var wfreq= metadata[0]["wfreq"];
        //add metadata to html
        metadataHtml =d3.select("#sample-metadata");
        metadataHtml.append("p").text("Id: "+otuPersonId[0]);
        metadataHtml.append("p").text("Ethnicity: "+ethnicity);
        metadataHtml.append("p").text("Gender: "+gender);
        metadataHtml.append("p").text("Age: "+age);
        metadataHtml.append("p").text("Location: "+location);
        metadataHtml.append("p").text("bbtype: "+bbtype);
        metadataHtml.append("p").text("wfreq: "+wfreq);
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

        
    });
    
    
}

init();
//select dropdown and add event that updates the bar graph
d3.select("#fsa_crime").on("change", function(){
    var i= this.selectedIndex;
    //update bar chart
    var y= objectList[i]["sampleValues"].slice(0,10).reverse();
    var x= objectList[i]["otuIds"].slice(0,10).reverse().map(sample => "OTU ".concat(sample));
    var text= objectList[i]["otuLabels"].slice(0,10).reverse();
    Plotly.restyle("bar_crime", "x", [x]);
    Plotly.restyle("bar_crime", "y", [y]);
    Plotly.restyle("bar", "text", [text]);
    //update bubble chart
    x= otuIds[i];
    y= sampleValues[i];
    var size= sampleValues[i];
    var color= otuIds[i];
    text= otuLabels[i];
    Plotly.restyle("bubble", "x", [x]);
    Plotly.restyle("bubble", "y", [y]);
    Plotly.restyle("bubble", "size", [size]);
    Plotly.restyle("bubble", "color", [color]);
    Plotly.restyle("bubble", "text", [text]);
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

});
//select dropdown and add event that updates the bar graph
d3.select("#fsa_rent").on("change", function(){
    var i= this.selectedIndex;
    //update bar chart
    var y= objectList[i]["sampleValues"].slice(0,10).reverse();
    var x= objectList[i]["otuIds"].slice(0,10).reverse().map(sample => "OTU ".concat(sample));
    var text= objectList[i]["otuLabels"].slice(0,10).reverse();
    Plotly.restyle("bar_rent", "x", [x]);
    Plotly.restyle("bar_rent", "y", [y]);
    Plotly.restyle("bar_rent", "text", [text]);
});
