function autoComplete() {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-1.12.4.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    script = document.createElement('script');
    script.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    var URL = 'https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=';
    var autoCompleteQuery = `select DISTINCT STR(?n)  where {
                             ?uri dbp:name ?n;
                             dbp:godOf ?go;
                             dbp:type ?t.
                             Filter(regex(?t,".*Greek.*") and isLiteral(?n) and datatype(?n) = rdf:langString)}`
    var suffix = '&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+';

    var allGodsQuery = URL+encodeURI(autoCompleteQuery)+suffix
    
    $.ajax({ 
        dataType: "jsonp", 
        url: allGodsQuery, 
        success: function(data) {

            for(var i = 0; i < data.results.bindings.length; i++) {
                godsArray.push(data.results.bindings[i]["callret-0"].value);               
            }

            godsArray.sort(function(a, b){
                    if(a < b) { return -1; }
                    if(a > b) { return 1; }
                    return 0;
                })
            
            for (var i = 0; i < godsArray.length; i++) {
                var node = document.createElement("OPTION");
                var textnode = document.createTextNode(godsArray[i]);
                node.appendChild(textnode);                            
                document.getElementById("godsNames").appendChild(node);  

            }
        },
        error: function(e) {
            alert(e);
        }
    });  
}