from flask import Flask, jsonify, request
from pymongo import MongoClient
from urls_list import  db_connection_string
import re

#Configure Flask App
app = Flask(__name__)

def createQuery(query, arr, attribute):
    if arr[0] == -1:
        query[attribute] = {"$lte":arr[1]}
    elif arr[1] == -1:
        query[attribute] = {"$gte":arr[0]}
    else:
        query[attribute] = {"$lte":arr[1], "$gte":arr[0]}
    return query

def fullData(collection):
    try:
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsights[collection].find({}, {'_id':0}))
        client.close()
    except:
        client.close()
        return jsonify([]),  404
    return jsonify(response)

def RentalData(collection, args):
    query = dict()
    try:
        if args:
            sqft = args.get("sqft", None) #If min or max are null, give -1
            price = args.get("price", None) #If min or max are null, give -1
            FSA = args.get("FSA", None) 
            bedrooms = args.get("bedrooms", None) #If min or max are null, give -1
            bathrooms = args.get("bathrooms", None) #If min or max are null, give -1
            #Construct query
            if(sqft or price or FSA or bedrooms or bathrooms):
                if sqft:
                    sqft =  [int(val) for val in re.sub('[\[\]]', '', sqft).split(',')]
                    query = createQuery(query, sqft, "sqft")
                if price:
                    price = [int(val) for val in re.sub('[\[\]]', '', price).split(',')]
                    query = createQuery(query, price, "price")
                if bedrooms:
                    bedrooms = [int(val) for val in  re.sub('[\[\]]', '', bedrooms).split(',')]
                    query = createQuery(query, bedrooms, "bedrooms")
                if bathrooms:
                    bathrooms = [int(val) for val in re.sub('[\[\]]', '', bathrooms).split(',')]
                    query = createQuery(query, bathrooms, "bathrooms")
                if FSA:
                    query["FSA"] = FSA
            # print(query)
    
        client = MongoClient(db_connection_string)
        if query:
            response = list(client.ETLInsights[collection].find(query, {'_id':0}))
        else:
            response = list(client.ETLInsights[collection].find({}, {'_id':0}))
        client.close()
    except:
        client.close()
        return jsonify([]),  404
    return jsonify(response)

@app.route('/availableRental')
def getcurrentRental():
    args = request.args.to_dict()
    # print(args)
    return RentalData("CurrentRental", args) 
    # http://127.0.0.1:5000/availableRental?sqft=[1000,-1]&price=[1500,2500]&bedrooms=[2,-1]&bathrooms=[1,-1]&FSA=M4E  
@app.route('/rentalTrend')
def gethistoricRental():
    args = request.args.to_dict()
    # print(args)
    return RentalData("HistoricRental", args) 
    # http://127.0.0.1:5000/rentalTrend?sqft=[1000,-1]&price=[1500,2500]&bedrooms=[2,-1]&bathrooms=[1,-1]&FSA=M4E 
    # return fullData("HistoricRental")
@app.route('/crimeLastYear')
def getcrime():
    return fullData("Crime")
@app.route('/crimeLastSixMonths')
def getcrimeShort():
    return fullData("CrimeLastSixMonths")
@app.route('/communityAssets')
def getcommAssets():
    return fullData("CommunityAssets")
@app.route('/fsaIncome')
def getFSAIncome():
    return fullData("FSAIncome")

        
        



if __name__ == "__main__":
    app.run(debug=True)
