//var communityUrl= "communityAssets";
function displayRentalListing(data, title){
    //console.log(data);
    var dataPromiseRentalListing= d3.json((baseUrl+availableRentalUrl), function(rental){
        rental.forEach(element => {
            if((element.lat == data.lat) && (element.long == data.lng) && (element.title == title)){
                //console.log(element);
                //bind data onto sidebar
                if(element.image != null){
                d3.select("#rentalListingImg").attr("src", element.image);
                }
                //clear previous
                var furnished = "No";
                var petFriendly = "No";
                if(element.furnished){
                    furnished="Yes"
                }
                if(element.pet_friendly){
                    petFriendly="Yes"
                }
                
                d3.selectAll("#rentalInfo").html("");
                //console.log(element.price);
                d3.selectAll("#rentalInfo").append("h3").text(element.title).classed('card-title', true);
                d3.selectAll("#rentalInfo").append("p").text(" ").classed('card-text', true);
                d3.selectAll("#rentalInfo").append("p").text(`Price: $ ${element.price}`).classed('card-text', true);
                d3.selectAll("#rentalInfo").append("p").text(`Furnished: ${furnished}`).classed('card-text', true);
                d3.selectAll("#rentalInfo").append("p").text(`Pet Friendly: ${petFriendly}`).classed('card-text', true);
                
                d3.selectAll("#rentalInfo").append("p").text(`Rental Type: ${element.rental_type}`).classed('card-text', true);
                d3.selectAll("#rentalInfo").select("p").html(`Source: <a target="_blank" href="${element.url}">${element.source}</a>`).classed('card-text', true);
                //d3.selectAll("#rentalInfo").append("p").text(`More Information: ${element.url}`);
                d3.selectAll("#rentalInfo").append("p").text(`Postal Code: ${element.postal_code}`).classed('card-text', true);
                d3.selectAll("#rentalInfo").append("p").text(`Publised On: ${element.post_published_date}`).classed('card-text', true);
                d3.selectAll("#rentalInfo").append("p").text(`Description: ${element.description}`).classed('card-text', true);
                d3.selectAll("#rentalInfo").append("p").text(` `).classed('card-text', true);
                // for (const [key, value] of Object.entries(element)) {
                //     //console.log(`${key}: ${value}`);
                //     d3.selectAll("#rentalInfo").append("p").text(`${key}: ${value}`);
            
                //   }
            
            }
            
        });
        //console.log(rental[0]);
        
    })

}
function displayCommunityListing(element){
    //console.log(data);
    // var dataPromiseRentalListing= d3.json((baseUrl+communityUrl+"?category="+category), function(asset){
    //     asset.forEach(element => {
    //          if((element.latitude == lat) && (element.longitude == long) && (element.agency_name == agencyName)){
                //console.log(element.url);
                //bind data onto sidebar
                
            
                //clear previous
    d3.selectAll("#communityInfo").html("");
                    // for (const [key, value] of Object.entries(element)) {
                    //     console.log(`${key}: ${value}`);
                    //     d3.selectAll("#communityInfo").append("p").text(`${key}: ${value}`);
                    //   }
                    
    d3.selectAll("#communityInfo").append("h3").text(element.target.options.agency_name).classed('card-title', true);
    //console.log(element.target.options.website);
    
    d3.selectAll("#communityInfo").append("p").text(" ").classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Address: $ ${element.target.options.address}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Category: ${element.target.options.category}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Crisis Phone No: ${element.target.options.office_phone}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Office Phone No: ${element.target.options.crisis_phone}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Toll Free Phone No: ${element.target.options.toll_free_phone}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Email: ${element.target.options.e_mail}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Fees: ${element.target.options.fees}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Service Name: ${element.target.options.service_name}`).classed('card-text', true);
    //create url
    if(element.target.options.website.substring(0,4)!="http"){
        var website= "http://"+element.target.options.website;
    }
    else{
        var website= element.target.options.website;
    }
    
    
    d3.selectAll("#communityInfo").select("p").html(`More Information: <a  href=${website} target="_blank">Website</a>`).classed('card-text', true);
    //console.log(`More Information: <a  href="${element.target.options.website}" target="_blank">Website</a>`);
    
    //d3.selectAll("#rentalInfo").append("p").text(`More Information: ${element.url}`);
    d3.selectAll("#communityInfo").append("p").text(`Hours: ${element.target.options.hours}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Service Description: ${element.target.options.service_description}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(`Service Eligibility: ${element.target.options.eligibility}`).classed('card-text', true);
    d3.selectAll("#communityInfo").append("p").text(` `).classed('card-text', true);
                
                //}
             
        //});
        

    //});

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