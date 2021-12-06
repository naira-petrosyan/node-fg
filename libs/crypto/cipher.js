// Import module into your application
const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
let globalIv;
// We will first generate the key, as it is dependent on the algorithm.
// In this case for aes192, the key is 24 bytes (192 bits).
let encrypted = '';
crypto.scrypt(password, 'salt', 24, (err, key) => {
    if (err) throw err;
    // After that, we will generate a random iv (initialization vector)
    crypto.randomFill(new Uint8Array(16), (err, iv) => {
        if (err) throw err;

        globalIv = iv;
        // Create Cipher with key and iv
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        cipher.setEncoding('hex');

        cipher.on('data', (chunk) => encrypted += chunk);
        cipher.on('end', () => console.log(encrypted));// Prints encrypted data with key

        cipher.write('node focus group');
        cipher.end();


        // We will first generate the key, as it is dependent on the algorithm.
// In this case for aes192, the key is 24 bytes (192 bits).
// We will use the async `crypto.scrypt()` instead for deciphering.
// The IV is usually passed along with the ciphertext.
// const iv = ivInstance.get();//Buffer.alloc(16, 0); // Initialization vector.

// Create decipher with key and iv
        const decipher = crypto.createDecipheriv(algorithm, key, globalIv);

        let decrypted = '';
        decipher.on('readable', () => {
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        });
        decipher.on('end', () => {
            console.log(decrypted);
            // Prints: some clear text data
        });

// Encrypted with same algorithm, key and iv.
// const encrypted =
//     '618e6d8acb24a63cfc42864476fda27bfbb80c3a2d708058a2bba6f262f5b5ca';
        decipher.write(encrypted, 'hex');
        decipher.end();
    });
});
