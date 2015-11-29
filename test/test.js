'use strict';
var test = require('ava');

var api = require('../');
var getStream = require('get-stream');
var stream = require('stream');
var chalk = require('chalk');

test.beforeEach(t => {
	t.context.a = new stream.PassThrough();
	t.context.b = new stream.PassThrough();
	t.context.c = new stream.PassThrough();
	t.context.d = new stream.PassThrough();
});

test('two at a time', async t => {
	t.plan(1);

	const {a, b} = t.context;
	await api([
		{command: './fixtures/hello.js'},
		{command: './fixtures/goodbye.js'}
	], a, b);

	a.end();
	b.end();

	var stdout = await getStream(a);

	t.is(
		stdout,
		[
			'hello\n',
			chalk.green('goodbye'), '\r\n',
			chalk.blue('done'), '\r\n'
		].join('')
	);
});

test('three at a time', async t => {
	t.plan(1);

	const {a, b} = t.context;
	await api([
		{command: './fixtures/hello.js'},
		{command: './fixtures/goodbye.js'},
		{command: './fixtures/foo.js'}
	], a, b);

	a.end();
	b.end();

	var stdout = await getStream(a);

	t.is(
		stdout,
		[
			'hello\n',
			chalk.green('goodbye'), '\r\n',
			chalk.blue('done'), '\r\n',
			chalk.yellow('foo'), '\r\n'
		].join('')
	);
});