"use strict";

process.env.NODE_ENV = 'test';

module.exports = function(request) {

	/* testRequest(data)
	PARAMS: expected a JSON object as parameter, with the following attributes:
			route - The route to test, for example: route : "/extern/add"
			tests - An array containing different tests, this array contains JSON objects with the attributes: 'param' and 'expectedResponse'
							params - The parameters to use in the GET request. 
										Example: {a : 5, b : 7} will add /5/7 to the route
							query - GET variables, the same example as above will add ?a=5&b=7

							expectedResponse - A JSON object containing all expected values the tested route should return as response
							   					Example: {A : 8, B : 9} will expect that the response contains a JSON object with AT LEAST A=8 and B=9 as attributes

		Complete example (two different test cases):
		{
		route : "/extern/update-values",
		tests: [{
				params : {source : "wwwtestse", data : {value:"Test Case A"}},
				expectedResponse : {value:"Test Case A"}
				},

				{
				params : {source : "wwwtestse", data : {value:"Test B"}},
				expectedResponse : {value:"Test B"}
				}
			]
		}
	*/
	function testRequest(data) {
		let tempData = [];
		const type =( data.type || "GET").toLowerCase();

		data.tests.forEach(function(testCase) {

			it(testCase.description, function(done) {
				// Add parameters in such a way that they are added after / in the route
				let paramsStr = "";
				if(typeof testCase.params == "object")
					for (let i in testCase.params) 
						paramsStr += ("/" + ((typeof testCase.params[i] == 'object') ? JSON.stringify(testCase.params[i]) : testCase.params[i]));
				if(typeof testCase.query == "object") {
					paramsStr = "?";
					for (let i in testCase.query) {
						if(paramsStr !== "?")	
							paramsStr += "&";
						paramsStr += i + "=" + encodeURIComponent(((typeof testCase.query[i] == 'object') ? JSON.stringify(testCase.query[i]) : testCase.query[i]));
					} 
				}

				request[type](data.route + paramsStr)
		        	//.type('form')
		        	.send(testCase.body)
			        .end(function(err, res) {
			        	res.status.should.equal(testCase.expectedStatusCode || 200);

			        	// TODO: This should not be an error but maybe a warning that we get an error?
			            // res.error.should.equal(false);

			            res.body.result.should.be.json;

			            // Loop trough each property of expectedResponse and check that they are correct
			            for (let val in testCase.expectedResponse) {
			            	if (typeof testCase.expectedResponse[val] == "undefined")
			            		res.body.result.should.not.have.property(val);
			            	else
			            		res.body.result[val].should.eql(testCase.expectedResponse[val]);
			            }

			            testCase.result = res.body.result;
			            testCase.error = err;
			            done();
			        });
			});
		});
	}


	// --------------------------
	// TEST ROUTE #1
	// --------------------------
	// Tests for /extern/update-values
	const updateValuesTestData = {
		route : "/extern/update-values",
		type : "POST",
		tests: [{
			description : "Testing a regular value without spaces",
			body: {source: "wwwtestse", value : {value:"FunnyValuez"}},
			expectedResponse : {value:"FunnyValuez"}
		},
		{
			description : "Testing a sentence with spaces and some special chars",
			body: {source: "wwwtestse", value : {value:"A random sentence with some random words! :)"}},
			expectedResponse : {value:"A random sentence with some random words! :)"}
		},
		{
			description : "Testing a value containing numbers without spaces",
			body: {source: "wwwtestse", value : {value:"0001000593827123"}},
			expectedResponse : {value:"0001000593827123"}
		},
		{
			description : "Mixing words, special chars and swedish characters",
			body: {source: "wwwtestse", value : {value:"Mixing some words (åäö) and numbers like 010 43824 19!## - -"}},
			expectedResponse : {value:"Mixing some words (åäö) and numbers like 010 43824 19!## - -"}
		},
		{
			description : "Empty value",
			body: {source: "wwwtestse", value : {value:""}},
			expectedResponse : {value:""}
		},
		{
			description : "Empty spaces in value",
			body: {source: "wwwtestse", value : {value:"      "}},
			expectedResponse : {value:"      "}
		},
		{
			description : "Using collection name containing special chars",
			body: {source: "www.test.se", value: {value:"Collection named with special characters like a URL"}},
			expectedResponse : {value:"Collection named with special characters like a URL"}
		},
		{
			description : "No value attribute specified",
			body: {source: "wwwtestse"},
			expectedResponse : {error: 1},
			expectedStatusCode: 400
		},
		{
			description : "No body variables/attributes specified at all (no source or value)",
			body: {},
			expectedResponse : {error: 1},
			expectedStatusCode: 400
		}]
	};

	describe("Testing route (POST): /extern/update-values", function () {
		testRequest(updateValuesTestData);
	});



	// --------------------------
	// TEST ROUTE #2
	// --------------------------
	// Tests for /intern/update-values
	describe("Testing route (GET): /intern/update-values", function () {
		const updateValuesTestDataIntern = {
			route : "/intern/update-values",
			tests: [{
				description : "Check that all values from previous tests is returned in specified date range",
				query : {sourceURL : "wwwtestse", from : "", to : ""},
				expectedResponse : {}
			}]
		};

		before(function(done) {
			// Get all createdAt responses from the last test
			let responseData = updateValuesTestData.tests.filter(function (test) {
				return !test.result.error;
			})
			.map(function(test) {
				return test.result;
			});
			let createdDates = responseData.map(function (test) {
				return new Date(test.createdAt);
			});

			// Need to set some attributes of the test data here
			updateValuesTestDataIntern.tests.forEach(function (test) {
				test.expectedResponse = responseData;
				const dateFrom = new Date(Math.min.apply(null, createdDates));
				const dateTo = new Date(Math.max.apply(null, createdDates));
				test.query.from = dateFrom.toISOString();
				test.query.to = dateTo.toISOString();
			});

			done();
		});

		testRequest(updateValuesTestDataIntern);
	});


	// Quick-TODO: Clear the wwwtestse table so it doesn't persist after test is done?



	// --------------------------
	// TEST ROUTE #3
	// --------------------------
	// Tests for /intern/add-source
	const addSourceTestData = {
		route : "/intern/add-source",
		type : "POST",
		tests: [{
			description : "Adding source www.test.se",
			body: {source: "www.test.se"},
			expectedResponse : {URL : "wwwtestse"}
		},
		{
			description : "Adding source wwwtestse",
			body: {source: "wwwtestse"},
			expectedResponse : {URL : "wwwtestse"}
		},
		{
			description : "Adding source with SPACES in name",
			body: {source: "www test se"},
			expectedResponse : {URL : "wwwtestse"}
		},
		{
			description : "Adding source with numbers",
			body: {source: "192.168.0.1"},
			expectedResponse : {URL : "19216801"}
		},
		{
			description : "Adding EMPTY source",
			body: {source: ""},
			expectedResponse : {error : 1},
			expectedStatusCode : 400
		},
		{
			description : "Adding source without specifying an URL",
			body: {},
			expectedResponse : {error : 1},
			expectedStatusCode : 400
		}]
	};

	describe("Testing route " + addSourceTestData.route + " (" + addSourceTestData.type + ")", function () {
		testRequest(addSourceTestData);
	});



	// --------------------------
	// TEST ROUTE #4
	// --------------------------
	// Tests for /intern/update-value-latest/:sourceURL/:numLimit
	const updateValueLatestTestData = {
		route : "/intern/update-value-latest",
		type : "GET",
		tests: [{
			description : "Getting the first value (numLimit = 1)",
			params: {sourceURL: "wwwtestse", numLimit : 1},
			expectedResponse : {} // TODO: Might want to check value from Test #2 later, MAYBE...
		},
		{
			description : "Getting the first 15 values (numLimit = 15)",
			params: {sourceURL: "wwwtestse", numLimit : 15},
			expectedResponse : {}
		},
		{
			description : "Using a number in string form (numLimit = \"1\")",
			params: {sourceURL: "wwwtestse", numLimit : "1"},
			expectedResponse : {}
		},
		{
			description : "Using a negative number as numLimit (numLimit = -5)",
			params: {sourceURL: "wwwtestse", numLimit : -5},
			expectedResponse : {error : 1},
			expectedStatusCode : 400
		},
		{
			description : "Using a string value containing non-numbers as numLimit (numLimit = \"hellodawg\")",
			params: {sourceURL: "wwwtestse", numLimit : "hellodawg"},
			expectedResponse : {error : 1},
			expectedStatusCode : 400
		}]
	};

	describe("Testing route " + updateValueLatestTestData .route + " (" + updateValueLatestTestData .type + ")", function () {
		testRequest(updateValueLatestTestData );
	});



	// --------------------------
	// TEST ROUTE #5
	// --------------------------
	// Tests for /extern/request-values/
	const requestValueTestData = {
		route : "/extern/request-values/",
		type : "POST",
		tests: [{
			description : "Calling '/intern/update-value-latest/wwwtestse/1' as if it were an external API.",
			body: {sourceURL: "localhost", port: 3000, path: "/intern/update-value-latest/wwwtestse/1", method: "GET"},
			expectedResponse : {}
		},
		{
			description : "Calling API with incorrect path.",
			body: {sourceURL: "localhost", port: 3000, path: "/intern/update-value-latest/1", method: "GET"},
			expectedResponse : {},
			expectedStatusCode : 400
		},
		{
			description : "Calling API with empty path.",
			body: {sourceURL: "localhost", port: 3000, path: "", method: "GET"},
			expectedResponse : {},
			expectedStatusCode : 400
		},
		{
			description : "Calling API with wrong(closed) port.",
			body: {sourceURL: "localhost", port: 4000, path: "/intern/update-value-latest/wwwtestse/1", method: "GET"},
			expectedResponse : {},
			expectedStatusCode : 400
		},
		{
			description : "Calling API with wrong source URL.",
			body: {sourceURL: "abds", port: 3000, path: "/intern/update-value-latest/wwwtestse/1", method: "GET"},
			expectedResponse : {},
			expectedStatusCode : 400
		},
		{
			description : "Calling API with wrong method(POST instead of GET).",
			body: {sourceURL: "localhost", port: 3000, path: "/intern/update-value-latest/wwwtestse/1", method: "POST"},
			expectedResponse : {},
			expectedStatusCode : 400
		},
		{
			description : "Calling API with everything wrong.",
			body: {sourceURL: "localhost", port: 3000, path: "/intern/update-value-latest/1", method: "POST"},
			expectedResponse : {},
			expectedStatusCode : 400
		}
		]
	};

	describe("Testing route " + requestValueTestData .route + " (" + requestValueTestData .type + ")", function () {
		testRequest(requestValueTestData );
	});
}