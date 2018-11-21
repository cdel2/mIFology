var godsArray = []

function hideTab(){
    //Function to hide the tab when the home button is clicked
    document.getElementById("resultTable").style.display = "none";
    document.getElementById("familyTree").style.display = "none";
    document.getElementById("GodName").value = "";
    document.getElementById("homePic").style.display = "initial";
}


function getGodsInfo() {

    //Function to maje the tab visible
    document.getElementById("resultTable").style.display = "initial";
    document.getElementById("homePic").style.display = "none";

    //Transform the name of the god with the good capital letters

    var godNamewithGoodCaps= ($("#GodName").val().charAt(0)).toUpperCase();
    
    for (var i = 1; i < $("#GodName").val().length; i++) {
            godNamewithGoodCaps += ($("#GodName").val().charAt(i)).toLowerCase();
           
    }

    console.log(godsArray)
    if (godsArray.indexOf(godNamewithGoodCaps) !== -1) {
        document.getElementById("resultTable").style.display="block";
        document.getElementById("familyTree").style.display = "initial";
        document.getElementById("noGodFound").style.display="none";

    }
    if (godsArray.indexOf(godNamewithGoodCaps) === -1) {
        document.getElementById("resultTable").style.display="none";
        document.getElementById("familyTree").style.display = "none";
        document.getElementById("noGodFound").style.display="block";
    }


    


    //Display loading while data is loading
    document.getElementById('godImage').src = "../style/img/LoadingImage.jpg"
    document.getElementById('godGender').innerHTML = "Loading..";
    document.getElementById('godAbode').innerHTML= "Loading..";
    document.getElementById('godSiblings').innerHTML= "Loading..";
    document.getElementById('godSymbol').innerHTML= "Loading..";
    document.getElementById('godChildren').innerHTML= "Loading..";
    document.getElementById('godParents').innerHTML= "Loading..";
    document.getElementById('godConsorts').innerHTML = "Loading..";
    document.getElementById('godGames').innerHTML = "Loading..";
    document.getElementById('godMovies').innerHTML = "Loading..";



    var abode = []
    var gender = []
    var godOf = []
    var image = []
    var nameOfGod = []
    var symbols = []
    var siblings = []
    var parents = []
    var children = []
    var consorts = []
    var games = []
    var movies = []
    var URL = 'https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=';
    var suffix = '&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+';
    

    /////////////////////////Sparql queries//////////////////////////////////////////////////

    //Pour plus d'infos sur chaque requête, merci de se référer à l'annexe du compte rendu pdf. 
    var generalQuery = `
        select ?uri as ?resource, STR(?n) as ?nameOfGod, ?image, STR(?go) as ?GodOf,STR(?abode) as ?Abode, if(EXISTS{?uri foaf:gender ?ge}, STR(?ge),(if(regex(?GodOf,".*God .*","i"), "Male",(if(regex(?GodOf,".*Goddess .*","i"), "Female","Not specified"))))) as ?Gender where {

   ?uri dbp:name ?n;
   dbp:type ?t.
   
   Filter(regex(?t,".*Greek.*") and datatype(?n)=rdf:langString and regex(?n, ".*`+godNamewithGoodCaps+`(_| |$)"))
  
   {
    ?uri dbp:godOf ?go.
    FILTER(isLiteral(?go))
   }
   UNION
   {
    ?uri dbp:godOf ?goresource.
    ?goresource rdfs:label ?go.
    FILTER(isLiteral(?go) and lang(?go)="en")
   }
   
   optional{?uri dbo:thumbnail ?image}.

   
   optional{
      ?uri dbp:abode ?a. 
      ?a rdfs:label ?abode.
      FILTER(lang(?abode)="en")
   }.
  
   optional{?uri foaf:gender ?ge}.
}
    `
    var siblingsQuery = `
        SELECT DISTINCT STR(?sibling) as ?Sibling
        WHERE {
        ?uri dbp:name ?n;
        dbp:godOf ?go;
        dbp:type ?t.
        FILTER(regex(?t,".*Greek.*") and regex(?n,".*`+godNamewithGoodCaps+`( |$)","i"))

        {
        VALUES ?N { 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30} 
        ?uri dbp:siblings ?siblings.
        FILTER(!isBlank(?siblings) and isLiteral(?siblings))
        BIND(replace(?siblings, " and ", " ") as ?sibStr)
        BIND (concat("^([^,]*,){", str(?N) ,"} *") AS ?skipN)
        BIND (replace(replace(?sibStr, ?skipN, ""), ",.*$", "") AS ?sibling)
        }
        UNION 
        {
            {?uri dbp:siblings ?siblings.}
            UNION
            {?siblings dbp:siblings ?uri.}

            ?siblings dbp:godOf ?go2;
            dbp:type ?t;
            dbp:name ?sibling.
            
            Filter(isLiteral(?sibling))
        }}
        `

    var symbolsQuery = `
        select DISTINCT STR(?symbol) as ?Symbol where {
        ?uri dbp:name ?n;
        dbp:godOf ?go;
        dbp:type ?t.
        {
            ?uri dbp:symbol ?symbols.
            ?symbols rdfs:label ?symbol.
            FILTER(!isLiteral(?symbols) and lang(?symbol)="en")
        }
        UNION
        {
            ?uri dbp:symbol ?symbol.
            FILTER(isLiteral(?symbol))
        }
    
        Filter(regex(?t,".*Greek.*") and regex(?n,".*`+godNamewithGoodCaps+`( |$)","i"))
        }`

    var childrenQuery = `
    SELECT DISTINCT STR(?child) as ?Children
    WHERE {
      ?uri dbp:name ?n;
      dbp:godOf ?go;
      dbp:type ?t.
      FILTER(regex(?t,".*Greek.*") and regex(?n,".*`+godNamewithGoodCaps+`( |$)","i"))
      { 
         VALUES ?N { 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30} 
         ?uri dbp:children ?childrenStr.
         FILTER(!isBlank(?childrenStr)  and isLiteral(?childrenStr))
         BIND(replace(?childrenStr, " and ", " ") as ?childStr)
         BIND (concat("^([^,]*,){", str(?N) ,"} *") AS ?skipN)
         BIND (replace(replace(?childStr, ?skipN, ""), ",.*$", "") AS ?child)
      }
      UNION 
      {
         {?uri dbp:children ?children.}
         UNION
         {?children dbp:parents ?uri.}
    
         ?children rdfs:label ?child.
         
         Filter(isLiteral(?child) and lang(?child)="en")
      }  
    }
    
    `
    var parentsQuery = `
        select DISTINCT ?parent  where 
        {
        ?uri dbp:name ?child;
        dbp:godOf ?go;
        dbp:type ?t.
        Filter(regex(?t,".*Greek.*") and regex(?child,".*`+godNamewithGoodCaps+`( |$)","i"))
        {
            ?uri dbp:parents ?parents.
            FILTER(!isBlank(?parents) and isLiteral(?parents))
            VALUES ?N1 { 1 2 3 4} 
            BIND(replace(?parents, " and ", ",") as ?parentStr)
            BIND (concat("^([^,]*,){", str(?N1) ,"} *") AS ?skipN1)
            BIND (replace(replace(?parentStr, ?skipN1, ""), ",.*$", "") AS ?parent)
        }
        UNION
        {
            ?uri dbp:parents ?parents.
            ?parents dbp:name ?parent.
            FILTER(isLiteral(?parent))
        }
        }`
    var consortsQuery = `
        SELECT DISTINCT STR(?consort) as ?Consorts
        WHERE {
        {
            ?uri dbp:name ?n;
            dbp:godOf ?go;
            dbp:type ?t.
            FILTER(regex(?t,".*Greek.*") and regex(?n,".*`+godNamewithGoodCaps+`( |$)","i"))
            ?consortRes dbp:consort ?ourGod;
            dbp:type ?t.
            FILTER(!isBlank(?ourGod) and isLiteral(?ourGod))
            VALUES ?N1 { 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20} 
            BIND(replace(?ourGod, " and ", " ") as ?ourGodStr)
            BIND (concat("^([^,]*,){", str(?N1) ,"} *") AS ?skipN1)
            BIND (replace(replace(?ourGodStr, ?skipN1, ""), ",.*$", "") AS ?ourGodName)
            FILTER(regex(?ourGodName, ?n, "i"))
            ?consortRes dbp:name ?consort.
        }
        UNION 
        {
            ?uri dbp:name ?n;
            dbp:godOf ?go;
            dbp:type ?t.
            FILTER(regex(?t,".*Greek.*") and regex(?n,".*`+godNamewithGoodCaps+`( |$)","i"))
            ?consortRes dbp:consort ?ourGod;
            dbp:type ?t.   
            ?ourGod dbp:type ?t;
            dbp:name ?ourGodName.
            FILTER(regex(?ourGodName, CONCAT(?n,"( |$)"), "i"))
            ?consortRes dbp:name ?consort.
        }
        }`

    var consortsQuery2 = `
        select DISTINCT STR(?consort) as ?Consort where {
        ?uri dbp:name ?n;
        dbp:godOf ?go;
        dbp:type ?t.
        Filter(regex(?t,".*Greek.*") and regex(?n,".*`+godNamewithGoodCaps+`( |$)"))

        {
            VALUES ?N { 1 2 3 4 5 6 7 8 9 10} 
            ?uri dbp:consort ?consorts.
            FILTER(!isBlank(?consorts) and isLiteral(?consorts))
            BIND(replace(?consorts, " and ", ",") as ?consortStr)
            BIND (concat("^([^,]*,){", str(?N) ,"} *") AS ?skipN)
            BIND (replace(replace(?consortStr, ?skipN, ""), ",.*$", "") AS ?consort)
        }
        UNION
        {
            ?uri dbp:consort ?consorts.
            ?consorts dbp:type ?t;
            dbp:name ?consort.
        }
        }
    `
    
    var gamesQuery = `
        select distinct(STR(?label)) as ?game where {
        ?uri ?b dbo:VideoGame.
        ?uri rdfs:comment ?comment.
        ?uri dbo:abstract ?abstract.
        {
            ?uri ?b2 dbc:Video_games_based_on_Greek_mythology.
        }
        UNION
        {
            ?uri ?b2 yago:WikicatMythology-basedVideoGames.
        }
        UNION
        {
            ?uri ?b2 dbc:Mythology-based_video_games
        }
        UNION
        {
            ?uri ?b2 dbc:Video_games_set_in_antiquity
        }
        UNION
        {
            ?uri rdfs:comment ?comment.
            ?uri dbo:abstract ?abstract.
            Filter(( lang(?comment)="en" and lang(?abstract)="en") and ( regex(?comment,"(m|M)ytholog(y|ical)") || regex(?comment,"(G|g)reek") || regex(?abstract,"(m|M)ytholog(y|ical)") || regex(?abstract,"(G|g)reek") ) )
        }
        ?uri rdfs:label ?label.
        Filter( lang(?label)="en" and ( lang(?comment)="en" and lang(?abstract)="en") and ( regex(?comment,"`+godNamewithGoodCaps+`( |,|;/\\\\.)") || regex(?abstract,"`+godNamewithGoodCaps+`( |,|;|\\\\.)") ) )

        }
        `


    var moviesQuery=`
        select Distinct(STR(?label)) as ?movie , ?uri where{
      ?uri rdf:type dbo:Film;
           dbo:abstract ?abstract;
           rdfs:label ?label;
           rdf:type ?type.
      Filter(( lang(?label)="en" and lang(?abstract)="en" ) and ( regex(?abstract,"`+godNamewithGoodCaps+`( |,|;|\\\\.)")  and  (regex(?type,"mytholog","i")  ||  regex(?abstract,"mytholog","i")   ||  regex(?abstract," god( |,|;|.//)","i")  )  ))
}

        `



    var encodedGeneralQuery = URL + encodeURI(generalQuery) + suffix
    var encodedSiblingsQuery = URL+encodeURI(siblingsQuery)+suffix
    var encodedSymbolsQuery = URL+encodeURI(symbolsQuery)+suffix
    var encodedChildrenQuery = URL+encodeURI(childrenQuery)+suffix
    var encodedParentsQuery = URL+encodeURI(parentsQuery)+suffix
    var encodedConsortsQuery = URL + encodeURI(consortsQuery) + suffix
    var encodedConsortsQuery2 = URL + encodeURI(consortsQuery2) + suffix
    var encodedGamesQuery = URL + encodeURI(gamesQuery) + suffix
    var encodedMoviesQuery = URL + encodeURI(moviesQuery) + suffix



    $.ajax({ 
        url: encodedGeneralQuery, 
        success: function(result) {
            var results = result.results.bindings;
            for (var res in results) {
                if (typeof (results[res].Abode) !== 'undefined') {
                    tmpAbode = results[res].Abode.value;
                    if (abode.indexOf(" " + tmpAbode) === -1) abode.push(" " + tmpAbode)
                }
                if (typeof (results[res].Gender) !== 'undefined') {
                    tmpGender = results[res].Gender.value;
                    if (gender.indexOf(tmpGender) === -1) gender.push(tmpGender)
                }
                if (typeof (results[res].GodOf) !== 'undefined') {
                    tmpGodOf = results[res].GodOf.value;
                    if (godOf.indexOf(" " + tmpGodOf) === -1) godOf.push(" " + tmpGodOf)
                }
                if (typeof (results[res].image) !== 'undefined') {
                    tmpImage = results[res].image.value;
                    if (image.indexOf(tmpImage) === -1) image.push(tmpImage)
                }
                if (typeof (results[res].nameOfGod) !== 'undefined') {
                    tmpNameOfGod = results[res].nameOfGod.value;
                    if (nameOfGod.indexOf(tmpNameOfGod) === -1) nameOfGod.push(tmpNameOfGod)
                }
            }

            if (nameOfGod.length == 0) document.getElementById('godName').innerHTML = "No name found";
            else {
                document.getElementById('godName').innerHTML = godNamewithGoodCaps;
                document.getElementById('MyGod').innerHTML=$("#GodName").val();
            }
            
            if (godOf.length == 0) document.getElementById('godFunction').innerHTML = "No function found";
            else document.getElementById('godFunction').innerHTML = godOf;

            if (gender.length == 0) document.getElementById('godGender').innerHTML = "No Gender found";
            else document.getElementById('godGender').innerHTML = gender;

            if (image.length == 0) document.getElementById('godImage').src = "style/img/imageNotFound.png"
            else {
                document.getElementById('godImage').src = image;
                document.getElementById('godImage').alt = godNamewithGoodCaps;
            }

            if (abode.length == 0) document.getElementById('godAbode').innerHTML = "No abode found";
            else document.getElementById('godAbode').innerHTML=abode;
        } 
    }); 
        
    $.ajax({ 
        url: encodedSiblingsQuery, 
        success: function(result) {
            var results = result.results.bindings; 
            for (var res in results) {
                sibling = results[res].Sibling.value
                if (siblings.indexOf(" " + sibling) === -1) siblings.push(" " + sibling)
            }
            if (siblings.length == 0) document.getElementById('godSiblings').innerHTML = "No siblings found";
            else document.getElementById('godSiblings').innerHTML=siblings;
        } 
    }); 

    $.ajax({ 
        url: encodedSymbolsQuery, 
        success: function(result) {
            var results = result.results.bindings; 
            for (var res in results) {
                symbol = results[res].Symbol.value
                if (symbols.indexOf(" " + symbol) === -1) symbols.push(" " + symbol)
            }
            if (symbols.length == 0) document.getElementById('godSymbol').innerHTML = "No symbols found";
            else document.getElementById('godSymbol').innerHTML=symbols;
        } 
    }); 
        
    $.ajax({ 
        url: encodedChildrenQuery, 
        success: function(result) {
            var results = result.results.bindings; 
            for (var res in results) {
                child = results[res].Children.value
                if (children.indexOf(" " + child) === -1) children.push(" " + child)
            }
            if (children.length == 0) document.getElementById('godChildren').innerHTML = "No children found";
            else document.getElementById('godChildren').innerHTML=children;
        } 
    }); 
    $.ajax({ 
        url: encodedParentsQuery, 
        success: function(result) {
            var results = result.results.bindings; 
            for (var res in results) {
                parent = results[res].parent.value
                Mom = results[0].parent.value
                Dad = results[1].parent.value
                if (parents.indexOf(" " + parent) === -1) parents.push(" " + parent)
            }
            document.getElementById('godParents').innerHTML=parents;
            document.getElementById('Mom').innerHTML=Mom;
            document.getElementById('Dad').innerHTML=Dad;
        } 
    });     
        
    $.ajax({
        url: encodedConsortsQuery,
        success: function (result) {
            var results = result.results.bindings;
            for (var res in results) {
                consort = results[res].Consorts.value
                if (consorts.indexOf(" " + consort) === -1) consorts.push(" " + consort)
            }
        }
    }).then($.ajax({
        url: encodedConsortsQuery2,
        success: function (result) {
            var results = result.results.bindings;
            for (var res in results) {
                consort = results[res].Consort.value
                if (consorts.indexOf(" " + consort) === -1) consorts.push(" " + consort)
            }
            if (consorts.length == 0) document.getElementById('godConsorts').innerHTML = "No consorts found";
            else document.getElementById('godConsorts').innerHTML = consorts;
        }
    }));

    $.ajax({
        url: encodedGamesQuery,
        success: function (result) {
            var results = result.results.bindings;
            for (var res in results) {
                game = results[res].game.value
                if (games.indexOf(" " + game) === -1) games.push(" " + game)
            }
            if (games.length == 0) document.getElementById('godGames').innerHTML = "No games found";
           else document.getElementById('godGames').innerHTML = games;
        }
    });

    $.ajax({
        url: encodedMoviesQuery,
        success: function (result) {
            var results = result.results.bindings;
            for (var res in results) {
                movie = results[res].movie.value
                if (movies.indexOf(" " + movie) === -1) movies.push(" " + movie)
            }
            if (movies.length == 0) document.getElementById('godMovies').innerHTML = "No movies found";
           else document.getElementById('godMovies').innerHTML = movies;
        }
    });
/*
    var divConsort = "<div class=\"generation\" id=\"parents\">";
    $.ajax({ 
        url: encodedConsortsQuery, 
        success: function(result) {
            var results = result.results.bindings; 
            for (var res in results) {
                consort = results[res].Consorts.value
                if (consorts.indexOf(" " + consort) === -1)
                {
                    consorts.push(" " + consort)
                    var commonChild = commonChildren($("#GodName").val(), consort);
                    divConsort+="<div class=\"card-m\">"+consort+"</div><div >"+commonChild+"</div>";
                }
            }
        } 
    }).then($.ajax({ 
        url: encodedConsortsQuery2, 
        success: function(result) {
            var results = result.results.bindings;
            for (var res in results) {
                consort = results[res].Consort.value
                if (consorts.indexOf(" " + consort) === -1) 
                {
                consorts.push(" " + consort)
                divConsort+="<div class=\"card-m\">"+consort+"</div>";
                }
            }
            divConsort+="</div>";
            document.getElementById('consorts').innerHTML=divConsort;
            document.getElementById('godConsorts').innerHTML=consorts;
        } 
    }))
}

function commonChildren(papa, maman) {
    var script = document.createElement('script');

    var URL = 'https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=';
    var suffix = '&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+';
    var childrenPapa = []
    var childrenMaman = []

    var childrenPapaQuery = `
        SELECT DISTINCT STR(?child) as ?Children
        WHERE {
        ?uri dbp:name ?n;
        dbp:godOf ?go;
        dbp:type ?t.
        FILTER(regex(?t,".*Greek.*") and regex(?n,".*`+ papa + `( |$)","i"))

        {
            VALUES ?N { 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30}
            ?uri dbp:children ?childrenStr.
            FILTER(!isBlank(?childrenStr)  and isLiteral(?childrenStr))
            BIND(replace(?childrenStr, " and ", " ") as ?childStr)
            BIND (concat("^([^,]*,){", str(?N) ,"} *") AS ?skipN)
            BIND (replace(replace(?childStr, ?skipN, ""), ",.*$", "") AS ?child)
        }
        UNION
        {
            {?uri dbp:children ?children.}
            UNION
            {?children dbp:parents ?uri.}

            ?children dbp:type ?t;
            dbp:name ?child.

            Filter(isLiteral(?child))
        }
        }
    `


    var childrenMamanQuery = `
        SELECT DISTINCT STR(?child) as ?Children
        WHERE {
        ?uri dbp:name ?n;
        dbp:godOf ?go;
        dbp:type ?t.
        FILTER(regex(?t,".*Greek.*") and regex(?n,".*`+ maman + `( |$)","i"))

        {
            VALUES ?N { 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30}
            ?uri dbp:children ?childrenStr.
            FILTER(!isBlank(?childrenStr)  and isLiteral(?childrenStr))
            BIND(replace(?childrenStr, " and ", " ") as ?childStr)
            BIND (concat("^([^,]*,){", str(?N) ,"} *") AS ?skipN)
            BIND (replace(replace(?childStr, ?skipN, ""), ",.*$", "") AS ?child)
        }
        UNION
        {
            {?uri dbp:children ?children.}
            UNION
            {?children dbp:parents ?uri.}

            ?children dbp:type ?t;
            dbp:name ?child.

            Filter(isLiteral(?child))
        }
        }
    `

    var encodedChildrenPapaQuery = URL + encodeURI(childrenPapaQuery) + suffix
    var encodedChildrenMamanQuery = URL + encodeURI(childrenMamanQuery) + suffix

    $.ajax({
        url: encodedChildrenPapaQuery,
        success: function (result) {
            var results = result.results.bindings;
            for (var res in results) {
                console.log(child)
                child = results[res].Children.value
                if (childrenPapa.indexOf(" " + child) === -1) childrenPapa.push(" " + child)
            }
            console.log(childrenPapa)
        }
    }).then($.ajax({
        url: encodedChildrenMamanQuery,
        success: function (result) {
            var results = result.results.bindings;
            for (var res in results) {
                console.log(child)
                child = results[res].Children.value
                if (childrenMaman.indexOf(" " + child) === -1) childrenMaman.push(" " + child)
            }
            var commonChildren = childrenPapa.filter(value => -1 !== childrenMaman.indexOf(value));
            console.log(commonChildren)
        }
    }));

    return commonChildren;

}*/


}