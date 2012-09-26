function create(originalFunc) {
	var newMockContext = require('./partialMock/newMockContext');
	var expect = require('./partialMock/expect');
	var expectAnything = require('./partialMock/expectAnything');
	var verify = require('./partialMock/verify');
	var expectEmpty = require('./partialMock/expectEmpty');
	var mockContext = newMockContext(originalFunc);

	function mock() {
		var nothing;
		mockContext.arguments = arguments;		
		return mockContext.execute.apply(null,arguments);
	}

	mock.expect = function() {
		if (arguments.length == 0)
			return expectEmpty(mockContext);
		var args = [0,mockContext];
		for (var i = 0 ; i < arguments.length; i++) {
			args.push(arguments[i]);
		};
		return expect.apply(null,args);
	};

	mock.expectAnything = function() {
		var args  = [0,mockContext];
		return expectAnything.apply(null,args);
	};

	mock.verify = function() {
		var args = [mockContext];
		return verify.apply(null,args);
	};
	
	return mock;
}

module.exports  = create;

