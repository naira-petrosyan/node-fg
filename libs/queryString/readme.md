# Querystring
The querystring module provides utilities for parsing and formatting URL query strings. It can be accessed using:
`const querystring = require('querystring');`

The querystring API is considered Legacy. While it is still maintained, new code should use the <URLSearchParams> API instead.

* `querystring.parse(str[, sep[, eq[, options]]])` - The querystring.parse() method parses a URL query string (str) into a collection of key and value pairs.

```js
querystring.parse('foo=bar&abc=xyz&abc=123');
//{
//foo: 'bar',
//    abc: ['xyz', '123']
//}
```
* `querystring.stringify(obj[, sep[, eq[, options]]])` - The querystring.stringify() method produces a URL query string from a given obj by iterating through the object's "own properties".

```js
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Returns 'foo=bar&baz=qux&baz=quux&corge='
```