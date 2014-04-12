// Nodeunit tests for Timely

var timely = require('../lib/timely');
var when = require('when');


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
	},
	testMeanTime: function (test) {
		// Fibonacci
		function fib(n) {
			if (n <= 2) return n;
			return fib(n - 1) + fib(n - 2);
		}

		// Timed Fibonacci
		var fibT = timely(fib);
		
    fibT(20);
    var t20 = fibT.time;
    var tm1 = fibT.meanTime;
    fibT(30);
    var t30 = fibT.time;
    var tm2 = fibT.meanTime;

		test.ok(typeof tm1 === 'number', 'Expected numeric mean time');
		test.ok(typeof tm2 === 'number', 'Expected numeric mean time');
    test.strictEqual(tm1, t20, 'Expected mean time after one call to equal time of call');
		test.ok(tm2 > t20 && tm2 < t30, 'Expected mean time to be between min and max');
		test.done();
	},
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
	},
	testMeanTime: function (test) {
		// Async function
		function f(n, cb) {
			setTimeout(function() { cb(n); }, n);
		}

		// Timed async function
		var fT = timely.async(f);

		fT(10, function(exp) {
      var t10 = fT.time;
      var tm1 = fT.meanTime;
			fT(20, function(act) {
        var t20 = fT.time;
        var tm2 = fT.meanTime;
        test.ok(typeof tm1 === 'number', 'Expected numeric mean time');
        test.ok(typeof tm2 === 'number', 'Expected numeric mean time');
        test.strictEqual(tm1, t10, 'Expected mean time after one call to equal time of call');
        test.ok(tm2 > t10 && tm2 < t20, 'Expected mean time to be between min and max');
				test.done();
			});
		});
	},
};

// Test promised calls
exports.promise = {
	testTimeFunction: function (test) {
		// Async function
		function f(n) {
      var defer = when.defer();
			setTimeout(function() { defer.resolve(n); }, 100);
      return defer.promise;
		}

		// Timed async function
		var fT = timely.promise(f),
			n = 42;

		f(n).then(function(exp) {
			fT(n).then(function(act) {
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
      f : function(n) {
        var _this = this;
        var defer = when.defer();
        setTimeout(function() {
          var i, result = 0;
          for (i=0; i<n; i += _this.x) {
            result += i;
          }
          defer.resolve(result);
        }, 100);
        return defer.promise;
      }
    };
		var fTcontext;
		var n = 10000000;
		
		// Timed method added to object
		o.fT = timely.promise(o.f);

		// Timed funciton with context
		fTcontext = timely.promise(o.f, o);

		// Tests
		o.f(n).then(function(exp) {
			o.fT(n).then(function(act1) {
				test.strictEqual(act1, exp);
				test.ok(typeof o.fT.time === 'number', 'Expected numeric time');

				// Test with context
				fTcontext(n).then(function(act2) {
					test.strictEqual(act2, exp);
					test.ok(typeof fTcontext.time === 'number', 'Expected numeric time');
					test.done();
				});
			});
		});
	},
	testMeanTime: function (test) {
		// Async function
		function f(n) {
      var defer = when.defer();
			setTimeout(function() { defer.resolve(n); }, n);
      return defer.promise;
		}

		// Timed async function
		var fT = timely.promise(f),
			n = 42;

		fT(10).then(function(exp) {
      var t10 = fT.time;
      var tm1 = fT.meanTime;
			fT(20).then(function(act) {
        var t20 = fT.time;
        var tm2 = fT.meanTime;
        test.ok(typeof tm1 === 'number', 'Expected numeric mean time');
        test.ok(typeof tm2 === 'number', 'Expected numeric mean time');
        test.strictEqual(tm1, t10, 'Expected mean time after one call to equal time of call');
        test.ok(tm2 > t10 && tm2 < t20, 'Expected mean time to be between min and max');
				test.done();
			});
		});
	},
};
