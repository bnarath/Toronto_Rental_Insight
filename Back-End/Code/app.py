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

def getCrimeData(collection, attr):
    query = dict()
    if attr in ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']:
        query["MCI"]=attr
    # print(query)
    try:
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsights[collection].find(query, {'_id':0}))
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
        response = list(client.ETLInsights[collection].find(query, {'_id':0}))
        client.close()
    except:
        client.close()
        return jsonify([]),  404
    return jsonify(response)

def commAssets(collection, args):
    query = dict()
    listcategories = ['Community Services',
            'Education & Employment',
            'Financial Services',
            'Food & Housing',
            'Health Services',
            'Law & Government',
            'Transportation']
    try:
        if args:
            category = args.get("category", None) 
            fsa = args.get("fsa", None)
            #Construct query
            if(category or fsa):
                if category and (category in listcategories):
                    query["category"]=category
                if fsa:
                    query["fsa"]=fsa
            # print(query)
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsights[collection].find(query, {'_id':0}))
        client.close()
    except:
        client.close()
        return jsonify([]),  404
    return jsonify(response)

def incomeData(collection, args):
    query = dict()
    try:
        if args:
            FSA = args.get("FSA", None)
            #Construct query
            if FSA:
                query["FSA"]=FSA
            # print(query)
        client = MongoClient(db_connection_string)
        response = list(client.ETLInsights[collection].find(query, {'_id':0}))
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
def getcrimeDynamic():
    attr = request.args.get("MCI")
    return getCrimeData("Crime", attr)
    # Options
    # ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']
    # http://127.0.0.1:5000/crimeLastYear?MCI=Break%20and%20Enter
@app.route('/crimeLastSixMonths')
def getcrimeShort():
    attr = request.args.get("MCI")
    return getCrimeData("CrimeLastSixMonths", attr)
    # Options
    # ['Assault', 'Auto Theft', 'Break and Enter', 'Homicide', 'Robbery', 'Theft Over']
    # http://127.0.0.1:5000/crimeLastSixMonths?MCI=Break%20and%20Enter
@app.route('/communityAssets')
def getcommAssets():
    args = request.args.to_dict()
    # print(args)
    return commAssets("CommunityAssets", args)
    # ['Community Services','Education & Employment','Financial Services','Food & Housing','Health Services','Law & Government','Transportation']
    # http://127.0.0.1:5000/communityAssets?category=Food%20%26%20Housing&fsa=M1P#

@app.route('/fsaIncome')
def getFSAIncome():
    args = request.args.to_dict()
    return incomeData("FSAIncome", args)
    # http://127.0.0.1:5000/fsaIncome?FSA=M4E
        

if __name__ == "__main__":
    app.run(debug=True)
