# File System(fs)
The fs module enables interacting with the file system in a way modeled on standard POSIX functions.
All file system operations have synchronous, callback, and promise-based forms, and are accessible using both CommonJS syntax and ES6 Modules (ESM).
* promise based - `import * as fs from 'fs/promises';`
* callback based and sync - `import * as fs from 'fs';`

Here are examples of each type of APIs
1. Promise-based operations return a promise that is fulfilled when the asynchronous operation is complete.
```js
        import { unlink } from 'fs/promises';
        
        try {
            await unlink('/tmp/hello');
            console.log('successfully deleted /tmp/hello');
        } catch (error) {
            console.error('there was an error:', error.message);
        }
```

2. The callback form takes a completion callback function as its last argument and invokes the operation asynchronously. The arguments passed to the completion callback depend on the method, but the first argument is always reserved for an exception. If the operation is completed successfully, then the first argument is null or undefined. The callback-based versions of the fs module APIs are preferable over the use of the promise APIs when maximal performance (both in terms of execution time and memory allocation are required).
```js
import { unlink } from 'fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
3. The synchronous APIs block the Node.js event loop and further JavaScript execution until the operation is complete. Exceptions are thrown immediately and can be handled using try…catch, or can be allowed to bubble up.

```js
import { unlinkSync } from 'fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
## FileHandle Class
 `<FileHandle>` object is an object wrapper for a numeric file descriptor. It is created with `fsPromises.open()`. Each `<FileHandle>` object is an `EventEmitter`.
When FileHandle is opened NodeJS will try to automatically close the file and emit a warning. It is suggested to always close the file by hand `filehandle.close()`, in order to not rely on NodeJS automatic behavior.

When the file is opened in OS, the OS creates an entry that represents the opened file and stores that information. The entries are represented as numbers and that numbers are file descriptors. 
Basically the file descriptor is just an integer number that uniquely represents an opened file for the process.
FileHandle object stores that file descriptor, which can be accessible with `fileHandle.fd`

When opening files there are flags on what can be peritted on the opened file.
File system flags#
The following flags are available wherever the flag option takes a string.
* 'a': Open file for appending. The file is created if it does not exist.
* 'ax': Like 'a' but fails if the path exists.
* 'a+': Open file for reading and appending. The file is created if it does not exist.
* 'ax+': Like 'a+' but fails if the path exists.
* 'as': Open file for appending in synchronous mode. The file is created if it does not exist.
* 'as+': Open file for reading and appending in synchronous mode. The file is created if it does not exist.
* 'r': Open file for reading. An exception occurs if the file does not exist.
* 'r+': Open file for reading and writing. An exception occurs if the file does not exist.
* 'rs+': Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
* This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.
* This doesn't turn fs.open() or fsPromises.open() into a synchronous blocking call. If synchronous operation is desired, something like fs.openSync() should be used.
* 'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
* 'wx': Like 'w' but fails if the path exists.
* 'w+': Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
* 'wx+': Like 'w+' but fails if the path exists.

Most common `fs` methods are: 
* `fs.readFile(path[, options],  callback)`, `fsPromises.readFile(path[, options], )`, `fs.readFileSync(path[, options])`
* `fs.writeFile(filename, data[, options], callback)`
* `fs.open(path, flags[, mode], callback)`
* `fs.rename(oldPath, newPath, callback)`
* `fs.chown(path, uid, gid, callback)`
* `fs.stat(path, callback)`
* `fs.link(srcpath, dstpath, callback)`
* `fs.symlink(destination, path[, type], callback)`
* `fs.rmdir(path, callback)`
* `fs.mkdir(path[, mode], callback)`
* `fs.readdir(path, callback)`
* `fs.utimes(path, atime, mtime, callback)`
* `fs.exists(path, callback)`(deprecated)
* `fs.appendFile(file, data[, options], callback)`