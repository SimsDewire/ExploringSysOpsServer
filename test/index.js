process.env.NODE_ENV = 'test';

const should = require('should');

// Import the app
const app = require('./../app');

// Requiring test library
const request = require('supertest')(app);

// Require each test here to run in the testing process
require('./routesTest')(request);