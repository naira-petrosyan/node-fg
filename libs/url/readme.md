# URL
The url module provides utilities for URL resolution and parsing. It can be accessed using:
`import url from 'url';

A URL string is a structured string containing multiple meaningful components. When parsed, a URL object is returned containing properties for each of these components.

The url module provides two APIs for working with URLs: a legacy API that is Node.js specific, and a newer API that implements the same WHATWG URL Standard used by web browsers.
```js
import { URL } from 'url';

const myURL =
new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');


import url from 'url';
const myURL =
  url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```

## The WHATWG URL API
### Class: URL
This class has the following functionalities and properties
* `new URL(input[, base])` - Creates a new URL object by parsing the input relative to the base. If base is passed as a string, it will be parsed equivalent to new URL(base).
```js
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo

let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```
* `url.hash` - gets and sets the hash of the url object
* `url.host` - gets and sets the host of the url object
* `url.hostname` - gets and sets the hostname of the url object, the key difference between `url.host` and `url.hostname` is that `url.hostname` does not include the port.
* `url.href` - Gets and sets the serialized URL.
* `url.origin` - Gets the origin of the url(readonly)
* `url.password` - gets and sets the password of the url object
* `url.pathname` - gets and sets the pathname of the url object
* `url.port` - gets and sets the port of the url object, The port value may be a number or a string containing a number in the range 0 to 65535 (inclusive). Setting the value to the default port of the URL objects given protocol will result in the port value becoming the empty string (''). The port value can be an empty string in which case the port depends on the protocol/scheme:
* `url.protocol` - gets and sets the protocol of the url object
* `url.search` - gets and sets the query of the url object
* `url.searchParams` - gets the searchParams of the url object
* `url.username` - gets and sets the username of the url object
* `url.toString()` - The toString() method on the URL object returns the serialized URL. The value returned is equivalent to that of `url.href` and `url.toJSON()`.
* `url.toJSON()` - The toJSON() method on the URL object returns the serialized URL. The value returned is equivalent to that of `url.href` and `url.toString()`.


### Class: URLSearchParams
* `new URLSearchParams(string)` - Instantiate a new empty URLSearchParams object.
```js
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Prints 'abc'
console.log(params.toString());
// Prints 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Prints 'user=abc&query=xyz'
```
* `urlSearchParams.append(name, value)` - Append a new name-value pair to the query string.
* `urlSearchParams.delete(name)` - Remove all name-value pairs whose name is name.
* `urlSearchParams.entries()` - Returns an ES6 Iterator over each of the name-value pairs in the query. Each item of the iterator is a JavaScript Array. The first item of the Array is the name, the second item of the Array is the value.
* `urlSearchParams.forEach(fn[, thisArg])` - Iterates over each name-value pair in the query and invokes the given function.
* `urlSearchParams.get(name)` - Returns the value of the first name-value pair whose name is name. If there are no such pairs, null is returned.
* `urlSearchParams.getAll(name)` - Returns the values of all name-value pairs whose name is name. If there are no such pairs, an empty array is returned.
* `urlSearchParams.keys()` - Returns an ES6 Iterator over the names of each name-value pair.
* `urlSearchParams.set(name, value)` - Sets the value in the URLSearchParams object associated with name to value. If there are any pre-existing name-value pairs whose names are name, set the first such pair's value to value and remove all others. If not, append the name-value pair to the query string.
* `urlSearchParams.sort()` - Sort all existing name-value pairs in-place by their names. Sorting is done with a stable sorting algorithm, so relative order between name-value pairs with the same name is preserved.
* `urlSearchParams.values()` - Returns an ES6 Iterator over the values of each name-value pair.