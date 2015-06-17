# ask-sync

An easy to use library for interactive data input

## Sample code

```js
	var ask = require('ask-sync');
	var settings = ask({
		str: ask.String('str'),
		int: ask.Integer('int'),
		bool: ask.Boolean('bool'),
		yesno: ask.String('opts', {
			values: ['y','n'], default: 'y'
		}),
		optional: ask.String('optional', {
			nullable: true
		}),
	});
```
