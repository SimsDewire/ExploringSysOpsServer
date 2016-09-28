var mongoose = require("mongoose");

var DataHistorySchema = new mongoose.Schema({
	type: String,
	sender: String, // TODO: Key value instead of String?
	data: String,
	time: { type: Date, default: Date.now }
});

// Force name of the collection to avoid standard naming
DataHistorySchema.set('collection', 'DataHistory');

var DataHistoryModel = mongoose.model('DataHistory', DataHistorySchema);

module.exports = DataHistoryModel;
