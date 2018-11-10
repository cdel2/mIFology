const  GoogleSearch = require('google-search')
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

/*credentials and API settings*/
//Google API
const googleSearch = new GoogleSearch({
    key: 'AIzaSyALjVcdWyjEGOSQYeNVcSfMSH8Ad8skQuY',
    cx: '011311593262593075698:yu5va13zddu'
});

//Watson API
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2018-03-16',
    iam_apikey: 'tOoqgWF90q1hT_RIsm_HjKrLjORmLIkdDSkj47baGwnR',
    url: 'https://gateway-syd.watsonplatform.net/natural-language-understanding/api'
});


function getURLsFromGoogle(query) {
    return new Promise((resolve, reject) => {

        googleSearch.build({
            q: query,
            num: 10, // Number of search results to return between 1 and 10, inclusive
            //siteSearch: "http://kitaplar.ankara.edu.tr/" // Restricts results to URLs from a specified site
            }, function(error, urls) {
                if (error) throw error
                resolve(urls)
        });
    }
)}

function getURIsFromWatson(url) { 
    var res = "";
    console.log("url",url); 
    const parameters = {
        'url': url,
        'features': {
          'concepts': {
            'limit': 3
          }
        }
    };
    naturalLanguageUnderstanding.analyze(parameters, function(error, response) {
        //if (error) console.log(error)
        //console.log("response", response)
        if(response !== null)  res = JSON.stringify(response, null, 2);
        console.log("res", res)
    });

    return res;
}

module.exports = {getURLsFromGoogle, getURIsFromWatson}