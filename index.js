'use strict';

var stream = require('stream');
var Promise = require('pinkie');
var child = require('child_process');

var pty = null;
try {
	pty = require('child_pty');
} catch (e) {}

module.exports = function (commands, opts) {
	opts = opts || {};

	function makeOpts(command) {
		return {
			command: command.command,
			args: command.args || [],
			stdout: opts.stdout || process.stdout,
			stderr: opts.stderr || process.stderr
		};
	}

	var fn = serialSpawn;

	if (opts.noColor) {
		fn = cpSpawn;
	} else if (pty) {
		fn = ptySpawn;
	}

	var last = Promise.resolve();

	for (var i = 0; i < commands.length; i++) {
		last = fn(makeOpts(commands[i]), last);
	}

	return last;
};

function simpleSpawn(opts) {
	var useStdout = !opts.stdout || opts.stdout === process.stdout;
	var useStderr = !opts.stderr || opts.stderr === process.stderr;
	return new Promise(function (resolve, reject) {
		var ps = child
			.spawn(opts.command, opts.args, {
				stdio: [
					opts.stdin,
					useStdout ? process.stdout : 'pipe',
					useStderr ? process.stderr : 'pipe'
				]
			})
			.on('close', function (code) {
				handleExit(opts, code, resolve, reject);
			});

		if (!useStdout) {
			ps.stdout.pipe(opts.stdout, {end: false});
		}
		if (!useStderr) {
			ps.stderr.pipe(opts.stderr, {end: false});
		}
	});
}

function handleExit(opts, code, resolve, reject) {
	if (code === 0) {
		resolve();
		return;
	}
	var cmd = opts.command + ' ' + opts.args.join(' ');
	var err = new Error('"' + cmd + '" exited with ' + code);
	err.code = code;
	err.command = cmd;
	reject(err);
}

function serialSpawn(opts, previous) {
	return previous.then(function () {
		return simpleSpawn(opts);
	});
}

function ptySpawn(opts, previous) {
	return bufferedSpawn(pty, 'pty', true, opts, previous);
}

function cpSpawn(opts, previous) {
	return bufferedSpawn(child, 'pipe', false, opts, previous);
}

function bufferedSpawn(pty, pipeArg, resizeEvents, opts, previous) {
	var promise = new Promise(function (resolve, reject) {
		var stdoutBuffer = new stream.PassThrough();
		var stderrBuffer = new stream.PassThrough();

		var spawnArgs = {stdio: [null, pipeArg, pipeArg]};

		if (resizeEvents) {
			spawnArgs.columns = process.stdout.columns;
			spawnArgs.rows = process.stdout.rows;
		}

		var ps2 = pty.spawn(opts.command, opts.args, spawnArgs);

		if (resizeEvents) {
			process.stdout.on('resize', function () {
				ps2.stdout.resize({
					columns: process.stdout.columns,
					rows: process.stdout.rows
				});
			});
		}

		ps2.stdout.on('data', function (data) {
			stdoutBuffer.write(data);
		});

		ps2.stderr.on('data', function (data) {
			stderrBuffer.write(data);
		});

		previous.then(function () {
			stdoutBuffer.pipe(opts.stdout);
			stderrBuffer.pipe(opts.stderr);
		});

		ps2.on('close', function (code) {
			handleExit(opts, code, resolve, reject);
		});
	});

	return previous.then(function () {
		return promise;
	});
}
