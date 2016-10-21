var appRouter = function(app, upload, http) {

	var databaseHandler = require('./../database/database.js');

	//Test for GET
	app.get("/", function(req, res) {
		console.log("Hello World\n"+req.ip+"\n");
		res.send("Hello World");
	});


	/** EXTERN SOURCES **/

	//To be called from an extern source that says: "These values are new".

	/* app.get("/extern/update-values/:sourceURL/:value", function(req, res)
	*PARAMETERS: source, the name of the datasource from where the data is sent.
	*						 value, the JSON object that contains the value which will be saved.
	*
	*	FUNCTION: The function of the call is that external sources can be able to send values to the database.
	*
	*	RETURNS: BSON containing the value that was sent.
	*
	*/
	app.get("/extern/update-values/:source/:value", function(req, res) {
		console.log("source: " + req.params.source + "\nvalue: " + req.params.value);

		var log = databaseHandler.AddSourceValue(JSON.parse(req.params.value), req.params.source);
		var response = {};
		
		response["log"] = log;

		console.log(response);
		res.status(200).send(response);
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
		console.log("CALL: ");

		//A JSON object that contains all data to access a remote API.
		var options = {
			hostname: req.body.sourceURL,
			port: req.body.port,
			path: req.body.path,
			method: req.body.method
		};
		//Writes in the conolse what was required. 
		console.log(options);

		//Require data from a specified source API, the data is stored in 'chunk'.
		var require = http.request(options, (result) => {
			console.log('STATUS:', result.statusCode);
			console.log('HEADERS:', JSON.stringify(result.headers));
			
			result.setEncoding('utf8');
			
			result.on('data', (chunk) => {
				console.log('BODY:', chunk);
				res.status(200).send(chunk);
			});

			result.on('end', () => {
				console.log('No more data in response.');
				res.status(200).end();
			});
		});

		//Message on error.
		require.on('error', (e) => {
			console.log('problem with request:', e.message);
			res.status(400).end("error: " + e.message)
		});
		require.end();
	});
	


	/** INTERN SOURCES **/
	
	//get latest data, get list of plugins, get one plugins files(data, zip and what not).

	/* app.get("/intern/update-value-latest/:sourceURL", function(req, res)
	*	PARAMETERS: sourceURL, the name of the datasource where the data should be found.
	*
	*	FUNCTION: returns the latest value from a certain source specified by the caller.
	*
	*	RETURNS: BSON containing the latest value.
	*/
	app.get("/intern/update-value-latest/:sourceURL/:numLimit", function(req, res){
		console.log("sourceURL: " + req.params.sourceURL + "\nnumLimit" + req.params.numLimit);

		databaseHandler.GetSourceValueLatest(req.params.sourceURL, req.params.numLimit).then(function(result) {
											var response = {};
											response["result"] = result;

											console.log(response);
											res.status(200).send(response);
										});
	});


	/* app.get("/intern/update-values/:sourceURL/:from/:to", function(req, res)
	*	PARAMETERS: sourceURL, the name of the datasource where the data should be found.
	*							from, the start date of a given interval.
	* 			  		to, the end date of a given interval.
	*	FUNCTION: returns all the data from a certain interval that is specified by the caller.
	*
	*	RETURNS: BSON containing the result from the search. 
	*/
	app.get("/intern/update-values/:sourceURL/:from/:to", function(req, res) {
		console.log(req.params.sourceURL);
		databaseHandler.FindSourceValue(new Date(req.params.from), 
										new Date(req.params.to), 
										req.params.sourceURL).then(function(result) {
											var response = {};
											response["result"] = result;

											console.log(response);
											res.status(200).send(response);
										});
	});

	/** TESTING **/

	//For testing the system
	app.get("/test", function(req, res) {});



	//Test for GET with parameter
	app.get("/get/:id", function(req, res) {
		console.log(req.body+"\n"+req.ip+"\n");
		res.send("your id is: " + req.params.id);
	});

	//Test for POST
	app.post('/posting/', upload.array(), function (req, res, next) {
		console.log(req.body);
		console.log(req.ip);
		
		res.json(req.body);
	});

}
 
module.exports = appRouter;