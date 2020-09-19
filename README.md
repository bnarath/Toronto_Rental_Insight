# Toronto_Rental_Insight
Toronto Rental Insight

Visual Design of Dashboard

The dashboard will consist of map and a sidebar. 

Map

The leaflet library will be used to display a map of Toronto with FSA boundaries outlined. By default, the map will show markers for the daily rental postings. The map will include a toggle bar that will enable users to add/remove markers for:
* Rental postings
* Community assets
* Crime incidence (past 6 months).   

The map will included the following functionalities:
* tooltip when hovering over markers
* Upon clicking on a rental posting marker, a circle will show a 1 km radius around the marker. Other markers will appear within that circle's radius showing crime incidences that occurred in the past 6 months. 


Sidebar

By default/opening dashboard, the side bar will contain dropdown menus that enable users to filter the rental posting markers display by:
* FSA
* Rental cost
* Number of bedrooms
* Number of washrooms

A filter button at the top of the sidebar will enable users to toggle back to this view. 

Otherwise, there will be three versions of the sidebar based on how users interact with the map.

Click on Rental Posting Marker
* Rental posting details
* Bar chart of average income with FSA compared to Toronto overall
* Heat map of Toronto showing crime incidence

Click on Community Asset Marker
* Community Asset information 

Click on FSA

The sidebar will have buttons to toggle views between crime data and rental posting data.

Rental posting data
* bar graph displaying average cost to rent in FSA (data scrapped that day) by number of bedrooms.
* line graph displaying average to rent in FSA over time (historical/trending data) by number of bedrooms.

Crime data
* bar graph displaying average cost to rent in FSA (data scrapped that day) by number of bedrooms.
* line graph displaying average to rent in FSA over time (historical/trending data) by number of bedrooms.


