// Demo of timely
// Run with:
//  >node demo.js
// Output:
//  >fib(35) = 14930352, time: 201ms
//  >wait(42) = 42, time: 101ms

var timely = require('./lib/timely'),

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

	// Create a timed verion of the Synchronous funciton
	fibT = timely(fib),
	// Create a timed verion of the Asynchronous function
	waitT = timely.async(wait),
	
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
