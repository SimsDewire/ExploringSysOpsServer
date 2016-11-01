process.env.NODE_ENV = 'test';

var should = require('should');

// Import the app
var app = require('./../app');

// Requiring test library
var request = require('supertest')(app);

// Require each test here to run in the testing process
require('./routesTest')(request);