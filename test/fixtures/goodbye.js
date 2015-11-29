#!/usr/bin/env node
var chalk = require('chalk');

console.log(chalk.green('goodbye'));

setTimeout(function () {
	console.log(chalk.blue('done'));
}, 1500);

