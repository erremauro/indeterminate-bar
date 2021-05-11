# Indeterminate Bar

An indetermined progress bar that starts as a loading bar and then gets updated
to an indeterminate progress bar once it reaches 100%

You can check an example [here](https://erremauro.github.io/indeterminate-bar/)

## Installation

Add [indeterminatebar.js]() and [indeterminatebar.css]() to your project

```html
<script src='indeterminatebar.js'></script>
<link rel='stylesheet' href='indeterminatebar.css'/>
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
