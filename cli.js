#!/usr/bin/env node
'use strict';
var child = require('child_process');
var stream = require('stream');
var supportsColor = require('supports-color');
var xtend = require('xtend');

var args = process.argv.slice(2);

var idx = args.indexOf('----');

if (idx === -1) {
	throw new Error('no `----` argument found');
}

var firstArgs = args.slice(0, idx);
var firstCmd = cmd(firstArgs, 'before');
var secondArgs = args.slice(idx + 1);
var secondCmd = cmd(secondArgs, 'after');

var stdoutBuffer = new stream.PassThrough();
var stderrBuffer = new stream.PassThrough();

child
	.spawn(firstCmd, firstArgs, {
		stdio: 'inherit'
	})
	.on('close', function (code) {
		if (code !== 0) {
			process.exit(code);
			return;
		}

		stdoutBuffer.pipe(process.stdout);
		stderrBuffer.pipe(process.stderr);
	});

var env = xtend(process.env);

if (supportsColor) {
	env.FORCE_COLOR = 'true';
}

var ps2 = child.spawn(secondCmd, secondArgs, {
	stdio: [null, 'pipe', 'pipe'],
	env: env
});

ps2.stdout.pipe(stdoutBuffer);
ps2.stderr.pipe(stderrBuffer);

function cmd(args, description) {
	if (args.length < 1) {
		throw new Error('no arguments ' + description + ' "----"');
	}
	return args.shift();
}
