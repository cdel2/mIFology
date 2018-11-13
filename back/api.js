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
        } `;
        
        const queryPath = "./back/queries/sparqlQueries/query.txt";
        const scriptPath = "./back/queries/callQuery.sh";

        fs.writeFile(queryPath , query, "utf8", function(err) {
            if(err) {
                return console.log("err1", err);
            }
        
            console.log("The file was saved!");
        }); 
        
        const testscript = exec(`SPARQL_QUERY_PATH=${queryPath} ${scriptPath}`, function(e, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (e) console.log(e);
        });

        testscript.stdout.on('data', function(data, err){
            if (err) console.log("err2", err);

            //clean file
            fs.truncate(queryPath, 0, function(){console.log('cleaning done')});

            resolve(JSON.parse(data))
        });
    }
)}


module.exports = {getDBpediaInfo}