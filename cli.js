#!/usr/bin/env node
'use strict';

var api = require('./index.js');

var args = process.argv.slice(2);
var commands = [];
var i = 0;

while (i < args.length) {
	var commandArgs = nextCmd(i);
	i += commandArgs.length + 1;
	commands.push({
		command: cmd(commandArgs),
		args: commandArgs
	});
}

if (commands.length < 2) {
	throw new Error('no ---- separator argument found');
}

api(commands)
	.then(function () {
		process.exit(0);
	})
	.catch(function (e) {
		console.warn(e.stack || e.message || e);
		process.exit(e.code || 1);
	});

function nextCmd(from) {
	var to = args.indexOf('----', from);
	return to === -1 ? args.slice(from) : args.slice(from, to);
}

function cmd(args) {
	if (args.length < 1) {
		throw new Error('no command found before/after/between ---- separator arguments');
	}
	return args.shift();
}
