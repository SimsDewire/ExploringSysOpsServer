process.env.NODE_ENV = 'test';

module.exports = function(request) {
	var responseData = [];

	/* testGET(data)
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
	function testGET(data) {
		var tempData = [];

		data.tests.forEach(function(testCase) {

			it(testCase.description, function(done) {
				// Add parameters in such a way that they are added after / in the route
				var paramsStr = "";
				if(typeof testCase.params == "object")
					for (var i in testCase.params) 
						paramsStr += ("/" + ((typeof testCase.params[i] == 'object') ? JSON.stringify(testCase.params[i]) : testCase.params[i]));
				if(typeof testCase.query == "object") {
					paramsStr = "?";
					for (var i in testCase.query) {
						if(paramsStr !== "?")	
							paramsStr += "&";
						paramsStr += i + "=" + encodeURIComponent(((typeof testCase.query[i] == 'object') ? JSON.stringify(testCase.query[i]) : testCase.query[i]));
					} 
				}

				request
			        .get(data.route + paramsStr)
			        .end(function(err, res) {
			        	res.status.should.equal(testCase.expectedStatusCode || 200);

			        	// TODO: This should not be an error but maybe a warning that we get an error?
			            // res.error.should.equal(false);

			            res.body.result.should.be.json;

			            // Loop trough each property of expectedResponse and check that they are correct
			            for (var val in testCase.expectedResponse) {
			            	if (typeof testCase.expectedResponse[val] == "undefined")
			            		res.body.result.should.not.have.property(val);
			            	else
			            	// if (!res.body.result.hasOwnProperty(val))
			            	// 	res.body.result.should.have.property(val);
			            	// else
			            		res.body.result[val].should.eql(testCase.expectedResponse[val]);
			            }

			            testCase.result = res.body.result;
			            testCase.error = err;
			            done();
			        });
			});
		});
	}

	/* testPOST(data)
	PARAMS: expected a JSON object as parameter, with the following attributes:
			route - The route to test, for example: route : "/extern/add"
			tests - An array containing different tests, this array contains JSON objects with the attributes: 'param' and 'expectedResponse'
							params - The parameters to send in the POST request. Example: {a : 5, b : 7} will send a=5&b=7

							expectedResponse - A JSON object containing all expected values the tested route should return as response
							   					Example: {A : 8, B : 9} will expect that the response contains a JSON object with AT LEAST A=8 and B=9 as attributes
	*/
	function testPOST(data) {
		describe("Testing route (POST): " + data.route, function() {

			for (var test in data.tests) {
				var testCase = data.tests[test];

			    it("Using params: " + JSON.stringify(testCase.params), function(done) {
			        request
			        	.post(data.route)
			        	.type('form')
			        	.send(testCase.params)
			        	.expect('Content-Type', /json/)
			            .end(function(err, res) {
			            	res.status.should.equal(200);
			            	res.error.should.equal(false);

			            	for (var val in testCase.expectedResponse)
			            		res.body.result[val].should.equal(testCase.expectedResponse[val]);

			            	done();
			        });
			    });
			}


		});
	}

	// --------------------------
	// TEST ROUTE #1
	// --------------------------
	// Tests for /extern/update-values
	var updateValuesTestData = {
		route : "/extern/update-values",
		tests: [{
			description : "Testing a regular value without spaces",
			query: {source: "wwwtestse", value : {value:"FunnyValuez"}},
			expectedResponse : {value:"FunnyValuez"}
		},
		{
			description : "Testing a sentence with spaces and some special chars",
			query: {source: "wwwtestse", value : {value:"A random sentence with some random words! :)"}},
			expectedResponse : {value:"A random sentence with some random words! :)"}
		},
		{
			description : "Testing a value containing numbers without spaces",
			query: {source: "wwwtestse", value : {value:"0001000593827123"}},
			expectedResponse : {value:"0001000593827123"}
		},
		{
			description : "Mixing words, special chars and swedish characters",
			query: {source: "wwwtestse", value : {value:"Mixing some words (åäö) and numbers like 010 43824 19!## - -"}},
			expectedResponse : {value:"Mixing some words (åäö) and numbers like 010 43824 19!## - -"}
		},
		{
			description : "Empty value",
			query: {source: "wwwtestse", value : {value:""}},
			expectedResponse : {value:""}
		},
		{
			description : "Empty spaces in value",
			query: {source: "wwwtestse", value : {value:"      "}},
			expectedResponse : {value:"      "}
		},
		{
			description : "Using collection name containing special chars",
			query: {source: "www.test.se", value: {value:"Collection named with special characters like a URL"}},
			expectedResponse : {value:"Collection named with special characters like a URL"}
		},
		{
			description : "No value attribute specified",
			query: {source: "wwwtestse"},
			expectedResponse : {error: 1},
			expectedStatusCode: 400
		},
		{
			description : "No query variables/attributes specified at all (no source or value)",
			query: {},
			expectedResponse : {error: 1},
			expectedStatusCode: 400
		}]
	};

	describe("Testing route (GET): /extern/update-values", function () {
		testGET(updateValuesTestData);
	});



	// --------------------------
	// TEST ROUTE #2
	// --------------------------
	// Tests for /intern/update-values
	describe("Testing route (GET): /intern/update-values", function () {
		var updateValuesTestDataIntern = {
			route : "/intern/update-values",
			tests: [{
				description : "Check that all values from previous tests is returned in specified date range",
				query : {sourceURL : "wwwtestse", from : "", to : ""},
				expectedResponse : {}
			}]
		};

		before(function(done) {
			// Get all createdAt responses from the last test
			responseData = updateValuesTestData.tests.filter(function (test) {
				return !test.result.error;
			})
			.map(function(test) {
				return test.result;
			});
			createdDates = responseData.map(function (test) {
				return new Date(test.createdAt);
			});

			// Need to set some attributes of the test data here
			updateValuesTestDataIntern.tests.forEach(function (test) {
				test.expectedResponse = responseData;
				var dateFrom = new Date(Math.min.apply(null, createdDates));
				var dateTo = new Date(Math.max.apply(null, createdDates));
				test.query.from = dateFrom.toISOString();
				test.query.to = dateTo.toISOString();
			});

			done();
		});

		testGET(updateValuesTestDataIntern);
	});


	// Quick-TODO: Clear the wwwtestse table so it doesn't persist after test is done?
}