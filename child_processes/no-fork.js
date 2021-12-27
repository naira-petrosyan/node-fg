const http = require('http');

const longComputation = () => {
    let sum = 0;
    for (let i = 0; i < 1e15; i++) {
        sum += i;
    }
    return sum;
};

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.url)
    if (req.url === '/compute') {
        const sum = longComputation();
        console.log('compute result')
        return res.end(`Sum is ${sum}`)
    } else {
        console.log('other result')
        res.end('Ok')
    }
});

server.listen(3000);