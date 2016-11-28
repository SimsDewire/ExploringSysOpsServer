"use strict";

module.exports = function(app, upload, http, logger) {

	const databaseHandler = require('./../database/database.js');

	/** EXTERN SOURCES **/

	//To be called from an extern source that says: "These values are new".

	/* app.post("/extern/update-values/:sourceURL/:value", upload.array(), function(req, res)
	* PARAMETERS: source, the name of the datasource from where the data is sent.
	*						  value, the JSON object that contains the value which will be saved.
	*
	*	FUNCTION: The function of the call is that external sources can be able to send values to the database.
	*
	*	RETURNS: BSON containing the value that was sent.
	*
	*/
	app.post("/extern/update-values/", upload.array(), function(req, res) {
		try {
			const source = req.body.source.replace(/[^A-Za-z0-9]/g, '');
			const value = req.body.value;

			if (typeof value === 'undefined') {
				const error = databaseHandler.generateErrorObject("You have to specify a value!", "No value specified...");
				res.status(400).send(error);
			} else {
				const result = databaseHandler.AddSourceValue(value, source);

				let response = {};
				response["result"] = result;

				if (result.error) {
					res.status(400).send(result);
					logger.log('debug', result);
				} else
					res.status(200).send(response);
			}
		}
		catch(e) {
			let response = {};
			response["result"] = {error: 1, message: "Could not handle the request params"};
			res.status(400).send(response);
		}
	});


	/* app.post("/extern/update-values/", upload.array(), function(req, res, next)
	*	PARAMETERS: The call is a POST-call and wants these parameters: 
	*	Hostname("localhost"), port, path(path to source, after host. "/internal/source") and method("GET/POST osv.").
	*
	*	FUNCTION: The function of the call is so that the application can make requests external API to get data.
	*
	*	RETURNS: A BSON object that contains the object returned from the external source.
	*
	*/
	app.post("/extern/request-values/", upload.array(), function(req, res, next) {
		logger.log('debug', "CALL: ");

		//A JSON object that contains all data to access a remote API.
		const options = {
			hostname: req.body.sourceURL,
			port: req.body.port,
			path: req.body.path,
			method: req.body.method
		};
		//Writes in the conolse what was required. 
		logger.log('debug', options);
		
		//Require data from a specified source API, the data is stored in 'chunk'.
		const require = http.request(options, (result) => {			
			result.setEncoding('utf8')
			
			//Format the collectionname so it will not contain any special characters.
			const collectionName = (req.body.sourceURL + req.body.port + req.body.path).replace(/[^A-Za-z0-9]/g, '');

			//When data is recieved.
			result.on('data', (chunk) => {
				try{

					chunk = JSON.parse(chunk);

					const value = {value : chunk.result[0].value};

					//Logg the data-chunk and the collection-name.
					logger.log('debug', 'BODY: '+ chunk);
					logger.log('debug', 'COLLECTION NAME: ' +  collectionName);

					//Store the value of the chunk into the database and log the response to 'debug'.
					const dbResponse = databaseHandler.AddSourceValue(value, collectionName);
					logger.log('debug', "Database response: " + dbResponse);

					//Return the data-chunk to from where it was sent.
					res.status(200).send(chunk);

				} catch(e){
					res.status(400).send({result : {error : 1, message : "Path unavailable!"}});
				}
			});

			//When no more data is recieved.
			result.on('end', () => {
				logger.log('debug', 'No more data in response.');
			});
		});
		
		require.setTimeout(1500);

		//Message on timeout.
		require.on('timeout', (e) => {
			res.status(400).send({result : {error : 1, message : "Timeout occured!"}});
		});

		//Message on error.
		require.on('error', (e) => {
			if(!res._headerSent){
				res.status(400).send({result : {error : 1, message : e.message}});
			}
		});

		require.end();
	});
	



	/** INTERN SOURCES **/
	// get latest data, get list of plugins, get one plugins files(data, zip and what not).


	/* app.get("/intern/update-value-latest/:sourceURL/:numLimit", function(req, res)
	*	PARAMETERS: sourceURL, the name of the datasource where the data should be found.
	*				numLimit, the number of objects that should be returned.
	*	FUNCTION: latest values from a certain source, specified by the caller.
	*
	*	RETURNS: BSON containing the 'numLimit' amount of latest values.
	*/
	app.get("/intern/update-value-latest/:sourceURL/:numLimit", function(req, res) {
		const sourceURL = req.params.sourceURL;
		const numLimit = req.params.numLimit;

		const source = sourceURL.replace(/[^A-Za-z0-9]/g, '');

		// First check that numlimit actually is a valid and non-negative number before sending to database API
		const tempNum = parseInt(numLimit);
		if (isNaN(tempNum)) {
			logger.log('debug', "Specify a valid number for numLimit!");
			res.status(400).send({result : {error : 1, message : "Specify a valid number for numLimit!"} });
		} else if (tempNum < 0) {
			logger.log('debug', "Can't use a negative number!");
			res.status(400).send({result : {error : 1, message : "Can't use a negative number!"} });	
		}

		// Try to find value from database
		try {
			databaseHandler.GetSourceValueLatest(source, numLimit).then(function(result) {
				let response = {};
				response["result"] = result;

				res.status(200).send(response);
			});
		} catch(e) {
			res.status(400).send({result : {error : 1, message : "Something went wrong when finding latest value!"} });	
		}
	});


	/* app.get("/intern/update-values/:sourceURL/:from/:to", function(req, res)
	*	PARAMETERS: sourceURL, the name of the datasource where the data should be found.
	*							from, the start date of a given interval.
	* 			  		to, the end date of a given interval.
	*	FUNCTION: returns all the data from a certain interval that is specified by the caller.
	*
	*	RETURNS: BSON containing the result from the search. 
	*/
	app.get("/intern/update-values/", function(req, res) {
		logger.log('debug', req.params.sourceURL);

		let response = {};

		try {
			databaseHandler.FindSourceValue(new Date(req.query.from), 
											new Date(req.query.to), 
											req.query.sourceURL).then(function(result) {
												response["result"] = result;

												logger.log('debug', response);
												res.status(200).send(response);
											});
		} catch(e) {
			response["result"] = {error: 1, message : "Something went wrong!"};
			res.status(400).send(response);
		}
	});



	/* app.post("/intern/add-source", upload.array(), function(req, res){})
	*	PARAMETERS: POST-var source, the full url to the datasource.
	*
	*	FUNCTION: Add a source to the "Source"-collection containing url to the source.
	*
	*	RETURNS: BSON containing the object that was added and a HTTP status-code. 
	*/
	app.post("/intern/add-source", upload.array(), function(req, res) {
		let response = {};

		try {
			const source = {URL: req.body.source};
			source.URL = source.URL.replace(/[^A-Za-z0-9]/g, '');

			const result = databaseHandler.AddSource(source);

			response["result"] = result;

			if (typeof req.body.source === 'undefined' || source.URL == "") {
				const newResponse = databaseHandler.generateErrorObject("Could not add empty URL", "");
				logger.log('debug', newResponse);
				res.status(400).send(newResponse);
			} else	
				res.status(200).send(response);		
		} catch(e) {
			response["result"] = {error: 1, message : "Something went wrong!"};
			res.status(400).send(response);
		}
	});

}
 
