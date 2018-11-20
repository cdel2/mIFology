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
            
            for (var i = 0; i < data.results.bindings.length; i++) {
                godsArray.push(data.results.bindings[i]["callret-0"].value);
                //console.log("element i", godsArray[i])
                var node = document.createElement("OPTION");                 // Create a <li> node
                var textnode = document.createTextNode(data.results.bindings[i]["callret-0"].value);         // Create a text node
                node.appendChild(textnode);                              // Append the text to <li>
                document.getElementById("godsNames").appendChild(node);     // Append <li> to <ul> with 

            }

            //var progress=30;
            //$('#GodName').autocomplete({
            //
            //});
        },
        error: function(e) {
            alert(e);
        }
    });  
}