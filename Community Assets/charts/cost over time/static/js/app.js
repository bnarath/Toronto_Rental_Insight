//setup global variables

var datePosted = [];
var monthDayPosted = []; 
var uniqueDate =[];
var oneBedAvg = [];
var twoBedAvg =[];
var threeorMoreBedAvg =[];
var dates =[];

//create sum function
function average(array){
    var total = 0; 
    var length =0;
    for(var i = 0; i < array.length; i++) { 
      if(array[i] > 0 && array[i] < 15000 ){
        total += array[i];
        length += 1;
      }
      else{};
    };
    var average = total/length;

    return average
};

//create function to initialize dashboard

function init(){
    //read json file into js
    d3.json("data/rentalTrend.json").then(data => {

        //determine dates
        data.forEach(posting=> {
            
        datePosted.push(posting.post_published_date)
            });

        uniqueDate = [...new Set(datePosted)];

        for (var i = 0; i < uniqueDate.length; i++){

            var oneBedroom = [];
            var twoBedroom = [];
            var threeorMoreBedroom = [];

            data.forEach(posting => {

                if(posting.post_published_date == uniqueDate[i]){

                    if (posting.bedrooms == 1){
                        oneBedroom.push(parseInt(posting.price));
                    }
                    else if(posting.bedrooms == 2){
                        twoBedroom.push(parseInt(posting.price));
                    }
                    else if(posting.bedrooms > 2 && posting.bedrooms < 10){
                        threeorMoreBedroom.push(parseInt(posting.price));
                    }
                    else{

                    }
                }
                else{}
            });

            dates.push(uniqueDate[i])
            oneBedAvg.push(parseInt(average(oneBedroom)));
            twoBedAvg.push(parseInt(average(twoBedroom)));
            threeorMoreBedAvg.push(parseInt(average(threeorMoreBedroom)));
        }

        //setup plot

        var trace1 = {
            x: dates,
            y: oneBedAvg,
            mode: 'markers',
            name: 'One Bedroom',
            marker: {
              color: 'rgb(168, 9, 168)',
              size: 12,
              line: {
                color: 'white',
                width: 0.5
              }
            },
            type: 'scatter'
          };
          
          var trace2 = {
            x: dates,
            y: twoBedAvg,
            mode: 'markers',
            name: 'Two Bedroom',
            marker: {
              color: 'rgb(13, 117, 214)',
              size: 12
            },
            type: 'scatter'
          };
          
          var trace3 = {
            x: dates,
            y: threeorMoreBedAvg,
            mode: 'markers',
            name: 'Three or More Bedrooms',
            marker: {
              color: 'rgb(7, 161, 7)',
              size: 12
            },
            type: 'scatter'
          };
       
          var data = [trace1, trace2, trace3];

          //formatting
          var layout = {
            title: 'Average Monthly Cost',
            xaxis: {
              title: 'Date',
              showgrid: false,
              zeroline: false
            },
            yaxis: {
              title: 'Average Cost',
              showline: false
            },legend: {
                x: 0.7,
                y: 1.2
              }

          };

          //plot chart
          Plotly.newPlot('chart', data, layout);
    });
};

init();

