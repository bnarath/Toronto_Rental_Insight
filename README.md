# Toronto_Rental_Insight
Toronto Rental Insight

## Architecture consists of full stack - Front End, Backend and ETL

### ETL
#### Extract: Extracts the data from Kijiji, Craigslist, Toronto Police Services(TPS),  Canada Revenue Agency (CRA), and Stats Canada using Scraping, API services.

#### Transform: Transformation of data through various python packages.Load: Loads the data to the cloud MongoDB(Atlas) database.ETL is separate from the cloud application. Serves as a separate functionality to extract, transform and preload the database. 

### BackEnd
Backend consists of a Flask Core engine which has 4 core components.
#### Scraper: 
Crawls the Rental Data from Craigslist
#### Scheduler: 
Schedules scraping every day at 12 AM EDT
#### Differencer:
Updates the daily and historical rental DB Tables. 
Marks the rental postings unavailable once taken offAPI endpoints: Hosts the API endpoints

### FrontEnd
FrontEnd Consists of the HTML/CSS/Javascript stack. Javscript retrieves the data from the APIs hosted by Flask based on user's selection 

