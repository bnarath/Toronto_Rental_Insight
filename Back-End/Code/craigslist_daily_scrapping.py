#Dependencies
from craigslist import CraigslistHousing
from pymongo import MongoClient


import requests
from selenium import webdriver
import time
import pandas as pd
import re
from datetime import datetime, timedelta, timezone

from urls_list import * #where all urls and paths are saved
from config import * #keys are saved


#EXTRACT
# Function to scrape craigslist using python package
def craigs_list_api_call():
# This function returns the result of the listings based on site and category
# The search URL is as below
# https://toronto.craigslist.org/search/tor/apa?
    cl_tor_housing = CraigslistHousing(site='toronto',
                                       area='tor',
                                       category='apa',
                             filters={'bundle_duplicates': 1})

    #If geotagged=True, the results will include the (lat, lng) in the 'geotag' attrib (this will make the process a little bit longer).
    craiglist_housing = []

    for result in cl_tor_housing.get_results(sort_by='newest', geotagged=True):
        craiglist_housing.append(result)
    print("Finished craigs_list_api_call")
    return craiglist_housing

def differencer(DF):
    #Finds out the data to be scraped after comparing with the 
    #already existing data in the data base
    # Input - DF
    # Output - To be scraped IDs
    # Also clears the CurrentRental collection and updates it with the current rental
    all_postings_ids = DF['id'].map(lambda x: 'c_'+str(x))
    client = MongoClient(db_connection_string)
    db = client.ETLInsights #DB
    retrieved_postings = list(db.HistoricRental.find({'id': {'$in': list(all_postings_ids)}}))
    to_be_scraped_ids = set(all_postings_ids).difference(map(lambda x: x['id'], retrieved_postings))
    #Truncate and update the CurrentRental collection
    db.CurrentRental.delete_many({})
    db.CurrentRental.insert_many(retrieved_postings)
    client.close()
    print("Finished differencer")
    return list(map(lambda x: x[2:], to_be_scraped_ids))

def instatiate_driver():
    #########################################################################################
    #Instatiate Selenium driver
    #Returns the handle object
    #########################################################################################
    chrome_options = webdriver.ChromeOptions()
    CHROMEDRIVER_PATH = executable_path
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(executable_path=CHROMEDRIVER_PATH, options=chrome_options)
    print("Finished instatiate_driver")
    return driver

def craigs_list_scrape(craigs_list_post_docs):
    # Scraping the craigslist posting data using the urls obtained 
    # through craigslist Python Module call

    #Instatiate the selenium driver
    driver = instatiate_driver()
    error_list = []
    

    craigs_list_post_docs_cp = craigs_list_post_docs.copy()
    for post in craigs_list_post_docs_cp:

        #Visit the url
        driver.get(post['url'])

        #Separate Try Except to handle each cases separately
        #Apartment feature(Some extra feature beside the title)
        try:
            apartment_feature = driver.find_element_by_css_selector('span[class="postingtitletext"] span[class="housing"]').text
        except:
            #print(post['id'])
            error_list.append({post['id']:'apartment_feature'})
            apartment_feature = None
        finally:
            post['apartment_feature'] = apartment_feature

        #First image if present   
        try:
            image = None
            if post['has_image']:
                image = driver.find_element_by_css_selector('div[class="gallery"]').find_element_by_css_selector('img').get_attribute('src')
        except:
            print(post['id'])
            error_list.append({post['id']:'image'})
        finally:
            post['has_image'] = image

        #Body of the post  
        try:
            posting = driver.find_element_by_id("postingbody").text
        except:
            print(post['id'])
            error_list.append({post['id']:'postingbody'})
            posting = None
        finally:
            post['posting'] = posting

        #Attributes      
        try:
            attributes = [elem.text for elem in driver.find_elements_by_css_selector('p[class="attrgroup"]  span')]
        except:
            print(post['id'])
            error_list.append({post['id']:'attributes'})
            attributes = []
        finally:
            post['attributes'] = attributes
            
        time.sleep(1)
            
    driver.quit()    
    print("Finished craigs_list_scrape")   
    return craigs_list_post_docs_cp

# TRANSFORM
def clean_craigslist(DF):
    ### Remove Duplicates and unreliable data
    # - All duplicated data are removed
    # - Dont consider empty postings
    # - Drop all those rows which don't have both 'geotag' and 'where'
    # Convert attributes list to string
    # Convert the apartment feature none to ''(string)

    #Duplicates cannot hash list
    DF.drop_duplicates(subset=DF.columns[:-1], keep="first", inplace=True)
    #Dont consider empty postings
    DF.dropna(subset=['posting'], inplace=True)
    #Location:- Coming to whereabouts, in most of the cases, we have geotag. Some of the cases which doesn't have geotag,
    #we have "where". Check below.We need to drop all those rows which don't have both
    DF.dropna(subset=['where', 'geotag'], how='all', inplace=True)
    #Convert attributes list to string
    DF['attributes'] = DF['attributes'].map(lambda x: ' '.join(x))
    #Convert the apartment feature none to ''(string)
    DF['apartment_feature'].fillna(value=' ', inplace=True)#A string val
    #Combine the "attributes", "apartment_feature", "posting" together as "text" column
    DF["text"] = DF.apply(lambda x: x["attributes"]+x["apartment_feature"]+x["posting"], axis=1)
    #Use DF["text"] for all further extractions 
    print("Finished clean_craigslist")   
    return DF



def extract(s):
    # Combine the "attributes", "apartment_feature", "posting" together as "text" column for string search using regex to derive new features
    # New features derived are
    # sf - Square Feet : (int or None) Based on ft2|SqFt in the text data
    # br - Bed Room: (float or None) Number of bedrooms, based on what is preceding BR 
    # ba - Bath: (float or None) Number of bath, based on what is preceding Ba
    # cats_allowed - True or False, based on the presence of 'cats are OK - purrr'
    # dogs are OK - wooof - True or False, based on the presence of 'dogs are OK - wooof'
    # Type - Type of the housing 1 out of ``['condo', 'house', 'apartment', 'suite', 'townhouse', 'loft', 'duplex',
    #     'flat', 'cottage', 'land']`` or ``None``
    # furnished - True/Flase/None - based on the presense of (un|non)(-) furnished strings or nothing
    
    #DF['Text'] comes here as the input

    #Square Feet
    sf_found = re.findall(r'(\d+) *(ft2|SqFt)', s)
    sf =  (None if not sf_found else int(sf_found[0][0]))

    #Bed Room
    br_found = re.findall(r'(\d){0,1}(.5){0,1} *BR', s)
    br = float(''.join(br_found[0])) if  br_found and ''.join(br_found[0]) else None #To handle ('','','') situation
            
    
    #Bath
    ba_found = re.findall(r'(\d){0,1}(.5){0,1}(\+){0,1} *B[aA]',s)
    ba = float(re.sub(r'[^\d]', '', ''.join(ba_found[0]))) if  ba_found and re.sub(r'[^\d]', '', ''.join(ba_found[0])) else None
    
    
    #'cats are OK - purrr'
    cats_allowed = (True if re.findall('cats are OK - purrr', s) else False)
    
    #'dogs are OK - wooof'
    dogs_allowed = (True if re.findall('dogs are OK - wooof', s) else False)
    
    #Check the type of the commodity
    re.sub(r'[\n\.,!/?()]', ' ', s) #Remove unnecessary chars. We need to capture apartment\ also as word apartment
    cleaned_s = re.sub(r'[\n\\.,!\/?]', ' ', s)
    found_type = re.findall(r"\b(townhouse|loft|land|house|flat|duplex|condo|cottage|suite)\b", cleaned_s, flags=re.IGNORECASE) 
    Type = (None if not found_type else found_type[0].lower())
    #Though apartment is a generic term, some people mention the type as apartment, we are going to take that as the last priority
    #if nothing else is mentioned
    if not Type:
        found_type = re.findall(r"\bapartment\b", cleaned_s, flags=re.IGNORECASE)
        Type = (None if not found_type else found_type[0].lower())
        
    #Furnished or Unfurnished checks
    found_un = re.findall('(non|un)-*(?=furnished)', s , flags=re.IGNORECASE)
    furnished = False
    if not found_un:
        #furnished = None #Nothing found
        found_furnished = re.findall('furnished', s , flags=re.IGNORECASE)
        furnished = (None if not found_furnished else True)
    
    print("Finished extract")
    return [sf,br,ba, cats_allowed, dogs_allowed, Type, furnished]



def geocode(addresses):
    ### Geocode(MapQuest) the address to lat long
    #Input: a dictionary with key as index and value as address
    #Output: a dictionary with key as index and value as (lat, long) tuple
    lat_long = {}
    for index in addresses:
        try:
            #Small tweek for 'queens quay'
            location = (addresses[index]+' ,Toronto' if addresses[index].lower()=='queens quay' else addresses[index])
            url = geocode_mq_base+f'key={mq_key}&location={location}'
            url = re.sub(' +', '%20', url)
            response = requests.get(url)
            if response.ok:
                content = response.json()
                lat_long[index]=tuple(content['results'][0]['locations'][0]['latLng'].values())
            else:
                lat_long[index]=None
        except Exception as e:
            print(e)
            lat_long[index]=None
    print("Finished geocode")
    return lat_long

def reverse_geocode(loc):
    #(MapQuest)
    #Input: tuple - (lat, long)
    #Output: string - Postal Code
    lat, long = loc
    postal_code = None
    try:
        url = reverse_geocode_mq_base.format(mq_key, lat, long)
        url = re.sub(' +', '%20', url)
        #print(url)
        response = requests.get(url)
        if response.ok:
            content = response.json()
            postal_code = content['results'][0]["locations"][0]['postalCode'] if 'postalCode'\
            in content['results'][0]["locations"][0] else None
    except Exception as e:
        print(e)
    print("Finished reverse_geocode")
    return postal_code 


def fill_Lat_Long(DF):
    # Lat Long from address
    # Postal Code (Reverse Geocode) from Lat Long
    addresses = DF[DF['geotag'].isnull()]['where'].to_dict()
    lat_long = geocode(addresses)
    ## Replace the Null geocodes with the geocodes retrieved from the address
    DF.loc[lat_long.keys(), 'geotag'] = DF.loc[lat_long.keys()].index.map(lat_long)
    DF['postal_code'] = DF['geotag'].map(lambda x: reverse_geocode(x))
    # Discarding  items which doesn't have postal code
    DF.drop(index=DF[DF['postal_code'].isnull()].index, inplace=True)
    # Some are Florida postal codes
    Florida_Zipcodes = DF['postal_code'][DF['postal_code'].map(lambda x : re.findall(r'^[\d].*', x)[0] if re.findall(r'^[\d].*', x) else None).notnull()].index    
    DF.drop(index=Florida_Zipcodes, inplace=True)
    print("Finished fill_Lat_Long")
    return DF



def clean_rental_for_merge(df):
    # We need to concatenate craigslist table with kijiji table
    # All the column names have to be unique

    DF= df.copy()
    #To rename
    DF.rename(columns={"has_image":"image", "name":"title", "datetime":"post_published_date", "where":"address", "Type":"rental_type", "BR":"bedrooms", "Ba":"bathrooms", "sf":"sqft", "text":"description"}, inplace=True)              
    #To extract
    DF['pet_friendly'] = DF.apply(lambda x: x['cats_allowed'] | x['dogs_allowed'], axis=1)
    DF['lat'] = DF.geotag.map(lambda x: float(x[0]))
    DF['long'] = DF.geotag.map(lambda x: float(x[1]))
    #To clean
    DF['price'] = DF['price'].map(lambda x: re.sub(r'[^\d]', '',x))
    #To drop
    DF.drop(["repost_of", "deleted", "apartment_feature", "cats_allowed", "dogs_allowed", "geotag", "posting", "attributes", "last_updated"], axis=1, inplace=True)
    #Add one source column
    DF['source'] = 'craigslist'
    #FSA
    DF['FSA']=DF['postal_code'].map(lambda x:x.split(' ')[0])
    #Reorder
    DF = DF[['id', 'title', 'price', 'sqft','image','url','post_published_date', 'lat', 'long', 'postal_code', 'FSA', 'rental_type','bedrooms', 'bathrooms', 'furnished', 'pet_friendly', 'description', 'source']]
    #Append c_ to the index
    DF['id'] = DF['id'].map(lambda x: 'c_'+str(x))
    #Change date
    DF.post_published_date = DF.post_published_date.map(lambda x: datetime.strptime(x, "%Y-%m-%d %H:%M").strftime("%Y-%m-%d"))
    print("Finished clean_rental_for_merg")  
    return DF

def updateDB():
    # This is the main function scheduler calls to undate the database

    #CRAIGSLIST EXTRACT STEPS
    # Step1: Craigslist limited scraping using Python Module
    craiglist_housing = craigs_list_api_call()
    # Step2: Call differencer to update the CurrentRental with what is already present in HistoricRental; Then finds out which posts need scraping
    to_be_scraped_ids = differencer(pd.DataFrame(craiglist_housing))
    # Step3: Filter out the to be scraped listings and scrape further
    TBS = list(filter(lambda x: x['id'] in to_be_scraped_ids, craiglist_housing))
    craiglist_housing_enriched = craigs_list_scrape(TBS)

    #CRAIGSLIST TRANSFORM STEPS
    # Step1: Cleanup
    DF = clean_craigslist(pd.DataFrame(craiglist_housing_enriched))
    # Step2: Derive additional features from the text
    DF[['sf', 'BR', 'Ba','cats_allowed', 'dogs_allowed', 'Type', 'furnished']] = pd.DataFrame(DF['text'].map(lambda x : extract(x)).to_list(), index=DF.index)
    # Step3: Filllatlong
    DF = fill_Lat_Long(DF)
    # Step4: Transformation required to be merged with Kijiji
    DF = clean_rental_for_merge(DF)
    
    #Load the increment
    client = MongoClient(db_connection_string)
    client.ETLInsights.HistoricRental.insert_many(DF.T.to_dict().values())
    client.ETLInsights.CurrentRental.insert_many(DF.T.to_dict().values())
    client.close()
    print("Finished updateDB")

updateDB()