process.env.NODE_ENV = 'test';

module.exports = function(request) {

	/* testGET(data)
	PARAMS: expected a JSON object as parameter, with the following attributes:
			route - The route to test, for example: route : "/extern/add"
			tests - An array containing different tests, this array contains JSON objects with the attributes: 'param' and 'expectedResponse'
							params - The parameters to use in the GET request. 
										Example: {a : 5, b : 7} will add /5/7 to the route

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
		describe("Testing route (GET): " + data.route, function() {

			for (var currentTest in data.tests) {
				var testCase = data.tests[currentTest];

				// Add parameters in such a way that they are added after / in the route
				var paramsStr = "";
				for (var i in testCase.params) paramsStr += ("/" + ((typeof testCase.params[i] == 'object') ? JSON.stringify(testCase.params[i]) : testCase.params[i]));

				it("- Using: " + paramsStr, function(done) {
					request
				        .get(data.route + paramsStr)
				        .end(function(err, res) {
				        	res.status.should.equal(200);
				            res.error.should.equal(false);
				            res.body.result.should.be.json;

				            // Loop trough each property of expectedResponse and check that they are correct
				            for (var val in testCase.expectedResponse)
				            	res.body.result[val].should.equal(testCase.expectedResponse[val]);

				            done();
				        });
				});
			}

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

	testGET({
		route : "/extern/update-values",
		tests: [{
				params : {source : "wwwtestse", data : {value:"FunnyValuez"}},
				expectedResponse : {value:"FunnyValuez"}
				},

				{
				params : {source : "wwwtestse", data : {value:"A"}},
				expectedResponse : {value:"A"}
				}
			]
	});


	testPOST({
		route : "/addition",
		tests: [{
			 	params : {num1 : 15, num2 : 25},
			  	expectedResponse : {result : 15+25}
			  	},
			  
			  	{
			  	params : {num1 : 77, num2 : 11},
				expectedResponse : {result : 77+11}
				}
			]
	});
}