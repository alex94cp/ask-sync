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
		name: ask.String('Person name'),
		age:  ask.Number('Person age'),
		sex:  ask.String('Person sex', {
			values: ['male','female']
		}),
	});
```
