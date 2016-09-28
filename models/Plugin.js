var mongoose = require("mongoose");

var PluginSchema = new mongoose.Schema({
	pluginID: Number,
	source: String
});

// Force name of the collection to avoid standard naming
PluginSchema.set('collection', 'Plugins');

var PluginModel = mongoose.model('Plugin', PluginSchema);

module.exports = PluginModel;
