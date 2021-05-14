(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    root.IndeterminateBar = factory()
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
		      'use strict'
		      if (target === null || target === undefined) {
		        throw new TypeError('Cannot convert undefined or null to object')
		      }

		      var to = Object(target)

		      for (var index = 1; index < arguments.length; index++) {
		        var nextSource = arguments[index]

		        if (nextSource !== null && nextSource !== undefined) { 
		          for (var nextKey in nextSource) {
		            // Avoid bugs when hasOwnProperty is shadowed
		            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
		              to[nextKey] = nextSource[nextKey]
		            }
		          }
		        }
		      }
		      return to
		    },
		    writable: true,
		    configurable: true
		  })
		}

		// Create Element.remove() function if not exist in the browser
		if ( !('remove' in Element.prototype) ) {
	    Element.prototype.remove = function() {
        if ( this.parentNode ) {
          this.parentNode.removeChild( this )
        }
	    }
		}

		// Add prepend support for IE11 and Edge
		(function ( arr ) {
		  arr.forEach(function ( item ) {
		    if ( item.hasOwnProperty( 'prepend' ) ) {
		      return
		    }
		    Object.defineProperty( item, 'prepend', {
		      configurable: true,
		      enumerable: true,
		      writable: true,
		      value: function prepend() {
		        var argArr = Array.prototype.slice.call( arguments ),
		          docFrag = document.createDocumentFragment()

		        argArr.forEach(function ( argItem ) {
		          var isNode = argItem instanceof Node
		          docFrag.appendChild( 
		          	isNode 
		          		? argItem 
		          		: document.createTextNode( String( argItem ) )
	          		)
		        })

		        this.insertBefore( docFrag, this.firstChild )
		      }
		    })
		  })
		})([
			Element.prototype, 
			Document.prototype, 
			DocumentFragment.prototype
		])
	}

	createPolyfills()

	// setInterval ID used to check on the loading progress percent
	var progressIntervalID = null

	// Prepares the HTML dom elements for the progress bar
	var slider = document.createElement('div')
	var line = document.createElement('div')
	var subline = document.createElement('div')
	var subline2 = document.createElement('div')

	slider.className = 'slider'
	line.className = 'line'
	subline.className = 'subline'
	subline2.className = 'subline'

	slider.appendChild(line)
	slider.appendChild(subline)

	/**
	 * Get the width percent related to its parent for a given HTML element
	 * @param  {Element} elem - HTML Element
	 * @return {number} - Width percent related to its parent
	 */
	function getWidthPercent(elem) {
    var pa = elem.offsetParent || elem
    return elem.offsetWidth / pa.offsetWidth
	}

	/**
	 * Update the color informations for the IndirectBar HTML elements
	 * @param  {string} color Color string
	 */
	function updateComponentColor(color) {
		line.style.backgroundColor = color
		subline.style.backgroundColor = color
		subline.style.boxShadow = "0 0 10px " + color + ", 0 0 5px " + color
		subline2.style.boxShadow = "0 0 10px " + color + ", 0 0 5px " + color
		subline2.style.backgroundColor = color
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
	 * Controls the IndeterminateBar states
	 * @type {Object}
	 */
	var state = {
		removed: true,
		started: false,
		indeterminate: false
	}

	/**
	 * IndeterminateBar
	 * @type {Object}
	 */
	var IndeterminateBar = {
		version: '1.1.0',
		config: {
			parent: 'body',
			color: '#65ca02',
			duration: 10
		}
	}

	/**
	 * Configure the progress bar.
	 * @param  {Object} opts IndeterminateBar options
	 */
	IndeterminateBar.configure = function(opts) {
		IndeterminateBar.config = Object.assign( IndeterminateBar.config, opts, {} )
		
		// if the user tries to reconfigure the component while it's started
		// we "restart" it, by resetting its state
		if ( IndeterminateBar.isStarted() ) {
			subline.style.animation = 'load ' + IndeterminateBar.config.duration + 's'
			state.indeterminate = false
			EventManager.callEvents( 'start' )
		}

		updateComponentColor( IndeterminateBar.config.color )
		IndeterminateBar.create()
	}

	/**
	 * Start the progress bar. When the loading bar reaches the 100%
	 * the bar is updated to an indetermined bar.
	 */
	IndeterminateBar.start = function() {
		if ( IndeterminateBar.isStarted() ) return
		if ( IndeterminateBar.isRemoved() ) {
			console.error(
				'[IndeterminateBar] You are trying to start a removed progress bar! ' +
				'Use IndeterminateBar.create() to re-inject the bar into the DOM. ' +
				'Also reconfiguring the bar will recreate it.'
			)
			return
		}

		state.started = true
		subline.style.animation = 'load ' + IndeterminateBar.config.duration + 's'
		subline.classList.add( 'load' )	

		progressIntervalID = setInterval(function() {
			var percent = getWidthPercent( subline )

			if (percent > 0.999) {
				if ( !IndeterminateBar.isIndeterminate() ) {
					state.indeterminate = true
					EventManager.callEvents( 'change' )
				}

				slider.appendChild(subline2)
				subline.style.animation = ''
				subline.classList.remove( 'load' )
				subline.classList.add( 'inc' )
				
				clearInterval( progressIntervalID )
			}
		}, 500)

		EventManager.callEvents( 'start' )
	}

	/**
	 * Set the progress to 100% and stop.
	 */
	IndeterminateBar.done = function() {
		if ( !IndeterminateBar.isStarted() ) return

		state.started = false
		state.indeterminate = false

		clearInterval( progressIntervalID )
		subline2.remove()
		subline.classList.remove( 'inc' )
		subline.style.animation = ''
		subline.style.width = '100%' 

		EventManager.callEvents( 'done' )
	}

	/**
	 * Create the IndeterminateBar in the DOM
	 */
	IndeterminateBar.create = function() {
		if ( !IndeterminateBar.isRemoved() ) return

		var parent = document.querySelectorAll( IndeterminateBar.config.parent )[0]

		if ( !parent ) {
			console.error(
				'[IndeterminateBar] Unable to find the progress bar container "' + 
				IndeterminateBar.config.parent + '"'
			)
			return
		}
		
		slider.remove()	
		parent.prepend( slider )
		state.removed = false
	}

	/**
	 * Removes the IndeterminateBar from the DOM
	 */
	IndeterminateBar.remove = function() {
		if ( IndeterminateBar.isRemoved() ) return

		slider.remove()
		state.removed = true
	}

	IndeterminateBar.isStarted = function() { return state.started }
	IndeterminateBar.isIndeterminate = function() { return state.indeterminate }
	IndeterminateBar.isRemoved = function() { return state.removed }

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
