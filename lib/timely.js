// Timely v0.0.1
// Lightweight and easy to use timing decorators for javascript functions
// (c) 2012 Aron Kornhall
// Timely is freely distributable under the MIT license.

(function() {
	var root = this;

	// Synchronous
	var timely = function(func, context) {
		var timedFunc = function() {
			var begin,
				end,
				result;

			context = context || this;
			begin = Date.now();
			result = func.apply(context, arguments);
			end = Date.now();
			timedFunc.time = end - begin;
			return result;
		};
		return timedFunc;
	};

	// Asynchronous
	timely.async = function(func, context) {
		var	slice = Array.prototype.slice,
			timedFunc = function() {
				var args = slice.call(arguments), // Convert arguments to a real array
					begin,
					end,
					cb,
					timedCb;

				context = context || this;
				cb = args.pop(); // Pop old callback
				timedCb = function() { // Create a new callback
					end = Date.now();
					timedFunc.time = end - begin;
					cb.apply(context, arguments);
				}

				args.push(timedCb); // Push new callback to args
				begin = Date.now();
				result = func.apply(context, args);
			};
		return timedFunc;
	};

	// Export
	if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
		// Node
		exports = module.exports = timely;
	} else {
		// Browser
		root['timely'] = timely; // for Closure Compiler
	}

}).call(this);
