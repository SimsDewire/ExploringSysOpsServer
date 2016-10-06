var appRouter = function(app, upload) {

	var databaseHandler = require('./../database/database.js');

	//Test for GET
	app.get("/", function(req, res) {
		console.log("Send worked: Hello World is shown\n"+req.ip+"\n");
		res.send("Hello World");
	});


	/** EXTERN SOURCES **/

	function requestExternSource(source) {
		// body...
	}
	//To be called from an extern source that says: "These values are new".
	app.get("/extern/update-values/:values", function(req, res) {requestExternSource(req.params.values)});


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
											console.log(result);
											res.send(result);
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
											console.log(result);
											res.send(result);
										});
	});


	/** MARKETPLACE **/

	// Responds with a list of the 50 first plugins
	app.get("/marketplace/plugin/list/", function(req, res) {});
	// Responds with a list of the n first plugins
	app.get("/marketplace/plugin/list/:n", function(req, res) {});

	// Responds with a list of plugins matching the query
	app.get("/marketplace/plugin/search/:query", function(req, res) {});

	// Responds with the plugin data
	app.get("/marketplace/plugin/install/:pluginId", function(req, res) {});


	// Uploads a plugin to the server (low priority)
	app.post("/marketplace/plugin/", authenticate, function(req, res) {});

	// Removes a plugin from the server (low priority)
	app.delete("/marketplace/plugin/:pluginId", authenticate, function(req, res) {});

	// Login a registered user
	app.put("/user/login", function(req, res) {});


	function authenticate(req, res, next) {
		if(authenticated) {
			next();
		}
		res.end('{error: "Failed to authenticate"}');
	}


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