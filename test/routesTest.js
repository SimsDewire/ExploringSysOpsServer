process.env.NODE_ENV = 'test';

module.exports = function(request) {
	function testPOST(data) {
		describe("Testing route (POST): " + data.route, function() {

			for (var i in data.tests) {
				var test = data.tests[i];
			    it("Using params: " + JSON.stringify(test.params) + ", expecting: " + test.expectedValue, function(done) {
			        request
			        	.post(data.route)
			        	.type('form')
			        	.send(test.params)
			        	.expect('Content-Type', /json/)
			            .expect(200)
			            .end(function(err, res) {
			            	res.status.should.equal(200);
			            	res.body.error.should.equal(false);
			            	res.body.data.should.equal(test.expectedValue);
			            	done();
			        });
			    });
			}


		});
	}

	function testGET(data) {
		// Add parameters in such a way that they are added after / in the route
		var paramsStr = "";
		for (var i in data.params)
			paramsStr += ("/" + ((typeof data.params[i] == 'object') ? JSON.stringify(data.params[i]) : data.params[i]));

		var expectedResponse = (typeof data.expectedResponse == 'object') ? JSON.stringify(data.expectedResponse) : data.expectedResponse;

		describe("Testing route (GET): " + data.route, function() {
			it("Using: " + paramsStr + " - Expecting: " + expectedResponse, function(done) {
				request
			        .get(data.route + paramsStr)
			        .expect('Content-Type', /json/)
			        .expect(200)
			        .end(function(err, res) {
			        	res.status.should.equal(200);
			            res.error.should.equal(false);
			            //res.log.value.should.equal(expectedResponse.value);
			            done();
			        });
			});
		});
	}

/*
	for (var i=0; i<20; i++) {
		testPOST({route : "/addition",
				  tests: [ {params : {num1 : i, num2 : i},
				  expectedValue : i+i},
				  {params : {num1 : i+5, num2 : i+5},
				  expectedValue : i+10+i}]});
	}*/

	/*
		tests : [ {params: {source : "wwwtestse", value : "Evil test value"}, expectedValue : "Evil test value"},
				  {params: {source : "wwwtestse", value : ""}, expectedValue : ""},
				  {params: {source : "wwwtestse", value : "0000000s00000000"}, expectedValue : "0000000s0000000"}
	*/

	var strTestJSON = {
		route : "/extern/update-values",
		params : {source : "wwwtestse", data : {value:"FunnyValuez"}},
		expectedResponse : {value:"FunnyValuez"}
	};

	testGET(strTestJSON);


}