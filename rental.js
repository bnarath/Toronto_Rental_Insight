var filePathRentalAvailable="https://sogramemon.github.io/plotly-javascript-challenge/data/sample2.json"
function init(){
    var dataPromise= d3.json(filePathRentalAvailable, function(data) {
        //data.forEach(d => console.log(d))
        console.log(data);
    });

}
var filepath="https://sogramemon.github.io/plotly-javascript-challenge/data/samples.json";
    var dataPromise= d3.json(filepath, function(data) {console.log(data)});

init();

// d3.json('http://localhost:53526/api/foo', function (data) {
//     console.log(data);
// });