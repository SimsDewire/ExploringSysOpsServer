var mongoose = require("mongoose");

/**
 * INPUT: Either a JSON object based on the PluginSchema or one argument per attribute (name, description, etc...)
 * 
 */
mongoose.Model.prototype.setValues = function(jsonInstance) {
	// If one function argument is present copy the relevant values from the object
	if(arguments.length == 1) {
		for(var column in this.schema.obj)
			this[column] = jsonInstance[column];
	}
	else {
		// Asume all jsonRepresentation are specified from function arguments
		var i = 0;
		for(var column in this.schema.obj)
			this[column] = arguments[i++];
	}
}

module.exports = mongoose;
