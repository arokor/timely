// Timely v0.0.2
// Lightweight and easy to use timing decorators for javascript functions
// (c) 2013 Aron Kornhall
// Timely is freely distributable under the MIT license.

(function() {
	var root = this;

	// Synchronous
	var timely = function(func, context) {
    var callCount = 0;
    var totalCalltime = 0;
		var timedFunc = function() {
			context = context || this;
			var begin = Date.now();
			var result = func.apply(context, arguments);
			var end = Date.now();
      var callTime = end - begin;

      totalCalltime += callTime;
      callCount++;

			timedFunc.time = callTime;
			timedFunc.totalCalltime = totalCalltime;
			timedFunc.meanTime = totalCalltime / callCount;
			timedFunc.callCount = callCount;
			return result;
		};
		return timedFunc;
	};

	// Asynchronous
	timely.async = function(func, context) {
    var callCount = 0;
    var totalCalltime = 0;
		var	slice = Array.prototype.slice,
			timedFunc = function() {
				var args = slice.call(arguments); // Convert arguments to a real array

				context = context || this;
				var cb = args.pop(); // Pop old callback
				var timedCb = function() { // Create a new callback
					var end = Date.now();
          var callTime = end - begin;
          totalCalltime += callTime;
          callCount++;

          timedFunc.time = callTime;
	   timedFunc.totalCalltime = totalCalltime;
          timedFunc.meanTime = totalCalltime / callCount;
	   timedFunc.callCount = callCount;
					cb.apply(context, arguments);
				};
				args.push(timedCb); // Push new callback to args
				var begin = Date.now();
				return func.apply(context, args);
			};
		return timedFunc;
	};

	// Promise
	timely.promise = function(func, context) {
    var callCount = 0;
    var totalCalltime = 0;
		var	slice = Array.prototype.slice,
    timedFunc = function() {
      context = context || this;
      var begin = Date.now();
      return func.apply(context, arguments).then(function(ret){
        var end = Date.now();
        var callTime = end - begin;
        totalCalltime += callTime;
        callCount++;

        timedFunc.time = callTime;
	 timedFunc.totalCalltime = totalCalltime;
	 timedFunc.meanTime = totalCalltime / callCount;
        timedFunc.callCount = callCount;
        return ret;
      });
    };
		return timedFunc;
	};

  // Expose timely as node module, amd module or global
  if(typeof module !== 'undefined' && module.exports){
    module.exports = timely;
  }else{
    if(typeof define === 'function' && define.amd) {
      define([], function() {
        return timely;
      });
    }else{
		  root['timely'] = timely;
    }
  }
}).call(this);
