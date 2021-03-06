const rp = require('request-promise'),
session = require('express-session');

// Translate a text into different languages
module.exports = async (sender_psid, documents, lang) => {
  var result;
  try {
    // Get approximate number of sentences.
    t = 0;
    for (i = 0 ; i < documents.length ; ++i){
      if(documents[i] === "."){
        t++;
      }
    }
    // Go over summary to remove non-sense text.
    var options = {
      method: 'GET',
      url: 'https://meaningcloud-summarization-v1.p.rapidapi.com/summarization-1.0',
      qs: {txt: documents, sentences: t-1},
        headers: {
        'x-rapidapi-host': 'meaningcloud-summarization-v1.p.rapidapi.com',
        'x-rapidapi-key': '1390cea5damshd570a5f82509daep1cb503jsncbc3c74853d5',
        accept: 'application/json',
        useQueryString: true
      }
    };
    result2 = await(rp(options));
    // Translate the text with the preferred language.
    var options = {
      uri: `https://microsoft-azure-translation-v1.p.rapidapi.com/translate`,
      qs: {
        "from": "en",
        "to": lang,
        "text": documents
      },
      headers: {
        "x-rapidapi-host": "microsoft-azure-translation-v1.p.rapidapi.com",
        "x-rapidapi-key": "1390cea5damshd570a5f82509daep1cb503jsncbc3c74853d5",
        "accept": "application/json",
        "useQueryString": true
      },
      json: true
    };  
    result = await(rp(options));
    s = "";
    // Format the results for better audio and readability
    if (result){
    for (i = 69 ; i < result.length - 10 ; ++i){
      s += result[i];
      if(result[i].includes(".")){
        s += "<br>";
      }
    }}
    // Write the text to an EJS file to avoid encoding issues.
    fs.writeFile(`./views/${sender_psid}/index.ejs`, s, function (err) {
      if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("File is Online."); 
    });
  }
  catch (e) {
    console.log(e);
  }
return result;
}