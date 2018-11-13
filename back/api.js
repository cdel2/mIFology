const exec = require('child_process').exec;
const fs = require('fs');

function getDBpediaInfo(value) {
    return new Promise((resolve, reject) => {
        const query = `
        select ?n,?abode  where {
            ?uri dbp:name ?n;
                dbp:godOf ?go;
                dbp:type ?t;
                dbp:abode ?a. 
                ?a rdfs:label ?abode.
            
            Filter(regex(?t,".*Greek.*") and regex(?n,".*${value}( |$)") and lang(?abode)='en')
        } `
        
        fs.writeFile("./queries/sparqlQueries/sparqlQuery.txt", query, function(err) {
            if(err) {
                throw (err);
            }
        
            console.log("The file was saved!");
        }); 
        
        const testscript = exec('SPARQL_QUERY_PATH=./queries/sparqlQueries/sparqlQuery.txt ./queries/dbpediaSPARQL.sh');

        testscript.stdout.on('data', function(data, err){
            if (err) throw (err);


            //clean file
            fs.truncate('./queries/sparqlQueries/sparqlQuery.txt', 0, function(){console.log('cleaning done')});

            resolve(JSON.parse(data))
        });
    }
)}


module.exports = {getDBpediaInfo}