'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';
	var query = 'empty query';
        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
		query = requestBody.result.resolvedQuery;
	        query += ' ';
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
            }
        }
	    var google = require('googleapis');
	    var customsearch = google.customsearch('v1');
	    const CX = '000451306854787167072:pahciazb7zi';
	    const API_KEY = 'AIzaSyAhdnz5r_s_ycLVShXNdrjtlnXaCPIVMS8';
	    const SEARCH = query;

	    customsearch.cse.list({ cx: CX, q: SEARCH, auth: API_KEY }, function (err, resp) {
	    if (err) {
  		  return console.log('An error occured', err);
		     }
		 	    
		    
 	    // Got the response from custom search.
 	    console.log('Result: ' + resp.searchInformation.formattedTotalResults);
 	    if (resp.items && resp.items.length > 0) {
	       
	    console.log('You can visit on: ' + resp.items[0].title + ' ' + resp.items[0].snippet + ' ' + resp.items[0].link );
		    	    
	    }
		    
	    var sreed =	resp.items[0].title + ' ' + resp.items[0].snippet + ' ' + resp.items[0].link
	    return res.json({
            speech: sreed ,
            displayText:sreed ,
            source: 'apiai-webhook-IOTecosystem'
	    });
	    });
	    
        
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
		
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
