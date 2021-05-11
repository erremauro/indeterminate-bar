# Indeterminate Bar

An indeterminate progress bar that shows a loading bar that changes to an
indeterminate progress once it reaches the 100%.

## Installation

Add [indeterminatebar.js]() and [indeterminatebar.css]() to your project

```html
<script src='nprogress.js'></script>
<link rel='stylesheet' href='nprogress.css'/>
```

## Usage

Simply call `start()` and `done()` to control the progress bar.

```js
IndeterminateBar.start();
IndeterminateBar.done();
```

## Events

You can register to the following events.

#### `start`

```js
IndeterminateBar.on('start', function() {
	console.log('the progress is started');
})
```

#### `done`

```js
IndeterminateBar.on('done', function() {
	console.log('the progress bar has been stopped');
})
```

#### `indeterminate`

```js
IndeterminateBar.on('indeterminate', function() {
	console.log('the progress bar changed to indetermined');
})
```

## Configurations

#### `duration`

Specify the duration in seconds for the loading bar.

```js
IndeterminateBar.configure({
	duration: 60
})
```

#### `parent`

Specify the progress bar container.

```js
IndeterminateBar.configure({
	parent: '#my-container'
})
```