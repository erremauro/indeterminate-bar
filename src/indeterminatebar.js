(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.IndeterminateBar = factory();
  }
	
})(this, function() {
	// Create Element.remove() function if not exist in the browser
	if (!('remove' in Element.prototype)) {
	    Element.prototype.remove = function() {
	        if (this.parentNode) {
	            this.parentNode.removeChild(this);
	        }
	    };
	}

	// setInterval ID use to check on the loading progress percent
	var progressIntervalID = null;

	// Prepares the HTML dom elements for the progress bar
	var slider = document.createElement('div');
	var line = document.createElement('div');
	var subline = document.createElement('div');
	var subline2 = document.createElement('div');

	slider.className = 'slider';
	line.className = 'line';
	subline.className = 'subline';
	subline2.className = 'subline';

	slider.appendChild(line);
	slider.appendChild(subline);

	/**
	 * Get the width percent related to its parent for a given HTML element
	 * @param  {Element} elem - HTML Element
	 * @return {number} - Width percent related to its parent
	 */
	function getWidthPercent(elem) {
    var pa = elem.offsetParent || elem;
    return elem.offsetWidth / pa.offsetWidth;
	}

	var IndeterminateBar = {
		isStarted: false,
		isIndeterminate: false,
		events: {
			'start': [],
			'done': [],
			'indeterminate': []
		},
		config: {
			parent: 'progress-container',
			duration: 10
		}
	}

	/**
	 * Configure the progress bar.
	 * @param  {Object} opts IndeterminateBar options
	 */
	IndeterminateBar.configure = function(opts) {
		IndeterminateBar.config = Object.assign( IndeterminateBar.config, opts, {} )
		
		const parent = document.getElementById( IndeterminateBar.config.parent )

		if (IndeterminateBar.isStarted) {
			subline.style.animation = 'load ' + IndeterminateBar.config.duration + 's'
		}
		
		slider.remove();
		parent.appendChild(slider);
	}

	/**
	 * Start the progress bar. When the loading bar reaches the 100%
	 * the bar is updated to an undetermined bar.
	 */
	IndeterminateBar.start = function() {
		if (IndeterminateBar.isStarted) return;

		IndeterminateBar.isStarted = true;
		subline.style.animation = 'load ' + IndeterminateBar.config.duration + 's'
		subline.classList.add('load');		

		progressIntervalID = setInterval(function() {
			const percent = getWidthPercent( subline )

			if (percent > 0.999) {
				if (!IndeterminateBar.isIndeterminate) {
					IndeterminateBar.isIndeterminate = true
					IndeterminateBar.events['indeterminate'].forEach( event => event() )
				}

				slider.appendChild(subline2);
				subline.style.animation = '';
				subline.classList.remove('load');
				subline.classList.add('inc');
				
				clearInterval( progressIntervalID );
			}
		}, 500)

		IndeterminateBar.events['start'].forEach( event => event() )
	}

	/**
	 * Set the progress to 100% and stop.
	 */
	IndeterminateBar.done = function() {
		if ( !IndeterminateBar.isStarted ) return;

		IndeterminateBar.isStarted = false

		clearInterval( progressIntervalID )
		subline2.remove();
		subline.classList.remove( 'inc' )
		subline.style.animation = ''
		subline.style.width = '100%'

		IndeterminateBar.events['done'].forEach( event => event() )
	}

	/**
	 * Register events
	 * @param  {String}   event    Event name
	 * @param  {Function} callback Event function to be executed
	 */
	IndeterminateBar.on = function(event, callback) {
		IndeterminateBar.events[event].push(callback)
	}

	return IndeterminateBar
})