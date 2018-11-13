module.exports = {
  generalInfoQuery: function(value) { 
    return(
    `
    select ?uri as ?resource, STR(?n) as ?nameOfGod, ?image, STR(?go) as ?GodOf,STR(?abode) as ?Abode, if(bound(?ge), STR(?ge), if(regex(?go,"God .*") , "Male","Female")) as ?Gender where {
      #Get only the Greek gods
      ?uri dbp:name ?n;
      dbp:godOf ?go;
      dbp:type ?t;
      #God of ?go :
      dbp:godOf ?go.
   
      #Get the image of the god
      optional{?uri dbo:thumbnail ?image}.
   
      #Abode of the god
      optional{
         ?uri dbp:abode ?a. 
         ?a rdfs:label ?abode.
         FILTER(lang(?abode)="en")
      }.
   
      #Gender of the god
      optional{?uri foaf:gender ?ge}.
   
      Filter(regex(?t,".*Greek.*") and regex(?n,".*${value}( |$)"))
   }
   `
    )
  },

  siblingsInfoQuery: function(value) {
    return (
    `
      SELECT DISTINCT STR(?sibling) as ?Sibling
      WHERE {
        ?uri dbp:name ?n;
        dbp:godOf ?go;
        dbp:type ?t.
        FILTER(regex(?t,".*Greek.*") and regex(?n,".*${value}( |$)"))

        {
        #Get the siblings if the dbp:sibling ?object is a string composed of the siblings (we split at each comma)
        VALUES ?N { 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30} #can split the siblings string into 20 different siblings
        ?uri dbp:siblings ?siblings.
        FILTER(!isBlank(?siblings) and isLiteral(?siblings))
        BIND(replace(?siblings, " and ", " ") as ?sibStr)
        BIND (concat("^([^,]*,){", str(?N) ,"} *") AS ?skipN)
        BIND (replace(replace(?sibStr, ?skipN, ""), ",.*$", "") AS ?sibling)
        }
        UNION 
        {
          #Get the siblings if the dbp:siblings ?object is a resource
          {?uri dbp:siblings ?siblings.}
          UNION
          {?siblings dbp:siblings ?uri.}

          ?siblings dbp:godOf ?go2;
          dbp:type ?t;
          dbp:name ?sibling.
          
          Filter(isLiteral(?sibling))
        }
      }`
    )
  }
};