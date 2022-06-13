# New in ECMAScript 2022

## Method .at()
In JavaScript you can do arr[1] to access the value at index 1 of an Array but you cannot do arr[-1] to count backward from the ending of the Array. The reason is that the brackets syntax is used not only for arrays but also for Objects, 
where obj[-1] would simply refer to the property ‘-1’ of that Object.

```js
const arr = [10,20,30,40];

arr[1]; // => 20
arr.at(1); // => 20

arr[arr.length -1]; // => 40
arr.at(-1); // => 40

arr.at(-2); // => 30
```

Support - The browser support for the .at feature is currently limited (Dec 2021 usage: ~70%), and it is only available in Node.js 16.6+. You can use the .at() polyfill from Core JS in the meantime.

## Object.hasOwn(obj, propKey)

provides a safe way to check if an object obj has an own property with the key propKey.
In JavaScript we already have an Object.prototype.hasOwnProperty but, as the MDN documentation also suggests, it’s best to not use hasOwnProperty outside the prototype itself as it is not a protected property, meaning that an object could have its property called hasOwnProperty that has nothing to do with Object.prototype.hasOwnProperty.
For example 
```js
const obj = {
    hasOwnProperty:()=> {
        return false
    },
    prop: 'a'
}
obj.hasOwnProperty('prop'); // false
```

Object.hasOwn() takes our Object as the first argument and the property we want to check as the second:
```js
const student = {
    name: 'Mark',
    age: 18
}
Object.hasOwn(student,'age'); // true
Object.hasOwn(student,'grade'); // false
```

Support - The browser support is currently limited (Dec 2021 usage: ~70%), and you need Node 16.9+ to use hasOwn directly. In the meantime there is a Core JS polyfill for hasOwn.


## Top-level await in modules
We can now use await at the top levels of modules and don’t have to enter async functions or methods anymore.
This can be useful in many scenarios, for example when we have a dynamic path for a dependency that depends on a runtime value:
```js
// we need to get the appropriate translation keys based on the language
const translationKeys = await import(`/i18n/${navigator.language}`);
```
Another use could be to provide a fallback for a dependency:
```js
let jQuery;
try {
  jQuery = await import('https://cdn-a.com/jQuery');
} catch {
  jQuery = await import('https://cdn-b.com/jQuery');
}
```
Support - Top-level await is supported on modern browsers (Dec 2021 usage: ~80%) and Node.js 14.8+.
## RegExp Match Indices

This upgrade will allow us to use the d character to specify that we want to get the indices (starting and ending) of the matches of our RegExp.

```js 
const fruits = 'Fruits: mango, mangosteen, orange'
const regex = /(mango)/g;
// .exec
RegExp(regex).exec(fruits);
// [
//     "mango",
//     "mango",
//     groups: undefined,
//     index: 8,
//     input: "Fruits: mango, mangosteen, orange",
//     length: 2,
// ]

```
Both return the index of the match, the match itself, and the initial input. What we don’t know are the indices at which the string ends, something that we will now be able to do like this:
```js
const fruits = 'Fruits: mango, mangosteen, orange'
// /gd instead of the previous /g
const regex = /(mango)/gd;
RegExp(regex).exec(fruits);
// [
//     "mango",
//     "mango",
//     groups: undefined,
//     index: 8,
//     indices: (2) [Array(2), Array(2), groups: undefined], [[8, 13], [8, 13]]
//     input: "Fruits: mango, mangosteen, orange",
//     length: 2,
// ]
```

Support - The browser support for the RegExp match indices feature is currently limited (Dec 2021 usage: ~80%). In Node.js, you can activate the feature with the --harmony-regexp-match-indices flag, but it is disabled by default. You can use the RegExp match indices polyfill in the meantime.

## error.cause
Error and its subclasses now let us specify which error caused the current one:
```js
const load = async (userId) => {
    try {
        return await fetch(`https://service/api/user/${userId}`);
    } catch (error) {
        throw new Error(
            `Loading data for user with id ${userId} failed`,
            { cause: error }
        );
    }
}

try {
    const userData = await load(3);
    // ...
} catch (error) {
    console.log(error); // Error: Loading data for user with id 3 failed
    console.log(error.cause); // TypeError: Failed to fetch
}
```
Support - The current browser support for the error clause feature is limited (Dec 2021 usage: ~70%). Node.js supports the feature since version 16.9. You can use the error cause polyfill to start using the feature today, even in JS environments where it is not supported.



## Classes and Instances
### Private instance fields, methods
Before ES2022 we would define properties of a class in its constructor like this:
```js
class ButtonToggle extends HTMLElement {
    constructor(){
        super();
        // public field
        this.color = 'green'
        // private field
        this._value = true;
    }
    toggle(){
        this.value = !this.value
    }
}
const button = new ButtonToggle();
console.log(button.color);
// green - public fields are accessible from outside classes
button._value = false;
console.log(button._value);
// false - no error thrown, we can access it from outside the class
```

Inside of the constructor, we defined two fields. As you can see one of them is marked with an _ in front of the name which is just a JavaScript naming convention to declare the field as private meaning that it can only be accessed from inside of a class method. Of course, that’s just a naming convention and not something that the language itself enforces and that’s why when we tried to access it, it didn’t raise any error.
The # prefix marks a field, method, or accessor in a class as private, meaning that you cannot access it from outside the instances themselves.
```js
class Example {
  #value;

  constructor(value) {
    this.#value = value;
  }

  #calc() {
    return this.#value * 10;
  }

  print() {
    console.log(this.#calc());
  }
}

const object = new Example(5);
console.log(object.#value);    // SyntaxError
console.log(object.#calc());   // SyntaxError
object.print();     
```

Support - Most browsers (Dec 2021 usage: ~90%) and Node.js 12+ support private instance fields. The support for private methods and accessors is more limited in browsers (Dec 2021 usage: ~80%). Node.js has supported the feature since version 14.6. You can transpile your code with Babel to use private class fields and methods on environments that don't directly support them.

### Existence Checks For Private Fields
Since trying to access a non-existing private field on an object throws an exception, it needs to be possible to check if an object has a given private field. The in operator can be used to check if a private field is available on an object:

```js
class Example {
  #field

  static isExampleInstance(object) {
    return #field in object;
  }
}
```
Support - The browser support for using the in operator on private fields is limited (Dec 2021 usage: ~70%). Node.js supports the feature since version 16.4. You can transpile usages of the in operator for private fields with Babel.

### Public Static Class Fields
Static class fields are a convenient notation for adding properties to the class object.
Previously we would have to define them outside of the class body such as:

```js
class ButtonToggle extends HTMLElement {
    // ... class body
}
ButtonToggle.toggle(){
    // static method define outside of the class body
}
```

Now, instead, we can define them directly inside of the class body with the use of the static keyword:
```js
class ButtonToggle extends HTMLElement {
   
    #value = true;
    static toggle(){
        this.#value = !this.#value
    }
}
// this will work
ButtonToggle.toggle();
// SyntaxError - private static field
const button = new ButtonToggle();
button.toggle();
```

Support - Most browsers (Dec 2021 usage: ~90%) and Node.js 12+ support public class fields.

### Private Static Class Fields and Methods
We can use the static keyword in front of fields and methods (both private and public) and by combining it with the # (private) we can create a private static method only accessible from inside of our prototype class.
```js
class ButtonToggle extends HTMLElement {

    #value = true;
    static #toggle(){
        this.#value = !this.#value
    }
}
// this will error, it's a private static method
ButtonToggle.#toggle();

```
```js
class Customer {
  static #idCounter = 1; // static private

  static #getNextId() { // static private
    return Customer.#idCounter++;
  }

  #id; // instance private

  constructor() {
    this.#id = Customer.#getNextId();
  }

  toString() {
    return `c${this.#id}`;
  }
}

const customers = [new Customer(), new Customer()];
console.log(customers.join(' ')); // c1 c2
```
Support - Most browsers (Dec 2021 usage: ~90%) and Node.js 12+ support private instance fields. The support for private methods and accessors is more limited in browsers (Dec 2021 usage: ~80%). Node.js has supported the feature since version 14.6. You can transpile your code with Babel to use private class fields and methods on environments that don't directly support them.

### Static Class Initialization Blocks
Sometimes it is necessary or convenient to do more complex initialization work for static class fields. For the private static fields feature from above, this initialization must even happen within the class because the private fields are not accessible otherwise.
The static initializer blocks feature provides a mechanism to execute code during the class definition evaluation. The code in a block statement with the static keyword is executed when the class is initialized:

```js
class Example {
  static propertyA;
  static #propertyB; // private

  static { // static initializer block
    try {
      const json = JSON.parse(fs.readFileSync('example.json', 'utf8'));
      this.propertyA = json.someProperty;
      this.#propertyB = json.anotherProperty;
    } catch (error) {
      this.propertyA = 'default1';
      this.#propertyB = 'default2';
    }
  }

  static print() {
    console.log(Example.propertyA);
    console.log(Example.#propertyB);
  }
}

Example.print();
```

Support - The browser support for static class initialization blocks is limited (Dec 2021: ~70%). Node.js supports the feature since version 16.4. You can transpile code with static initializer blocks with Babel.