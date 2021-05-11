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
		setProgressLabel( 'Elaborazione in corso...' )
	})

	IndeterminateBar.on('indeterminate', function() {
		setProgressLabel('Completamento...')
	})

	IndeterminateBar.on('done', function() {
		setProgressLabel( 'Completato.' )
	})

	// Listen to button click and input change events
	startBtn.addEventListener( 'click', onStart);
	stopBtn.addEventListener( 'click', onStop);
	durationInput.addEventListener( 'change', onChange);

	////////////////////////////////////////////////////////////////////////////

	function onStart() {
		IndeterminateBar.start();
		Stopwatch.start();

		updateElapsedLabel();
		timerIntervalID = setInterval( updateElapsedLabel, 1000 );
	}

	function onStop() {
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
		elapsedLabel.innerHTML = 'Tempo trascorso: ' + Stopwatch.getTime()
	}

	function setProgressLabel(message) {
		progressLabel.innerHTML = message
	}
})(document)
