# step

An AMD loader plugin for loaders like [RequireJS](http://requirejs.org) that
will load scripts in steps.

This allows you to load traditional scripts that do not use AMD in a sequential
fashion.

You should prefer the built-in
[`shim` config](http://requirejs.org/docs/api.html#config-shim) in RequireJS to
`step`, since it is more expressive and allows you to get local exports
references.

If you have a bunch of scripts with dependency sets that would make
`shim` hard to use, then this plugin may help.

## Usage

`step` only works with AMD loaders that support
[module config](http://requirejs.org/docs/api.html#config-moduleconfig), like
RequireJS 2.0.

First, set up a module config for `step` and list out the steps in a `steps`
property:

```javascript
require.config({
    config: {
        step: {
            steps: [
                ['one'],
                ['two'],
                ['three'],
                ['four']
            ]
        }
    }
});
```

In this example, four depends on three, two and one being loaded in order.

Then, to load a dependency along with anything in previous steps, use the
`step!` loader prefix ID:

```javascript
define(['step!four'], function () {
    //one.js, two.js and three.js will have also been
    //loaded by the time this function is called.

    //four.js creates a global `four` variable,
    //and it does not call define() so there
    //will not be a local `four` reference
    //passed to this function. Use the global
    //`four` instead.
    console.log(four.doSomething());
});
```

If you know that a script depends on two different scripts that each do not
depend on each other, then you can put them in the same step. For instance,
if "three" depended on "one" and "two" and "one" and "two" did not depend on
each other:

```javascript
require.config({
    config: {
        step: {
            steps: [
                ['one', 'two'],
                ['three'],
                ['four']
            ]
        }
    }
});
```

All the scripts in a step are loaded async and can load out of order, so it is
important that they do not depend on each other.

## Limitations

* Only use `step` with scripts that do not already call define(). Similarly,
do not include scripts in `step` that depend on AMD modules.
* It is slower loading than loading plain AMD modules. `step` waits for each
previous step to complete loading before doing the next step. Doing an
[r.js optimization build](http://requirejs.org/docs/optimization.html)
when you are ready to deploy your code is strongly suggested.
* When doing a build, include all the steps in the build output. If you use an
`exclude` directive to exclude a step script, it will likely break when that
built file is run in the browser.
* `step` will read the step config the first time it is called, and "burn in"
that config internally. So, it will not understand any further step config if
it is set after the first `step!` reference.

## License

MIT

## Code of Conduct

[jQuery Foundation Code of Conduct](https://jquery.org/conduct/).
