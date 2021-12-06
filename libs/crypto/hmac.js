const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', 'a secret');

hmac.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = hmac.read();
    if (data) {
        console.log(data.toString('hex'));
        // Prints:
        //   83f92b0ecb2efa057642082b22b25d678d2cb4cca506e71f4015c47d89098a00
    }
});

hmac.write('node js focus group');
hmac.end();