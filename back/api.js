const exec = require('child_process').exec;
const fs = require('fs');
const functionQueries = require('./queries/sparqlQueries/functionQueries')
const path = "./back/queries/sparqlQueries/queryFile.txt";

async function clean(path) {
    fs.truncate(path, 0, function(){console.log('cleaning done')});
}

function getAllInfo(value) {
    return new Promise((resolve, reject) => {
        const allInfoQuery = functionQueries.AllInfoQuery(value)

        fs.writeFile(path , allInfoQuery, "utf8", function(err) {
            if(err) {
                return console.log("err1", err);
            }
        
            console.log("The file was saved!");
        }); 

        testscript = exec(`SPARQL_QUERY_PATH=${path} ./back/queries/callQuery.sh`);

        testscript.stdout.on('data', function(data, err){
            if (err) console.log("err2 =====", err);
            console.log(data)

            //clean file
            clean(path).then(resolve(JSON.parse(data)))
            
        });
    })
}

/*

function getAllInfo(value) {
    return new Promise((resolve, reject) => {
        var jsonArray = [];
        var testscipt;

        queries = [functionQueries.siblingsInfoQuery(value), functionQueries.generalInfoQuery(value)]
        paths = ["./back/queries/sparqlQueries/generalInfoFile.txt", "./back/queries/sparqlQueries/siblingsInfoFile.txt"]

        for(var i = 0; i < paths.length; i++)
        {
            console.log(i)
            fs.writeFile(paths[i] , queries[i], "utf8", function(err) {
                if(err) {
                    return console.log("err1", err);
                }
            
                console.log("The file was saved!");
            }); 

            testscript = exec(`SPARQL_QUERY_PATH=${path} ./back/queries/callQuery.sh`);

            testscript.stdout.on('data', function(data, err){
                if (err) console.log("err2 =====", err);
                console.log(data)
                //clean file
                clean(paths[i]).then(jsonArray[i] = JSON.parse(data)[0])
            });

        }

        resolve(jsonArray)
    })
}*/

    
function getGeneralInfo(value) {
    return new Promise((resolve, reject) => {
        const generalInfoQuery = functionQueries.generalInfoQuery(value);
        fs.writeFile(path , generalInfoQuery, "utf8", function(err) {
            if(err) {
                return console.log("err1", err);
            }
        
            console.log("The file was saved!");
        }); 
        
        const testscript = exec(`SPARQL_QUERY_PATH=${path} ./back/queries/callQuery.sh`);

        testscript.stdout.on('data', function(data, err){
            if (err) console.log("err2 =====", err);

            //clean file
            clean(path).then(resolve(JSON.parse(data)[0]))
        });
    })
}

function getSiblingsInfo(value) {
    return new Promise((resolve, reject) => {
        const siblingsInfoQuery = functionQueries.siblingsInfoQuery(value);
        fs.writeFile(path , siblingsInfoQuery, "utf8", function(err) {
            if(err) {
                return console.log("err1", err);
            }
        
            console.log("The file was saved!");
        }); 
        
        const testscript = exec(`SPARQL_QUERY_PATH=${path} ./back/queries/callQuery.sh`);

        testscript.stdout.on('data', function(data, err){
            if (err) console.log("err2 =====", err);

            //clean file
            clean(path).then(resolve(JSON.parse(data)[0]))
        });
    })
}

module.exports = {getAllInfo, getGeneralInfo, getSiblingsInfo}