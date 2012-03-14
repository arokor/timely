// Nodeunit tests for Timely
// Run with:
//  >nodeunit test (in parent dir)

var timely = require('../lib/timely');


// Test synchronous calls
exports.sync = {
	testTimeFunction: function (test) {
		// Fibonacci
		function fib(n) {
			if (n <= 2) return n;
			return fib(n - 1) + fib(n - 2);
		}

		// Timed Fibonacci
		var fibT = timely(fib),
			n = 35,

			exp = fib(n),
			act = fibT(n);

		test.strictEqual(act, exp);
		test.ok(typeof fibT.time === 'number', 'Expected numeric time');
		test.done();
	},
	testTimeMethod: function(test) {
		// Object
		var o = {
				x : 5,
				f : function(n) {
					var i, result = 0;
					for (i=0; i<n; i += this.x) {
						result += i;
					}
					return result;
				}
			},
			fTcontext,
			n = 10000000,
			exp = o.f(n),
			act1, act2;
		
		// Timed method added to object
		o.fT = timely(o.f);
		act1 = o.fT(n);
		test.strictEqual(act1, exp);
		test.ok(typeof o.fT.time === 'number', 'Expected numeric time');

		// Timed funciton with context
		fTcontext = timely(o.f, o);
		act2 = fTcontext(n);
		test.strictEqual(act2, exp);
		test.ok(typeof fTcontext.time === 'number', 'Expected numeric time');
		test.done();
	}
};


// Test asynchronous calls
exports.async = {
	testTimeFunction: function (test) {
		// Async function
		function f(n, cb) {
			setTimeout(function() { cb(n); }, 100);
		}

		// Timed async function
		var fT = timely.async(f),
			n = 42;

		f(n, function(exp) {
			fT(n, function(act) {
				test.strictEqual(act, exp);
				test.ok(typeof fT.time === 'number', 'Expected numeric time');
				test.done();
			});
		});
	},
	testTimeMethod: function(test) {
		// Object
		var o = {
				x : 5,
				f : function(n, cb) {
					setTimeout((function(that) {
						return function() {
							var i, result = 0;
							for (i=0; i<n; i += that.x) {
								result += i;
							}
							cb(result);
						};
					})(this), 100);
				}
			},
			fTcontext,
			n = 10000000;
		
		// Timed method added to object
		o.fT = timely.async(o.f);

		// Timed funciton with context
		fTcontext = timely.async(o.f, o);

		// Tests
		o.f(n, function(exp) {
			o.fT(n, function(act1) {
				test.strictEqual(act1, exp);
				test.ok(typeof o.fT.time === 'number', 'Expected numeric time');

				// Test with context
				fTcontext(n, function(act2) {
					test.strictEqual(act2, exp);
					test.ok(typeof fTcontext.time === 'number', 'Expected numeric time');
					test.done();
				});
			});
		});
	}
};
