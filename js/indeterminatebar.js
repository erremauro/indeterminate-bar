(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.IndeterminateBar = factory();
  }
	
})(this, function() {

	/**
	 * Inject polyfills for IE
	 */
	function createPolyfills() {
		if (typeof Object.assign !== 'function') {
		  // Must be writable: true, enumerable: false, configurable: true
		  Object.defineProperty(Object, "assign", {
		    value: function assign(target, varArgs) { // .length of function is 2
		      'use strict';
		      if (target === null || target === undefined) {
		        throw new TypeError('Cannot convert undefined or null to object');
		      }

		      var to = Object(target);

		      for (var index = 1; index < arguments.length; index++) {
		        var nextSource = arguments[index];

		        if (nextSource !== null && nextSource !== undefined) { 
		          for (var nextKey in nextSource) {
		            // Avoid bugs when hasOwnProperty is shadowed
		            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
		              to[nextKey] = nextSource[nextKey];
		            }
		          }
		        }
		      }
		      return to;
		    },
		    writable: true,
		    configurable: true
		  });
		}

		// Create Element.remove() function if not exist in the browser
		if (!('remove' in Element.prototype)) {
		    Element.prototype.remove = function() {
		        if (this.parentNode) {
		            this.parentNode.removeChild(this);
		        }
		    };
		}
	}

	createPolyfills()

	// setInterval ID used to check on the loading progress percent
	var progressIntervalID = null

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

	/**
	 * Manages Events
	 * @type {Object}
	 */
	var EventManager = {
		events: {
			'start': [],
			'done': [],
			'change': []
		},
		exists: function( eventName ) {
			return Object.keys( EventManager.events ).indexOf( eventName ) !== -1
		},
		callEvents: function( eventName ) {
			if ( !EventManager.exists( eventName ) ) return
			EventManager.events[ eventName ].forEach( function(event) { event() } )
		},
		register: function( eventName, callback ) {
			if ( !EventManager.exists( eventName ) ) return
			EventManager.events[ eventName ].push( callback )
		},
		deregister: function( eventName, callback ) {
			var id = EventManager.events[ eventName ].indexOf( callback )
			if (id !== -1) EventManager.events[ eventName ].splice(id, 1)
		}
	}

	/**
	 * IndeterminateBar
	 * @type {Object}
	 */
	var IndeterminateBar = {
		isStarted: false,
		isIndeterminate: false,
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
			IndeterminateBar.isIndeterminate = false
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
					EventManager.callEvents( 'change' )
				}

				slider.appendChild(subline2);
				subline.style.animation = '';
				subline.classList.remove('load');
				subline.classList.add('inc');
				
				clearInterval( progressIntervalID );
			}
		}, 500)

		EventManager.callEvents( 'start' )
	}

	/**
	 * Set the progress to 100% and stop.
	 */
	IndeterminateBar.done = function() {
		if ( !IndeterminateBar.isStarted ) return;

		IndeterminateBar.isStarted = false
		IndeterminateBar.isIndeterminate = false

		clearInterval( progressIntervalID )
		subline2.remove();
		subline.classList.remove( 'inc' )
		subline.style.animation = ''
		subline.style.width = '100%'

		EventManager.callEvents( 'done' )
	}

	/**
	 * Register events
	 * @param  {String}   event    Event name
	 * @param  {Function} callback Event function to be executed
	 */
	IndeterminateBar.on = function(event, callback) {
		EventManager.register( event, callback )
	}

	return IndeterminateBar
})
