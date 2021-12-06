// Import module into your application
const crypto = require('crypto');
// create hash algorithm
const hash = crypto.createHash('sha256');

hash.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = hash.read();
    if (data) {
        console.log(data.toString('hex'));
        // Prints:
        //   f7b89ef8ec74b3a3fbbdbe88e4088a36aa024df80b149f3bff9fbf333274d74d
    }
});

hash.write('node js focus group');
hash.end();