const exec = require('child_process').exec;
const fs = require('fs');
const functionQueries = require('./queries/sparqlQueries/functionQueries')

function GetAllInfo(value) {
    return new Promise((resolve, reject) => {
        //independent queries
        const generalInfoQuery = functionQueries.generalInfoQuery(value);
        const siblingsInfoQuery = functionQueries.siblingsInfoQuery(value);

        //paths
        const queryPath = "./back/queries/sparqlQueries/queryFile.txt";
        const scriptPath = "./back/queries/callQuery.sh";

        //json Array containing all informations from all queries
        var jsonArray = []

        fs.writeFile(queryPath , generalInfoQuery, "utf8", function(err) {
            if(err) {
                return console.log("err1", err);
            }
        
            console.log("The file was saved!");
        }); 
        
        var testscript = exec(`SPARQL_QUERY_PATH=${queryPath} ${scriptPath}`, function(e, stdout, stderr) {
            console.log("stdout", stdout);
            console.log("stderr", stderr);
            if (e) console.log("e", e);
        });

        testscript.stdout.on('data', function(data, err){
            if (err) console.log("err2", err);

            //clean file
            fs.truncate(queryPath, 0, function(){console.log('cleaning done')});

            JSON.parse(data);
            jsonArray["general"] = data;
            console.log("general", jsonArray["general"])
        });

        fs.writeFile(queryPath , siblingsInfoQuery, "utf8", function(err) {
            if(err) {
                return console.log("err1", err);
            }
        
            console.log("The file was saved!");
        }); 
        
        testscript = exec(`SPARQL_QUERY_PATH=${queryPath} ${scriptPath}`, function(e, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (e) console.log(e);
        });

        testscript.stdout.on('data', function(data, err){
            if (err) console.log("err2", err);

            //clean file
            fs.truncate(queryPath, 0, function(){console.log('cleaning done')});

            JSON.parse(data);
            jsonArray["siblings"] = data[0];
            console.log("siblings", jsonArray["siblings"])
        });

        resolve(jsonArray)







    }
)}


module.exports = {GetAllInfo}