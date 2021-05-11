(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Stopwatch = factory();
  }
	
})(this, function() {
	/**
	 * Static Stopwatch to calculate live elapsed time for the progress timer
	 * @type {Object}
	 */
	var Stopwatch = {
		_start: new Date(),
		_end: new Date(),
		_diff: new Date(1970,1,1,0,0,0),
		start: function() {
			Stopwatch._start = new Date()
		},
		stop: function() {
			Stopwatch._update();
			Stopwatch._start = new Date()
			Stopwatch._end = new Date()
		},
		reset: function() {
			Stopwatch.start()
			Stopwatch._update()
		},
		_update: function() {
			Stopwatch._end = new Date()
			Stopwatch._diff = new Date(
				Stopwatch._end.getTime() - Stopwatch._start.getTime()
			);
		},
		getTime: function() {
			Stopwatch._update();
			var minutes = ( '0' + Stopwatch._diff.getMinutes() ).slice(-2)
			var seconds = ( '0' + Stopwatch._diff.getSeconds() ).slice(-2)
			return  minutes + ':' + seconds + '';
		},
	}

	return Stopwatch
})