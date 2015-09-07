/*
* OVERVIEW: Implement a CalculatorService that supports the following http operations:
* 		GET /calculator/sum?op1=<num>&op2=<num>
*		POST /calculator/sum and response body is a json object {"op1":"<num1>","op2":"<num2>"}
*		
*		Both GET/POST opertions should return 200 code on success and the response body should be the
*		sum of the 2 numbers
*
* ERROR CASES: Handle all error cases including:
*		Any Url other than /calculator/sum should return 404. 
*		Return bad request if op1 and op2 are not numbers.

* NOTES: Ensure you are starting the nodejs http server by running node CalculatorHttpServer.js before running the tests.
*/

var http = require('http');
var url = require('url');
var querystring = require('querystring');
var PORT = 3000;
var req_url = "/calculator/sum";

function validateURL(url) {
    if(url.substring(0,url.lastIndexOf("/")+4) != req_url){
        return false;
    }
    return true;
}

function getQueryParams(request, queryParams, url, bodyStr, response) {
    if (request.method == 'GET') {
        queryParams = querystring.parse(url.substring(url.indexOf("?") + 1));
    } else if (request.method == 'POST') {
        queryParams = JSON.parse(bodyStr);
    } else {
        response.end("Unsupported request method : " + request.method);
    }
    return queryParams;
}

function handleRequest(request, response){
    var bodyStr = '';

    request.on('data', function (chunk) {
        bodyStr += chunk.toString();
    });

    request.on('end', function() {
        var queryParams;
        var url = request.url;
        var isUrlValid = validateURL(url);
        if(isUrlValid){
            queryParams = getQueryParams(request, queryParams, url, bodyStr, response);
            var sum = parseInt(queryParams.op1) + parseInt(queryParams.op2);
            if(isNaN(sum)){
                response.statusCode = 400;
                response.end("Bad Request");
            }
            response.end(sum.toString());
        }else{
            response.statusCode = 404;
            response.end("Invalid URL");
        }
    });
}
// Add your code to startup http server and process request here.
var server = http.createServer(handleRequest);

server.listen(PORT, function(){
   console.log("server listening on port: "+PORT);
});


