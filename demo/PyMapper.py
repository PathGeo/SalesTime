#!/usr/bin/python

import json, cgi, re
from pymongo import MongoClient
from geopy import geocoders

connection = MongoClient()
db = connection.test

def getSortedURLTuples(urls):
	count = {}
	for url in urls:
		count[url] = 1 if url not in count else count[url] + 1
	urls = count.items()
	urls.sort(key=lambda x: x[1])
	urls.reverse()
	results = []
	for url in urls[:5]:
		results.append([url[0], url[1]])
	return results


print ""

g = geocoders.GeoNames()

fs = cgi.FieldStorage()
key = fs['key'].value
rad = fs['rad'].value
keyword = fs['keyword'].value

place, (lat, lng) = g.geocode(key, exactly_one=False)[0]  


query = {}

if key.strip() <> "NULL":
	#query = {}
	query = {"loc": {"$within": {"$center": [[lat, lng], float(rad)/69]}}, 'text': {'$regex': re.compile(keyword, re.IGNORECASE)}} 
	#results = [{'loc': [0,0] if 'loc' not in doc else doc['loc'] , 'text': doc['text']} for doc in db.test.find(query)]
else:
	#query = {}
	query['$and'] = [{"loc": {"$exists": 1}}, {'text': {'$regex': re.compile(keyword, re.IGNORECASE)}}] 
	#results = [{'loc': doc['loc'], 'text': doc['text']} for doc in db.test.find(query)]
	

urls = []	
results = []	
for doc in db.besttest.find(query):
	out = { 'text': doc['text'] }
	if 'loc' in doc:
		out['loc'] = doc['loc']
	if 'urls' in doc:
		out['urls'] = doc['urls']
		for url in doc['urls']:
			urls.append(url)
	results.append(out)
	
all = { 'results': results, 'urls': getSortedURLTuples(urls) }	

print json.dumps(all)
#print json.dumps(results)

