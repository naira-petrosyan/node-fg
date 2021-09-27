Every file with `.js` extension is a module for Node JS.

In NODE modules can load each others with the help of `module.exports`/ `exports` and `require` special keywords.
* `module.exports` and `exports` - are used to label variables and functions that can be accessible from outside
* `require` - is used to import above exported functions and variables from other modules

```js
//func.js
function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

// Adding the code below to allow importing
// the functions in other files
module.exports = { add }
```

```js
// Importing the func.js module
const f = require('./func');

// Require returns an object with add()
// and stores it in the f variable
// which is used to invoke the required

const result = f.add(10, 5);

console.log('The result is:', result);

```
If we log the imported `f` module, we will see this

```
Module {
  id: '.',
  exports: {
    add: func
  },
  parent: null,
  filename: 'some-path/func.js',
  loaded: false,
  children: [],
  paths:
   [ 'some-path/node_modules',' ] }
```

Like in js, there are named and default exports in NodeJs: `exports` and `module.exports`.
But there is a major difference between those. Let's look at the syntax before going into the difference.

module.exports is the default export for NodeJs, this means that whatever is module.exported in a module, is returned and imported when require is called.
```js
//func.js
function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

// Adding the code below to allow importing
// the functions in other files
module.exports = { add }
//other syntax for this can be 

module.exports = {
    add: function (x, y) {
        return x + y;
    },

    subtract: function (x, y) {
        return x - y;
    },
};

//OR

module.exports.add = function (x, y) {
    return x + y;
};

module.exports.subtract = function (x, y) {
    return x - y;
};
```

To access this exports you can require in multiple ways:

```js
const f = require('./func');
f.add(4, 4);
f.subtract(8, 4);

//OR

const { add, subtract} = require('./func');
```

Let's now dive into `exports` keyword. `exports` is an object, which is a reference to Module exports object. 
`exports` is used to write less code, the syntax is:

```js
exports.a = 'A';
exports.b = 'B';
```
So when logging the module, we will see this. 
```
Module {
  id: '.',
  exports: { a: 'A', b: 'B' },
  ...
```

The main difference between `module.exports` and `exports` is that `exports` is not returned, what do I mean by saying this, let's look at the example and see
These two snippets are doing the same thing in one module.
```js
module.exports = {
  greet: function (name) {
    console.log(`Hi ${name}!`);
  },

  farewell: function() {
    console.log('Bye!');
  }
}
//AND
exports.greet = function (name) {
    console.log(`Hi ${name}!`);
}

exports.farewell = function() {
    console.log('Bye!');
}
```
Actually `exports` is not always a reference to `module.exports`, when we assign any other value to `momdule.exports`, `exports` loses its reference

```js
module.exports = {a: 'A'};
exports.b = 'B';
console.log(exports === module.exports);
console.log(module)
```
this will print
```
false
Module {
  id: '.',
  exports: { a: 'A' },
```

the `exports` becomes a useless value. The only use case for `exports` is when `module.exports` needs to be an object containing some properties.