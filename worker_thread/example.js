/*const { Worker } = require('worker_threads');

const worker = new Worker(`
const { parentPort } = require('worker_threads');
parentPort.once('message',
    message => parentPort.postMessage({ pong: message }));
`, { eval: true });
worker.on('message', message => console.log(message));
worker.postMessage('ping');*/

/*
const { Worker } = require('worker_threads')

const runService = (workerData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker_thread/workerExample.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`stopped with  ${code} exit code`));
        })
    })
}

const run = async () => {
    const result = await runService('hello John Doe')
    console.log(result);
}

run().catch(err => console.error(err))*/


const {Worker} = require("worker_threads");

let number = 10;

const worker = new Worker("./worker_thread/myWorker.js", {workerData: {num: number}});

worker.once("message", result => {
    console.log(`${number}th Fibonacci No: ${result}`);
});

worker.on("error", error => {
    console.log(error);
});

worker.on("exit", exitCode => {
    console.log(`It exited with code ${exitCode}`);
})

console.log("Execution in main thread");