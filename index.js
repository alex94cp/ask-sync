var _ = require('lodash');
var readlineSync = require('readline-sync');

var defaultOptions = {
	prompt: ':',
	nullable: false,
};

function formatMessage(message, opts) {
	opts = _.defaults(opts || {}, defaultOptions);
	var contents = [message];
	if (opts.values !== undefined) {
		var options = opts.values.slice();
		if (opts.default !== undefined) {
			var index = options.indexOf(opts.default);
			var value = options[index];
			options.splice(index, 1, '[' + value + ']');
		} else if (opts.nullable) {
			options.push('[n/a]');
		}
		contents.push(' (' + options.join('/') + ')');
	} else {
		if (opts.default !== undefined)
			contents.push(' [' + opts.default + ']');
		else if (opts.nullable)
			contents.push(' [n/a]');
	}
	contents.push(opts.prompt + ' ');
	return contents.join('');
}

function readDataRaw(message, filter) {
	var data = readlineSync.question(message);
	return filter ? filter(data) : data;
}

function isValueValid(value, opts) {
	if (value === undefined)
		return opts.nullable;
	if ((opts.lt  !== undefined && value >= opts.lt) ||
	    (opts.lte !== undefined && value > opts.lte) ||
	    (opts.gt  !== undefined && value <= opts.gt) ||
	    (opts.gte !== undefined && value < opts.gte))
	    	return false;
	if ((opts.minLength !== undefined && value.length < opts.minLength) ||
	    (opts.maxLength !== undefined && value.length > opts.maxLength))
	    	return false;
	if (opts.pattern !== undefined && !value.test(opts.pattern))
	    	return false;
	if (opts.values !== undefined && opts.values.indexOf(value) === -1)
	    	return false;
	return true;
}

function readData(message, opts, filter) {
	opts = _.defaults(opts || {}, defaultOptions);
	var formatted = formatMessage(message, opts);
	do {
		var result = readDataRaw(formatted, filter);
		result = result || opts.default;
	} while (!isValueValid(result, opts));
	return result;
}

function askObject(object, opts) {
	var result = {};
	var pairs = _.pairs(object);
	for (var i = 0; i < pairs.length; ++i) {
		var first = pairs[i][0];
		var second = pairs[i][1];
		second = _.isFunction(second) ? second() : second;
		second = _.isPlainObject(second) ? askObject(second, opts) : second;
		if (second !== undefined) result[first] = second;
	}
	return result;
}

module.exports = exports = askObject;

exports.Boolean = function(message, opts) {
	return function() {
		return readData(message, opts, function(data) {
			return data === 'true';
		});
	};
};

exports.Integer = function(message, opts) {
	return function() {
		return readData(message, opts, parseInt);
	};
};

exports.Number = exports.Float = function(message, opts) {
	return function() {
		return readData(message, opts, parseFloat);
	};
};

exports.String = function(message, opts) {
	return function() {
		return readData(message, opts);
	};
};

exports.Date = function(message, opts) {
	return function() {
		return readData(message, opts, Date.parse);
	};
};

exports.Variant = function(message, opts) {
	return function() {
		for (;;) { try {
			return readData(message, opts, eval);
		} catch (e) {} }
	};
};
