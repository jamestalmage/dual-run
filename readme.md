# dual-run [![Build Status](https://travis-ci.org/jamestalmage/dual-run.svg?branch=master)](https://travis-ci.org/jamestalmage/dual-run)

> Use bash style '&&' with concurrency.


## Install

```
$ npm install --save --global dual-run
```

## Usage

```
$ dual-run foo ---- bar ---- baz
```

All three commands: `foo`, `bar`, and `baz` are launched concurrently, but the output of the second and third commands will buffer and be displayed in order. What you end up seeing is exactly the same as if you had run the following:
 
 ```
 $ foo && bar && baz
 ```
 
 But it just finishes faster. In order to preserve terminal colors, `dual-run` makes use of an optional dependency `child_ptty`. It requires a build step that will fail on some systems. In that case, it will abandon the concurrent behavior, and commands will run sequentially. This preserves terminal colors no matter the system. Future versions may define an option to prefer concurrency regardless of `pty` support. 

## Why?

Because your PC has more than one processor. Take advantage! My initial use has been splitting up `tap` tests across multiple processes. I have not yet experimented with combining this with test coverage. My guess would be that it requires using `nyc` manually instead of the `--coverage` flag.

## Why Not?

Using a single `&` can accomplish much the same thing. The one advantage this offers is that it only allows one process to write to `stdout`/`stderr` at a time, and buffers the rest. Using `&`, your output would be mangled and hard to read. This does mean you are storing everything in memory, so it is not suitable for processes that will dumb gigabytes onto stdout. 

## License

MIT © [James Talmage](http://github.com/jamestalmage)
