# ask-sync

An easy to use library for interactive data input

## Installation

```bash
$ npm install ask-sync
```

## Sample code

```js
	var ask = require('ask-sync');
	
	var person = ask({
		name: ask.string('Person name'),
		age:  ask.number('Person age'),
		sex:  ask.string('Person sex', {
			values: ['male','female']
		}),
	});
```
