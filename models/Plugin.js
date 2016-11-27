const mongoose = require("./mongooseExtended");

const PluginSchema = new mongoose.Schema({
	name : String,
	description : String,
	creator : String,
	version : String,
	pluginPath : String,
	webURL : String
}, {strict: "throw", versionKey: false});

// Force name of the collection to avoid standard naming
PluginSchema.set('collection', 'Plugin');

const PluginModel = mongoose.model('Plugin', PluginSchema);

module.exports = PluginModel;
