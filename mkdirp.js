const mkdirp = require('mkdirp');
    
// Create folder logs/
mkdirp('logs', function (err) {
    if (err) 
    	console.error("Could not create logs/ (", err, ")");
    else 
    	console.log('Created folder logs/');
});
