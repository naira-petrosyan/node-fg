# Child Processes

When an application grows larger, one process of single threaded non-blocking Node JS cannot be enough for large workload. 
The best way to scale NodeJS application is to use multiple processes.

## child_process module

To create/use child processes, Node has a built-in module called `child_process` that can be used. 
This module enables to use OS functionalities, by running any system command in a child process.
Child processes can communicate with each other using messages.
We can control child process input and listen to output streams. We can control what arguments we pass to system commands,
and we can do anything we want with the output of the command as all inputs and outputs of these commands can be presented to us using Node.js streams.
There are four different ways to create a child process in Node: `spawn()`, `fork()`, `exec()`, and `execFile()`.

### Spawn
The spawn function launches a command in a new process, and we can use it to pass that command any arguments. For example, here’s code to spawn a new process that will execute the pwd command.
Parameters:
* command: Accepts a string which is the command to run.
* args: List of string arguments. Default value is an empty array.
* options:
    * shell: Accepts a boolean value. If true, runs command inside of a shell. Different shell can be specified as a string. Default value is false which implies no shell. By default, spawn() does not create a shell to execute the command hence it is important to pass it as option while invoking the child process.
    * Additional options such as cwd, env, argv0, stdio etc can be used as per requirement.

Return Value: Returns a ChildProcess object.

```js
const { spawn } = require('child_process');

const child = spawn('pwd');
```

The result of the command execution: `child` is an EventEmitter isntance, which means we can register handlers to all the events of the `child` object.
```js
child.on('exit', function (code, signal) {
  console.log('child process exited with ' +
              `code ${code} and signal ${signal}`);
});
```
The handler above gives us the exit code for the child process and the signal, if any, that was used to terminate the child process. This signal variable is null when the child process exits normally.

The other events that we can register handlers for with the ChildProcess instances are disconnect, error, close, and message.

* The disconnect event is emitted when the parent process manually calls the child.disconnect function.
* The error event is emitted if the process could not be spawned or killed.
* The close event is emitted when the stdio streams of a child process get closed.
* The message event is the most important one. It’s emitted when the child process uses the process.send() function to send messages. This is how parent/child processes can communicate with each other. We’ll see an example of this below.

Every child process also gets the three standard stdio streams, which we can access using `child.stdin`, `child.stdout`, and `child.stderr`.
Since all streams are event emitters, we can listen to different events on those stdio streams that are attached to every child process. Unlike in a normal process though, in a child process, the stdout/stderr streams are readable streams while the stdin stream is a writable one. This is basically the inverse of those types as found in a main process. The events we can use for those streams are the standard ones. Most importantly, on the readable streams, we can listen to the data event, which will have the output of the command or any error encountered while executing the command:

```js
child.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`child stderr:\n${data}`);
});
```

We can also pass arguments to commands executed with spawn, as a second argument for spawn, which is an array of arguments for the command
```js
const child = spawn('find', ['.', '-type', 'f']);
```
If an error occurs during the execution of the command, for example, if we give find an invalid destination above, the child.stderr data event handler will be triggered and the exit event handler will report an exit code of 1,


A child process stdin is a writable stream. We can use it to send a command some input. Just like any writable stream, the easiest way to consume it is using the pipe function. We simply pipe a readable stream into a writable stream. Since the main process stdin is a readable stream, we can pipe that into a child process stdin stream. For example:
```js
const { spawn } = require('child_process');

const child = spawn('wc');

process.stdin.pipe(child.stdin)

child.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
});
```



We can also pipe the standard input/output of multiple processes on each other, just like we can do with Linux commands. For example, we can pipe the stdout of the find command to the stdin of the wc command to count all the files in the current directory:
```js
const { spawn } = require('child_process');

const find = spawn('find', ['.', '-type', 'f']);
const wc = spawn('wc', ['-l']);

find.stdout.pipe(wc.stdin);

wc.stdout.on('data', (data) => {
  console.log(`Number of files ${data}`);
});
```

## Shell Syntax and the exec function

Parameters:

* command: Accepts a string that specifies the command to run with space-separated arguments.
* options: Some of the options available are cwd, env, encoding, shell, timeout etc
* callback: The callback function is called when process terminates. The arguments to this function are error, stdout and stderr respectively.

Return Value: Returns an instance of ChildProcess.

By default, the spawn function does not create a shell to execute the command we pass into it. This makes it slightly more efficient than the exec function, which does create a shell. The exec function has one other major difference. It buffers the command’s generated output and passes the whole output value to a callback function (instead of using streams, which is what spawn does).
```js
const { exec } = require('child_process');

exec('find . -type f | wc -l', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  console.log(`Number of files ${stdout}`);
});
```
The exec function buffers the output and passes it to the callback function (the second argument to exec) as the stdout argument there. This stdout argument is the command’s output that we want to print out.

The exec function is a good choice if you need to use the shell syntax and if the size of the data expected from the command is small.
The spawn function is a much better choice when the size of the data expected from the command is large, because that data will be streamed with the standard IO objects.
We can make the spawned child process inherit the standard IO objects of its parents if we want to, but also, more importantly, we can make the spawn function use the shell syntax as well. Here’s the same find | wc command implemented with the spawn function:

```js
const child = spawn('find . -type f | wc -l', {
  stdio: 'inherit',
  shell: true
});
```


Because of the shell: true option above, we were able to use the shell syntax in the passed command, just like we did with exec. But with this code, we still get the advantage of the streaming of data that the spawn function gives us. 

## execFile

If you need to execute a file without using a shell, the execFile function is what you need. It behaves exactly like the exec function, but does not use a shell, which makes it a bit more efficient. On Windows, some files cannot be executed on their own, like .bat or .cmd files. Those files cannot be executed with execFile and either exec or spawn with shell set to true is required to execute them.


## fork

The fork function is a variation of the spawn function for spawning node processes. The biggest difference between spawn and fork is that a communication channel is established to the child process when using fork, so we can use the send function on the forked process along with the global process object itself to exchange messages between the parent and forked processes. We do this through the EventEmitter module interface. Here’s an example:
Parameters:

* modulePath: Accepts a string that specifies the module to run in the child.
* args: List of string arguments.
* options: cwd, detached, env, execPath, execArgv are some of the available options for this method.


Let’s say we have an http server that handles two endpoints. One of these endpoints (/compute below) is computationally expensive and will take a few seconds to complete. We can use a long for loop to simulate that:
```js
const http = require('http');

const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  };
  return sum;
};

const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url === '/compute') {
    const sum = longComputation();
    return res.end(`Sum is ${sum}`);
  } else {
    res.end('Ok')
  }
});

server.listen(3000);
```

This program has a big problem; when the the /compute endpoint is requested, the server will not be able to handle any other requests because the event loop is busy with the long for loop operation.
In a new compute.js file:
```js
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  };
  return sum;
};

process.on('message', (msg) => {
  const sum = longComputation();
  process.send(sum);
});
```

Now, instead of doing the long operation in the main process event loop, we can fork the compute.js file and use the messages interface to communicate messages between the server and the forked process.
```js
const http = require('http');
const { fork } = require('child_process');

const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url === '/compute') {
    const compute = fork('compute.js');
    compute.send('start');
    compute.on('message', sum => {
      res.end(`Sum is ${sum}`);
    });
  } else {
    res.end('Ok')
  }
});

server.listen(3000);
```

When a request to /compute happens now with the above code, we simply send a message to the forked process to start executing the long operation. The main process’s event loop will not be blocked.

Once the forked process is done with that long operation, it can send its result back to the parent process using process.send.

In the parent process, we listen to the message event on the forked child process itself. When we get that event, we’ll have a sum value ready for us to send to the requesting user over http.