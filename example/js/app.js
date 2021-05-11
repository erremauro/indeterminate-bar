(function(document) {

	// Get the HTML elements in scope
	var startBtn = document.getElementById( 'start-btn' );
	var stopBtn = document.getElementById( 'stop-btn' );
	var durationInput = document.getElementById( 'duration' );
	var elapsedLabel = document.getElementById( 'elapsed-time' );
	var progressLabel = document.getElementById( 'progress-label' );

	// setInterval ID used to cancel the Elapsed Time update
	var timerIntervalID = null;

	IndeterminateBar.configure({ 
		parent: 'progress-bar',
		duration: durationInput.value
	});

	IndeterminateBar.on('start', function() {
		setProgressLabel( 'Processing file...' )
	})

	IndeterminateBar.on('change', function() {
		setProgressLabel('Completing, please wait...')
	})

	IndeterminateBar.on('done', function() {
		setProgressLabel( 'Completed.' )
	})

	// Listen to button click and input change events
	startBtn.addEventListener( 'click', onStart);
	stopBtn.addEventListener( 'click', onStop);
	durationInput.addEventListener( 'change', onChange);

	////////////////////////////////////////////////////////////////////////////

	function onStart() {
		if ( IndeterminateBar.isStarted ) return

		IndeterminateBar.start();
		Stopwatch.start();

		updateElapsedLabel();
		timerIntervalID = setInterval( updateElapsedLabel, 1000 );
	}

	function onStop() {
		if ( !IndeterminateBar.isStarted ) return
			
		IndeterminateBar.done();
		updateElapsedLabel();
		clearInterval( timerIntervalID );
	}	

	function onChange() {
		Stopwatch.reset();
		updateElapsedLabel();
		IndeterminateBar.configure({ duration: durationInput.value })
	}

	function updateElapsedLabel() {
		elapsedLabel.innerHTML = IndeterminateBar.isStarted
			? 'Elapsed Time: ' + Stopwatch.getElapsedTime()
			: 'Done in ' + Stopwatch.getTime()
	}

	function setProgressLabel(message) {
		progressLabel.innerHTML = message
	}
})(document)
