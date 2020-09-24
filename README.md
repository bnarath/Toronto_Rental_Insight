<<<<<<< HEAD
# Toronto Rental Insight App
This project is a continuation of the Toronto_Rental_ETL_Project. The Toronto_Rental_ETL_Project scraped, cleaned, transformed and stored data from multiple data sources and made it available for use through a Flask API which can be found [here](https://github.com/bnarath/Toronto_Rental_ETL_Project/blob/master/README.md). This project aims to further automate the task of acquiring the data by using a scheduler that will scrape the data sources on a daily bases and update the database. This project also aims to make this data available to users for exploration through the creation of a user friendly, interactive dashboard.  

#### -- Project Status: Active

## Project Intro/Objective
The purpose of this project is to help users find a rental property that fits within their budget as well as other requirements such as being located in a crime free neighborhood and is in close proximity to community services such as schools and healthcare centers.

### Data Sources
* Toronto Rental Data - [Craigslist](https://toronto.craigslist.org/search/hhh), [Kijiji](https://www.kijiji.ca/)
* Crime Data - [Toronto Police Services Open Data](https://data.torontopolice.on.ca/pages/catalogue)
* Community Services Data - [Toronto Public Services](https://torontops.maps.arcgis.com/home/item.html?)
* Income Data - [Canada Revenue Agency](https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/income-statistics-gst-hst-statistics/individual-tax-statistics-fsa/individual-tax-statistics-fsa-2017-edition-2015-tax-year.html#toc9)

### Methods Used
* Data Visualization
* Data Modeling 
* Cloud Computing

### Technologies
* Python
* D3
* Leaflet
* MongoDB
* HTML
* JavaScript
* CSS
* BootStrap
* BeautifulSoap

## Project Architecture

<img src="Design_Documents/Architecture.png" alt="Architecture" width="1000"/>

**Architecture consists of `full stack` - `Front End`, `Backend` and `ETL`**

### ETL
- **Extract:** Extracts the data from `Kijiji, Craigslist, Toronto Police Services(TPS),  Canada Revenue Agency (CRA), and Stats Canada` using `Scraping, API services.`

- **Transform:** Transformation of data through `various python packages` including pandas and numpy.

- **Load:** Loads the data to the `cloud MongoDB(Atlas) database.` ETL is separate from the cloud application. Serves as a separate functionality to extract, transform and preload the database. 

### BackEnd
Backend consists of a `Flask Core engine` which has `4 core components`.
- **Scraper:** 
Crawls the Rental Data from Craigslist
- **Scheduler:** 
Schedules scraping every day at 12 AM EDT
- **Differencer:**
  - Updates the daily and historical rental DB Tables. 
  - Marks the rental postings unavailable once taken off
- **API endpoints:** Hosts the API endpoints

### FrontEnd
FrontEnd Consists of the `HTML/CSS/Javascript stack`. Javscript retrieves the data from the APIs hosted by Flask based on user's selection 


## Frontend Wireframes 

The dashboard will consist of map and a sidebar. 

### Map
=======
# Toronto_Rental_Insight
Toronto Rental Insight

# Project Description

We are creating a tool to explore Toronto's rental market. 

(Provide more detailed overview of the project. Talk a bit about your data sources and what questions and hypothesis you are exploring. What specific data analysis/visualization and modelling work are you using to solve the problem? What blockers and challenges are you facing? Feel free to number or bullet point things here)

# Visual Design of Dashboard

The dashboard will consist of map and a sidebar. 

Map
>>>>>>> 47ff1cf743f04bb0ae9e8145ca46014ad1a49c24

The leaflet library will be used to display a map of Toronto with FSA boundaries outlined. By default, the map will show markers for the daily rental postings. The map will include a toggle bar that will enable users to add/remove markers for:
* Rental postings
* Community assets
* Crime incidence (past 6 months).   

The map will included the following functionalities:
* tooltip when hovering over markers
* Upon clicking on a rental posting marker, a circle will show a 1 km radius around the marker. Other markers will appear within that circle's radius showing crime incidences that occurred in the past 6 months. 


<<<<<<< HEAD
### Sidebar
=======
Sidebar
>>>>>>> 47ff1cf743f04bb0ae9e8145ca46014ad1a49c24

By default/opening dashboard, the side bar will contain dropdown menus that enable users to filter the rental posting markers display by:
* FSA
* Rental cost
* Number of bedrooms
* Number of washrooms

<<<<<<< HEAD
<img src="Images/filter.png" alt="Headline" width="1000"/>

=======
>>>>>>> 47ff1cf743f04bb0ae9e8145ca46014ad1a49c24
A filter button at the top of the sidebar will enable users to toggle back to this view. 

Otherwise, there will be three versions of the sidebar based on how users interact with the map.

<<<<<<< HEAD
#### Click on Rental Posting Marker
=======
Click on Rental Posting Marker
>>>>>>> 47ff1cf743f04bb0ae9e8145ca46014ad1a49c24
* Rental posting details
* Bar chart of average income with FSA compared to Toronto overall
* Heat map of Toronto showing crime incidence

<<<<<<< HEAD
<img src="Images/rental.png" alt="Headline" width="1000"/>

#### Click on Community Asset Marker
* Community Asset information 
<img src="Images/community.png" alt="Headline" width="1000"/>

#### Click on FSA
=======
Click on Community Asset Marker
* Community Asset information 

Click on FSA
>>>>>>> 47ff1cf743f04bb0ae9e8145ca46014ad1a49c24

The sidebar will have buttons to toggle views between crime data and rental posting data.

Rental posting data
* bar graph displaying average cost to rent in FSA (data scrapped that day) by number of bedrooms.
* line graph displaying average to rent in FSA over time (historical/trending data) by number of bedrooms.

<<<<<<< HEAD
<img src="Images/rental_fsa.png" alt="Headline" width="1000"/>

=======
>>>>>>> 47ff1cf743f04bb0ae9e8145ca46014ad1a49c24
Crime data
* bar graph displaying average cost to rent in FSA (data scrapped that day) by number of bedrooms.
* line graph displaying average to rent in FSA over time (historical/trending data) by number of bedrooms.

<<<<<<< HEAD
<img src="Images/crime.png" alt="Headline" width="1000"/>


## Needs of this project

- User Experience 
- data exploration
- data processing/cleaning
- statistical modeling
- Dashboard Building
=======

>>>>>>> 47ff1cf743f04bb0ae9e8145ca46014ad1a49c24
