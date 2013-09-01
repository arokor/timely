// Demo of timely
// Run with:
//  >node demo.js
// Output:
//  >fib(35) = 14930352, time: 201ms
//  >wait(42) = 42, time: 101ms

var timely = require('./lib/timely'),
  when = require('when'),

	// Synchronous function (Fibonacci)
	fib = function(n) {
		if (n <= 2) return n;
		return fib(n - 1) + fib(n - 2);
	},

	// Asynchronous function
	wait = function(n, cb) {
		setTimeout(function() {
			cb(n);
		}, 100);
	},

  // Asynchronous function returning a promise
  wait2 = function(n) {
    var defer = when.defer();
    setTimeout(function() {
      defer.resolve(n);
    }, 100);
    return defer.promise;
  },

	// Create a timed verion of the Synchronous funciton
	fibT = timely(fib),
	// Create a timed verion of the Asynchronous function
	waitT = timely.async(wait),
  // Create a timed verion of the Asynchronous function returning a promise
  waitT2 = timely.promise(wait2),
	
	// Result of Synchronous function
	resultSync;

// Call Synchronous function
resultSync = fibT(35);
//Output results of Synchronous function. fibT.time contains the time used for the last call
console.log('fib(35) = ' + resultSync + ', time: ' + fibT.time + 'ms');

// Call Asynchronous function
waitT(42, function(resultAsync) {
	//Output results of Asynchronous function. fibT.time contains the time used for the last call
	console.log('wait(42) = ' + resultAsync + ', time: ' + waitT.time + 'ms');
});

// Call Asynchronous function returning a promise
waitT2(42).then(function(resultAsync) {
  //Output results of Asynchronous function. waitT2.time contains the time used for the last call
  console.log('wait2(42) = ' + resultAsync + ', time: ' + waitT2.time + 'ms');
});
