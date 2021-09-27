# node-fg-modules
## What is a module
In JS a module is a single script or just a file. Modules can load each others with the help of `import` and `export` special keywords.
* `export` - is used to label variables and functions that can be accessible from outside
* `import` - is used to import above exported functions and variables from other modules

Example of `export`
```js
export function sayHi(user) {
    alert(`Hello, ${user}`)
}
```

Example of `import`
```js
import { sayHi } from './sayHi.js';

sayHi('Naira')
```

To run this code in browser JS uses `<script>` tags and giving a `type="module"` attribute to the tag.
```html
<!doctype html>
<script type="module">
  import {sayHi} from './sayHi.js';
  sayHi('Naira');
</script>
```

##Core features(module vs regular)
* __Always strict mode__ 
assigning value to an undeclared variables throws error in module script
```html
<script type="module">
  b = 5; // error
</script>
```
* __Module level scope__
Each module has its top scope, which means that anything declared(and not exported) in one module cannot be seen and used in other modules
In the example we can see that variable `user` from module `user.js` is used in `hello.js`. But the variable `user` is not exported(from`user.js`) and imported(in `hello.js`). So this will result in error.
  This also implies that in `html` files, the variables inside ```<script type="module">``` is not accessible from other script if not exported.
  
_Note:_ This does not mean that one cannot use global `window` to have window level variables

* __Code Evaluation__
The module can be imported in the code multiple times, but the code in the module is always executed once and on the first import.
  The consequences of this are: 
  * For example if we have side effects(like alerting something), and we import the same alerting module twice, the message will be alerted only once
  * If object is exported from module, and the object is imported multiple times in other module. The object is initialized only on first import. And the created object is passed to other importers. So all the imports point to same admin object reference.
```js
export let presenters = {
    name: "Naira"
};
```
__RULE__
top-level module code should be used for initialization, creation of module-specific internal data structures. 
If we need to make something callable multiple times – we should export it as a function, like we did with sayHi above

In other words, a module can setup a general functionality, which needs to be initiated once, 
and can have functions exported. One example for this is authentication configuration.

* __import.meta__
This object contains info about current module. If in browser the `import.meta` containts the URL of the script or the current webpage
  
* __This is undefined__
 In module type script top level `this` is undefined, unlike in regular script where `this` is the global `window` object
  

* __Module scripts are deferred__ (The defer attribute tells the browser not to wait for the script. Instead, the browser will continue to process the HTML, build DOM. The script loads “in the background”, and then runs when the DOM is fully built.)
  * downloading external module scripts `<script type="module" src="...">` doesn’t block HTML processing, they load in parallel with other resources.
  * module scripts wait until the HTML document is fully ready (even if they are tiny and load faster than HTML), and then run.
  * relative order of scripts is maintained: scripts that go first in the document, execute first.
    
* __inline Async__
For Regular scripts async attribute works only for external scripts, but for module scripts it works for inline too.
  If the inline script has `async` attribute,  it does not wait for anything, imports the module and runs when ready, does not wait for HTML to fully load
  
* __Compatibility__
    Old browsers do not support `type="module"`, in order to have modules in old browser we can use `nomodule` attribute on script
  
```html
<script type="module">
  alert("Runs in modern browsers");
</script>

<script nomodule>
  alert("Modern browsers know both type=module and nomodule, so skip this")
  alert("Old browsers ignore script with unknown type=module, but execute this.");
</script>
```

* __Build Tools__
  In real project, we used many modules and most of the times we need to bundle them together. This kind of operations are done with tools such as Webpack
  It does the followgin:
  * Analyzes the dependencies(all imports with their imports)
  * Creates a single file with all modules
  * Does optimizations in the process(remove unreachable codes, remove unused exports, removes console, debugger, translates to old version javascript, the resulting file is minified)
  * As in resulting file we do not have any import/export statements the script tag does not require `type="module"`, so the build file can be put in regular script
    ```<script src="bundle.js"></script>```
    
##Export and Import
### Syntax of export
1. We can label any declaration as exported by placing export before it, be it a variable, function or a class.
```js
// export an array
export let months = ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// export a constant
export const MODULES_BECAME_STANDARD_YEAR = 2015;

// export a class
export class User {
  constructor(name) {
    this.name = name;
  }
}
```
2. Also, we can put export separately.
```js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

export {sayHi, sayBye}; // a list of exported variables
```
3. `As` keyword
We use as to export under different names
```js
export {sayHi as hi, sayBye as bye};
```
###Syntax of import
1. Import in curly braces
```js
import {sayHi, sayBye} from './say.js';

sayHi('John'); // Hello, John!
sayBye('John'); // Bye, John!
```
2. Import all as one object
```js
import * as say from './say.js';

say.sayHi('John');
say.sayBye('John');
```
3. Import with `As` keyword
   use as to import under different names.
```js
import {sayHi as hi, sayBye as bye} from './say.js';

hi('John'); // Hello, John!
bye('John'); // Bye, John!
```
###Export default
In practice, there are mainly two kinds of modules.

Modules that contain a library, pack of functions, like say.js above.
Modules that declare a single entity, e.g. a module user.js exports only class User.
Mostly, the second approach is preferred, so that every “thing” resides in its own module.

Naturally, that requires a lot of files, as everything wants its own module, but that’s not a problem at all. Actually, code navigation becomes easier if files are well-named and structured into folders.

Modules provide a special ```export default``` (“the default export”) syntax to make the “one thing per module” way look better.
There may be only one export default per file.
Put export default before the entity to export:

```js
export default class User { // just add "default"
  constructor(name) {
    this.name = name;
  }
}
```
```js
import User from './user.js'; // not {User}, just User

new User('John');
```
As there may be at most one default export per file, the exported entity may have no name.

For instance, these are all perfectly valid default exports:
```js
export default class { // no class name
  constructor() { ... }
}

export default function(user) { // no function name
  alert(`Hello, ${user}!`);
}
```
In some situations the default keyword is used to reference the default export.

For example, to export a function separately from its definition:
```js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// same as if we added "export default" before the function
export {sayHi as default};

```
If we use asterisk to import all the dependencies, the default export can be reached like this:
```js
import * as user from './user.js';

let User = user.default; // the default export
new User('John');
```

###Re-export
“Re-export” syntax export ... from ... allows to import things and immediately export them (possibly under another name), like this:

```js
export {sayHi} from './say.js'; // re-export sayHi

export {default as User} from './user.js'; // re-export default
```

When reexporting the deafult export we need to handle more cases:
1. `export User from './user.js'` won’t work. That would lead to a syntax error.

To re-export the default export, we have to write `export {default as User} from './user.js';`, as in the example above.
2.` export * from './user.js'` re-exports only named exports, but ignores the default one.
If we’d like to re-export both named and the default export, then two statements are needed:
```js
export * from './user.js'; // to re-export named exports
export {default} from './user.js'; // to re-export the default export
```

All of the above imports are called static imports, there are some things that static imports cannot do
1. Import modules conditionally
2. Import at run time
3. Import modules from regular script

For these Dynamic modules are used, `import(modulePath)`, which get as an argument a string path for module, and returns a promise syntax is pretty straightforward
```html
<script type="module">
  const moduleSpecifier = './utils.mjs';
  import(moduleSpecifier)
    .then((module) => {
      module.default();
      // → logs 'Hi from the default export!'
      module.doStuff();
      // → logs 'Doing stuff…'
    });
</script>

<!--OR-->

<script type="module">
  (async () => {
    const moduleSpecifier = './utils.mjs';
    const module = await import(moduleSpecifier)
    module.default();
    // → logs 'Hi from the default export!'
    module.doStuff();
    // → logs 'Doing stuff…'
  })();
</script>
```

```js
async function execBigModule(condition) {
  if (condition) {
    const { funcA } = await import('./bigModuleA.js');
    funcA();
  } else {
    const { funcB } = await import('./bigModuleB.js');
    funcB();
  }
}

execBigModule(true);
```