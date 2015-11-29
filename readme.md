# dual-run [![Build Status](https://travis-ci.org/jamestalmage/dual-run.svg?branch=master)](https://travis-ci.org/jamestalmage/dual-run)

> My outstanding module


## Install

```
$ npm install --save dual-run
```


## Usage

```js
const dualRun = require('dual-run');

dualRun('unicorns');
//=> 'unicorns & rainbows'
```


## API

### dualRun(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`  
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global dual-run
```

```
$ dual-run --help

  Usage
    dual-run [input]

  Options
    --foo  Lorem ipsum. [Default: false]

  Examples
    $ dual-run
    unicorns & rainbows
    $ dual-run ponies
    ponies & rainbows
```


## License

MIT © [James Talmage](http://github.com/jamestalmage)
