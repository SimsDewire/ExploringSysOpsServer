var appRouter = function(app, upload) {

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

	//To be called from an intern source to update the values to the headset.
	app.get("/intern/update-values/:sourceId/:intervall", function(req, res) {
		// Default latest value available
		console.log(req.params.sourceId + "\n" + req.params.intervall);
		res.end();
		// Otherwise values between:
			//req.query.from
			//req.query.to
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