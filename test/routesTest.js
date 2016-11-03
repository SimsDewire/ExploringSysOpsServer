process.env.NODE_ENV = 'test';

module.exports = function(request) {
	function testPOST(data) {
		describe("Testing route (POST): " + data.route, function() {

			for (var i in data.tests) {
				var testCase = data.tests[i];

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
			            		res.body.data.should.equal(testCase[val].expectedValue);

			            	done();
			        });
			    });
			}


		});
	}

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
			  	expectedValue : {result : 15+25}
			  	},
			  
			  	{
			  	params : {num1 : 77, num2 : 11},
				expectedValue : {result : 77+11}
				}
			]
	});
}