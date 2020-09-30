var communityUrl= "communityAssets";
function displayRentalListing(data, title){
    //console.log(data);
    var dataPromiseRentalListing= d3.json((baseUrl+availableRentalUrl), function(rental){
        rental.forEach(element => {
            if((element.lat == data.lat) && (element.long == data.lng) && (element.title == title)){
                //console.log(element);
                //bind data onto sidebar
                if(element.image != null){
                d3.select("#rentalListingImg").attr("src", element.image);}
                //clear previous
                d3.selectAll("#rentalInfo").html("");
                for (const [key, value] of Object.entries(element)) {
                    console.log(`${key}: ${value}`);
                    d3.selectAll("#rentalInfo").append("p").text(`${key}: ${value}`);
                  }
            }
            
        });
        //console.log(rental[0]);
        
    })

}
function displayCommunityListing(agencyName, category, lat, long){
    //console.log(data);
    var dataPromiseRentalListing= d3.json((baseUrl+communityUrl+"?category="+category), function(asset){
        asset.forEach(element => {
             if((element.latitude == lat) && (element.longitude == long) && (element.agency_name == agencyName)){
                //console.log(element.url);
                //bind data onto sidebar
                
            
                //clear previous
                d3.selectAll("#communityInfo").html("");
                for (const [key, value] of Object.entries(element)) {
                    console.log(`${key}: ${value}`);
                    d3.selectAll("#communityInfo").append("p").text(`${key}: ${value}`);
                  }
                }
             
        });
        //console.log(asset[0]);
        //bind data onto sidebar

    });

}

function displayCrime(crimeData){
    console.log(crimeData);
    //prep data for graph
    // var crimeCategory = crimeData.map(d => d.MCI);
    // crimeCategory = crimeCategory.filter((item, i, ar) => ar.indexOf(item) === i);
    // var crimeCount=[];
    // crimeCategory.forEach(data =>{crimeCount});
    // crimeData.forEach(data => {

    // })


}