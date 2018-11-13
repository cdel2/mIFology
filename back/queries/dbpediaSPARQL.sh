#!/bin/bash

: ${SPARQL_QUERY_PATH?"Please precise SPARQL_QUERY file path by adding SPARQL_QUERY=your_sparql_query_path"}
OUTPUT_FORMAT=${OUTPUT_FORMAT:-json}

curl -H "Accept: application/$OUTPUT_FORMAT" -g --data-urlencode query@$SPARQL_QUERY_PATH http://dbpedia.org/sparql 2>/dev/null |\
jq '.["results"]["bindings"]'
