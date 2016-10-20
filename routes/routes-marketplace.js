var appRouter = function(app, upload, http) {

	var databaseHandler = require('./../database/database.js');

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
}
 
module.exports = appRouter;