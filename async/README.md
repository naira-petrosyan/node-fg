# Single Threaded JS
We already know that JS is single threaded language, that used the event loop to make the language asynchronous. The first thing to cover about async JS are the callbacks.
A callback is a function called at the completion of a given task; this prevents any blocking, and allows other code to be run in the meantime.
This kind of functions are used when the upper function needs some time to give back a result, for example, working with files, downloading things and interacting with the database

```js
const result = multiplyTwoNumbers(5, 10)
console.log(result)
//this will give the result right after the calling, so the result will print 50



var photo = downloadPhoto('http://coolcats.com/cat.gif')
// photo is 'undefined'!


downloadPhoto('http://coolcats.com/cat.gif', handlePhoto)

function handlePhoto (error, photo) {
    if (error) console.error('Download error!', error)
    else console.log('Download finished', photo)
}

console.log('Download started')
```
Callback is a way of telling the program do this when you are done with something else. This has a major drawback which is named "Callback hell".
Imagine a peace of code that needs to do many operations after each other, and the asynchronicity is implemented with callbacks. 

```js
fs.readdir(source, function (err, files) {
  if (err) {
    console.log('Error finding files: ' + err)
  } else {
    files.forEach(function (filename, fileIndex) {
      console.log(filename)
      gm(source + filename).size(function (err, values) {
        if (err) {
          console.log('Error identifying file size: ' + err)
        } else {
          console.log(filename + ' : ' + values)
          aspect = (values.width / values.height)
          widths.forEach(function (width, widthIndex) {
            height = Math.round(width / aspect)
            console.log('resizing ' + filename + 'to ' + height + 'x' + height)
            this.resize(width, height).write(dest + 'w' + width + '_' + filename, function(err) {
              if (err) console.log('Error writing file: ' + err)
            })
          }.bind(this))
        }
      })
    })
  }
})
```

Of course there are some ways to make the code more readable, for example: 
1. modularized code
2. code style keeping(naming, etc.)
3. handling each error properly


#Promise
So what is a promise then? Well, a promise is just an enhancement to callback functions in Node.js, in order to avoid callback hells.
##Creating of Promise
To create a promise we use Promise constructor. As we can see the promise can be resolved or rejecte depending on some condition, 
and while the promise is not resolved or rejected the promise is in `pending` state. 

```js
let done = true
const isItDoneYet = new Promise((resolve, reject) => {
    if (done) {
        const workDone = 'Here is the thing I built'
        resolve(workDone)
    } else {
        const why = 'Still working on something else'
        reject(why)
    }
})
```


```js
var promise = doSomethingAync()
promise.then(onFulfilled, onRejected)
```
* “doSomethingAync” is any callback or asynchronous function which does some sort of processing.
* This time, when defining the callback, there is a value which is returned called a “promise.”
* When a promise is returned, it can have 2 outputs. This is defined by the ‘then clause’. Either the operation can be a success which is denoted by the ‘onFulfilled’ parameter. Or it can have an error which is denoted by the ‘onRejected’ parameter.



If we want to use classic js functions that take a callback as a Promise, we can always promisify this kind of functions, for example.

```js
const fs = require('fs')

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
        return        // and we don't want to go any further
      }
      resolve(data)
    })
  })
}

getFile('/etc/passwd')
.then(data => console.log(data))
.catch(err => console.error(err))
```


```js
const isItDoneYet = new Promise(/* ... as above ... */)
//...

const checkIfItsDone = () => {
  isItDoneYet
    .then(ok => {
      console.log(ok)
    })
    .catch(err => {
      console.error(err)
    })
}
```
Running checkIfItsDone() will specify functions to execute when the isItDoneYet promise resolves (in the then call) or rejects (in the catch call).


##Nested Promises
When defining promises, it needs to be noted that the “then” method itself returns a promise. So in a sense, promises can be nested or chained to each other.
Let's look at the example and see how the chaining works
```js
const status = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }
  return Promise.reject(new Error(response.statusText))
}

const json = response => response.json()

fetch('/todos.json')
  .then(status)    // note that the `status` function is actually **called** here, and that it **returns a promise***
  .then(json)      // likewise, the only difference here is that the `json` function here returns a promise that resolves with `data`
  .then(data => {  // ... which is why `data` shows up here as the first parameter to the anonymous function
    console.log('Request succeeded with JSON response', data)
  })
  .catch(error => {
    console.log('Request failed', error)
  })
```

##Handling Errors
When anything in the chain of promises fails and raises an error or rejects the promise, the control goes to the nearest catch() statement down the chain.
```js

new Promise((resolve, reject) => {
  throw new Error('Error')
}).catch(err => {
  console.error(err)
})

// or

new Promise((resolve, reject) => {
  reject('Error')
}).catch(err => {
  console.error(err)
})
```

#Some other functions working with the promises
1. `Promise.all()` - you generate a list of promises, and you can execute something when all promises are resolved
```js
const f1 = fetch('/something.json')
const f2 = fetch('/something2.json')

Promise.all([f1, f2])
  .then(res => {
    console.log('Array of results', res)
  })
  .catch(err => {
    console.error(err)
  })
```
2. `Promise.race()` - Promise.race() runs when the first of the promises you pass to it settles (resolves or rejects), and it runs the attached callback just once, with the result of the first promise settled.
```js
const first = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'first')
})
const second = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'second')
})

Promise.race([first, second]).then(result => {
  console.log(result) // second
})
```

3. `Promise.any()` -  settles when any of the promises you pass to it fulfill or all of the promises get rejected. It returns a single promise that resolves with the value from the first promise that is fulfilled. If all promises are rejected, then the returned promise is rejected with an AggregateError.
```js
const first = new Promise((resolve, reject) => {
  setTimeout(reject, 500, 'first')
})
const second = new Promise((resolve, reject) => {
  setTimeout(reject, 100, 'second')
})

Promise.any([first, second]).catch(error => {
  console.log(error) // AggregateError
})
```

#Async/await 
Async functions are natively available in NodeJS, they  are denoted with `async` keyword, and return a promise. The `await` keyword is only available inside `async` function
So if we have logic with Promises 

```js
function handler (req, res) {
  return request('https://user-handler-service')
    .catch((err) => {
      logger.error('Http error', err);
      error.logged = true;
      throw err;
    })
    .then((response) => Mongo.findOne({ user: response.body.user }))
    .catch((err) => {
      !error.logged && logger.error('Mongo error', err);
      error.logged = true;
      throw err;
    })
    .then((document) => executeLogic(req, res, document))
    .catch((err) => {
      !error.logged && console.error(err);
      res.status(500).send();
    });
}
```

we can rewrite is like this
```js
async function handler (req, res) {
  let response;
  try {
    response = await request('https://user-handler-service')  ;
  } catch (err) {
    logger.error('Http error', err);
    return res.status(500).send();
  }

  let document;
  try {
    document = await Mongo.findOne({ user: response.body.user });
  } catch (err) {
    logger.error('Mongo error', err);
    return res.status(500).send();
  }

  executeLogic(document, req, res);
}
```