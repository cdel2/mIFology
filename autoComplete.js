function autoComplete() {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-1.12.4.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    script = document.createElement('script');
    script.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    var allGodsQuery = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=select+DISTINCT+str%28%3Fn%29+where+%7B+%0D%0A%3Furi+dbp%3AgodOf+%3Fgo%3B%0D%0Adbp%3Atype+%3Ft%3B%0D%0Adbp%3Aname+%3Fn.%0D%0AFILTER%28regex%28%3Ft%2C+%22.*Greek.*%22%29%29%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+`
    
    $.ajax({ 
        dataType: "jsonp", 
        url: allGodsQuery, 
        success: function(data) {
            var godsArray = []
            console.log(data);
            
            for (var i = 0; i < data.results.bindings.length; i++) {
                godsArray.push(data.results.bindings[i]["callret-0"].value);
                //console.log("element i", godsArray[i])
            }

            var progress=30;
            $('#GodName').autocomplete({
                source: godsArray,
                delay: 30
            });
        },
        error: function(e) {
            alert(e);
        }
    });  
}