// Include all the modules requeired
var express = require('express');
var child_process = require('child_process');
var fs = require('fs');

// The path to the git repositories locally on this machine
const git_path = (process.env.GIT_REPOS_PATH || '/opt/git/');

module.exports = function(app){

	// Instantiate the git server with this command:
	//  git daemon --export-all --base-path=/opt/git/
	const git_daemon = child_process.spawn('git', ['daemon', '--export-all', '--base-path=' + git_path]);

	git_daemon.stdout.on('data', function(data) {
		console.log(data); // Log something if the git server says something
	});
	git_daemon.stderr.on('data', function(data) {
		console.log(data); // Log something if the git reserer has errors
	});

	// This request returns a list of all available repositories
	app.get('/repos', function(request, response) {
		var repos = fs.readdirSync(git_path);
		var host = request.conn
		// Respond with a similar json object as the github api does but only the parameters we need
		response.end(JSON.stringify(repos.map(function(repo) {
			return {
				// The full repository name
				full_name: 'pi-' + repo,
				// html url to enable cloning of the repo
				html_url: 'git://' + request.get('host').split(':')[0] + '/' + repo
			};
		})));
	});

};
