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
