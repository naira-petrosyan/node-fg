# Process
The process object provides information about, and control over, the current Node.js process. While it is available as a global, it is recommended to explicitly access it via require or import:
```js
import process from 'process';
//or

const process = require('process');


```
The process object is an instance of EventEmitter.

https://www.tutorialspoint.com/nodejs/nodejs_process.htm

The 'beforeExit' event is emitted when Node.js empties its event loop and has no additional work to schedule. Normally, the Node.js process will exit when there is no work scheduled, but a listener registered on the 'beforeExit' event can make asynchronous calls, and thereby cause the Node.js process to continue.

The listener callback function is invoked with the value of process.exitCode passed as the only argument.

The 'beforeExit' event is not emitted for conditions causing explicit termination, such as calling process.exit() or uncaught exceptions.

The 'beforeExit' should not be used as an alternative to the 'exit' event unless the intention is to schedule additional work.

The 'exit' event is emitted when the Node.js process is about to exit as a result of either:

The process.exit() method being called explicitly;
The Node.js event loop no longer having any additional work to perform.
There is no way to prevent the exiting of the event loop at this point, and once all 'exit' listeners have finished running the Node.js process will terminate.

The listener callback function is invoked with the exit code specified either by the process.exitCode property, or the exitCode argument passed to the process.exit() method.

Listener functions must only perform synchronous operations. The Node.js process will exit immediately after calling the 'exit' event listeners causing any additional work still queued in the event loop to be abandoned. In the following example, for instance, the timeout will never occur: