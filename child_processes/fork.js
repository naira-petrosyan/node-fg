const http = require('http');
const { fork } = require('child_process');

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.url)
    if (req.url === '/compute') {
        const compute = fork('./compute.js');
        compute.send('start');
        compute.on('message', sum => {
            console.log('compute result')
            res.end(`Sum is ${sum}`);
        });
    } else {
        console.log('other result')
        res.end('Ok')
    }
});

server.listen(3000);