_a_
===
_Mocking framework_ + _testing framework_. 


The mocking framework can be used in any JavaScript testing framework.

The testing framework has a short and concise bdd syntax - with reusable contexts.

__how to install__

```
npm install a
```



__if you want the test framework, install it globally too__

```
npm install a -g
```



_Mocking_
===================

Mocking a function 
------------------

__partial mock__

```
var original = function() {
	return 'realValue';
}

var mock = require('a').mock(original);
original = mock;
mock.expect().return('fake');

original(); //returns 'fake'
original(); //returns 'realValue'
```



__strict mock__

```
var mock = require('a').mock();
mock.expect().return('fake');

mock(); //returns 'fake'
mock(); //throws unexpected arguments
```



__expecting arguments__

```
var mock = require('a').mock();
mock.expect('testValue1').return('fake1');
mock.expect('testValue2').return('fake2');

mock('testValue1'); //returns 'fake1'
mock('testValue2'); //returns 'fake2'
mock(); //throws unexpected arguments
mock('foo'); //throws unexpected arguments
```



__expecting multiple arguments__

```
var mock = require('a').mock();
mock.expect('firstArg1', 'secondArg1').return('fake1');
mock.expect('firstArg2', 'secondArg2').return('fake2');


mock('firstArg1', 'secondArg1'); //returns 'fake1'
mock('firstArg2', 'secondArg2'); //returns 'fake2'
mock('foo'); //throws unexpected arguments
mock('foo', 'bar'); //throws unexpected arguments
```

__expecting array__

```
var mock = require('a').mock();
mock.expect(['a','b']).return('fake1');
mock.expect(['a','b').return('fake2');
mock.expect(['c','d').return('fake3');

mock(['a','b']); //returns 'fake1'
mock(['a','b']); //returns 'fake2'
mock(['c','d']); //returns 'fake3'
mock(['a','b']); //throws unexpected arguments
mock(['foo', 'bar']); //throws unexpected arguments
```

__expecting struct__

```
var mock = require('a').mock();
var obj = {};
mock.expect({a : 1}).return('fake1');
mock.expect({a : 2}).return('fake2');
mock.expect({a : 2, b : {c : 'foo', d : ['me', 'too']}}).return('fake3');
mock.expect(obj).return('fake4');
mock.expect({}).return('will never happen');

mock({a : 'x'}); //throws unexpected arguments
mock({a : 1}); //returns 'fake1'
mock({a : 2}); //returns 'fake2'
mock({a : 2, b : {c : 'foo', d : ['me', 'too']}}); //returns 'fake3'
mock(obj);  //returns 'fake3'
mock({});  //throws unexpected arguments
```

__repeats__

```
var mock = require('a').mock();
mock.expect().return('fake').repeat(2);

mock(); //returns 'fake'
mock(); //returns 'fake'
mock(); //throws unexpected arguments
```

__infinite repeats__

```
var mock = require('a').mock();
mock.expect().return('fake').repeatAny();

mock(); //returns 'fake'
mock(); //returns 'fake'
mock(); //returns 'fake'...
```


__ignoring arguments__

```
var mock = require('a').mock();
mock.expectAnything().return('fake1');

mock('someRandomValue'); //returns 'fake1'
mock(); //throws unexpected arguments
```

__ignore alias__

```
var mock = require('a').mock();
mock.ignore().return('fake1'); //same as expectAnything

mock('someRandomValue'); //returns 'fake1'
mock(); //throws unexpected arguments
```


__throwing exceptions__

```
var mock = require('a').mock();
var error = new Error('invalid operation');
mock.expect().throw(error);
mock.expect().return('fake');

mock(); //throws error
mock(); //returns 'fake'
```

__intercepting__

```
var mock = require('a').mock();
mock.expect('testValue').whenCalled(onCalled).return('fake1');

function onCalled(arg) {
	//arg == 'testValue'
}

mock('testValue'); //returns 'fake1'
mock(); //throws unexpected arguments
```

__verify (fail)__

```
var mock = require('a').mock();
mock.expect('testValue1').return('fake1');
mock.expect('testValue2').return('fake2');

mock('testValue1'); //returns 'fake1'
mock.verify(); //throws mock has 1 pending functions
```

__verify (success)__

```
var mock = require('a').mock();
mock.expect('testValue1').return('fake1');
mock.expect('testValue2').return('fake2');

mock('testValue1'); //returns 'fake1'
mock('testValue2'); //returns 'fake2'
mock.verify(); //returns true
```

__returning void (compact syntax)__

```
var mock = require('a').mock();
mock.expect('testValue1');
mock.expect('testValue2').repeat(2);

mock('testValue1'); //returns undefined
mock('testValue2'); //returns undefined
mock('testValue2'); //returns undefined
mock.verify(); //returns true
```

__..is equivalent to ..__
```
var mock = require('a').mock();
mock.expect('testValue1').return();
mock.expect('testValue2').return().repeat(2);

mock('testValue1'); //returns undefined
mock('testValue2'); //returns undefined
mock('testValue2'); //returns undefined
mock.verify(); //returns true
```

__reset mock__
```
var original = function() {
	return 'realValue';
}

var mock = require('a').mock(original);
original = mock;
mock.expect().return('fake');
mock.reset();

original(); //returns 'realValue'
```


__strict mock - advanced scenario__

```
var mock = require('a').mock();
mock.expect('testValue').ignore().whenCalled(onCalled).return('fake1');

function onCalled(arg,callback) {
	//arg == 'testValue'
	//callback == foo
}

function foo() {	
}


mock('testValue', foo); //returns 'fake1'
mock.verify() //returns true
mock('testValue',foo); //throws unexpected arguments
```

Mocking require 
----------------

__expectRequire__

```
var fakeDep = {};

var expectRequire = require('a').expectRequire;
expectRequire('./realDep').return(fakeDep);

require('./realDep'); //returns fakeDep
require('./realDep'); //returns realDep (behaves like a partial mock)
```

__requireMock (compact syntax)__

```
var requireMock = require('a').requireMock;
var fakeDep = requireMock('./realDep'); //returns a strict mock

require('./realDep'); //returns fakeDep
require('./realDep'); //returns realDep
```

__..is equivalent to ..__

```
var mock = require('a').mock();
var expectRequire = require('a').expectRequire;

var fakeDep = mock; 
expectRequire('./realDep').return(fakeDep);

require('./realDep'); //returns fakeDep
require('./realDep'); //returns realDep
```

__reset mocks for require__

```
var fakeDep = {};

var expectRequire = require('a').expectRequire;
expectRequire('./realDep').return(fakeDep);
expectRequire.reset();

require('./realDep'); //returns realDep
```

__..is equivalent to ..__

```
var requireMock = require('a').requireMock;
var fakeDep = requireMock('./realDep'); //returns a strict mock
requireMock.reset(); //is an alias for expectRequire.reset()

require('./realDep'); //returns realDep

```
Mocking an object
-----------------
__partial object mock__

```
function newCustomer(_name) {
	var c = {};
	
	c.getName = function () 
	{
		return _name;
	};

	return c;
}

var customer = newCustomer('Alfonzo The Real');
var customerMock = mock(customer);

customerMock.getName.expect().return('Johnny Fake');

customer.getName(); //returns Johnny Fake
customer.getName(); //returns Alfonzo The Real
customerMock.verify(); //returns true
```

Mocking promises
-----------------
__mocking resolve__

```
var a = require('a');

var promise = a.then(); //mocked promise

promise.then(success,error);
promise.resolve('success');

function success(arg) {
	console.log(arg);//success
}

function error(e) {
	//will not happen
}
```

__mocking resolve (alternative syntax)__

```
var a = require('a');

var promise = a.then(); //mocked promise

promise.then(success,error);
promise('success');

function success(arg) {
	console.log(arg);//success
}

function error(e) {
	//will not happen
}
```

__mocking reject__

```
var a = require('a');

var promise = a.then();

promise.then(success,error);
promise.reject(new Error('error'));

function success(arg) {
	//will not happen
}

function error(e) {
	console.log(e.stack);//will happen
}
```

__mocking reject (alternative syntax)__

```
var a = require('a');

var promise = a.then();

promise.then(success,error);
promise(null,new Error('error'));

function success(arg) {
	//will not happen
}

function error(e) {
	console.log(e.stack);//will happen
}
```

_A test framework_
===================
_A_ test framework is a simplistic, magic-free library providing unit-testing facilities with a compact, bdd-style syntax. 

In contrast to other bdd-style test frameworks, however, it doesn't allow nesting suites in each other in order to test the SUT(subject under test) in different states. Instead, the framework relies on folder structure to describe the state which the SUT currently is. Suite names are generated based on their filenames. As a result there will be many small test files instead of few big ones with test suites nested in each other.

Test setup -- the "Arrange-Act" part of suites, is separated from the "Assert" part. This way the same setup can be used across different suites. Test setups can, of course, be chained.


Examples below can be found here: https://github.com/alfateam/a_demo

Example
---------
The test runner ( _when_ ) will search for all files named when*.js in current directory and below.

Given the following file structure

- demo/	
	- counter.js
	- counter_specs/
		- new/
			- increment.js
			- when_incremented.js
		- new.js
		- when_new.js
	
__counter.js__

```
module.exports = function () {
	var counter = {
		value: 0,
		increment: function() { value++; }
	};
	
	return counter;
}
```

__counter_specs/new.js__

```
function act(c) {
	var createCounter = require('../counter');
	c.sut = createCounter();
}
module.exports = act;
```

__counter_specs/when_new.js__

```
var c = {}; //test context object
var when = require('a').when;

when('./new', c). //set up
	it('should be an object').
		assertEqual('object', typeof c.sut)
	it('should have value equal to zero').
		assertEqual(0, c.sut.value).
	it('should fail just for fun').
		assertFail('error message');

```

__counter_specs/new/increment.js__

```
function act(c) {
	c.sut.increment();
}
act.base = '../new';
module.exports = act;
```

__counter_specs/new/when_incremented.js__

```
var c = {};
var when = require('a').when;

when('./increment', c).
	it('should have value equal to 1').
		assertEqual(1, c.sut.value);

```

In demo directory run _when_
	
	user@localhost:~/a_demo $ when

	 » counter_specs » new
	
	  ✓ should be an object
	  ✓ should have value equal to zero
	  ✘ should fail just for fun
	
	 » counter_specs » new » increment
	
	  ✓ should have value equal to 1
	
	========== Summary =============

	counter_specs » new
	  ✘ should fail just for fun
	
	AssertionError: error message
    	at retval.assertFail (/home/user/a_demo/node_modules/a/when/it.js:14:11)
    	at Object.test (/home/user/a_demo/node_modules/a/when/test_invoker.js:5:3)
    	at Object.retval.assertFail (/home/user/a_demo/node_modules/a/when/it.js:13:5)
    	at Object.<anonymous> (/home/user/a_demo/counter_specs/when_new.js:11:3)
    	at Module._compile (module.js:449:26)
    	at Object.Module._extensions..js (module.js:467:10)
    	at Module.load (module.js:356:32)
    	at Function.Module._load (module.js:312:12)
    	at Module.require (module.js:362:17)
    	at require (module.js:378:17)
	------------

	suites: 2, passed: 3, failed: 1

Release Notes
---------------
__0.4.7__  
Executable test runner "when" is deprecated. Use "a" instead.  
Inconclusive tests are accounted as failed in exit code.  
__0.4.6__  
Fixed memory leak in test runner.  
__0.4.5__  
Display stack trace of inconclusive suites.  
Use dependency [deferred][2] instead of [promise][3].  
__0.4.4__  
Introduced promise mocks.  
Tests with failing setup are reported as inconclusive.  
Bugfix: Test names no longer converted to lowercase.  
__0.4.3__  
Can reset expectations on mocks by mock.reset.  
Renamed expectRequire.clear to expectRequire.reset. Same goes for for requireMock.  
__0.4.2__  
Can clear expectations on require by using expectRequire.clear.  
__0.4.1__  
"When" can accept function instead of separate act file. See example in [demo][1] repo.  
__0.4.0__  
Cleaner output on failed assertions.  
__0.3.9__  
Can inherit act by convention. See examples in [demo][0] repo.  
__0.3.8__  
Cleaner stack trace on mock errors.  
__0.3.7__  
Test path can be sent as argument to test runner.  
If no path is specified, the test runner will run from current directory.  
Example: ```when c:/devel/foo/testFolder```  
__0.3.6__  
Exit code is equal to number of failing tests.  
__0.3.5__  
Tests files are run in hierarchical order from top to bottom.  
__0.3.4__  
Cache was cleared at wrong time. This could lead to overflow when running large amount of tests.  
Make sure you update globally (npm update a -g) to get this fix, not only the local dependency.  
__0.3.3__  
Error in documentation about structs.  
__0.3.2__  
Mocks can be set up to throw.  
__0.3.1__  
"when" deletes all cached modules before executing. This ensures tests are isolated.  
ignore is alias for expectAnything.  
"When" can resolve act by camcelCase convention. If test class is named "whenFoo.js", it will assume "foo.js" is the act.  

__0.3.0__  
expectArray is deprecated, use expect instead.  
expect now handles structs - equality is acheived when same propertyNames and equal leaf properties.

__0.2.9__   
"When" can resolve act by convention. If test class is named "when_foo.js", it will assume "foo.js" is the act.  
Example, given when_foo.js:  
```
var c = {};
var when = require('a').when;

when(c). //equivalent to: when('./foo',c)....
	it('should have value equal to 1').
		assertEqual(1, c.sut.value);

```
[0]:https://github.com/alfateam/a_demo
[1]:https://github.com/alfateam/a_demo/blob/master/assert_specs/when_assertions.js
[2]:https://www.npmjs.org/package/deferred
[3]:https://www.npmjs.org/package/promise