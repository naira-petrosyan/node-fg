# Crypto

Cryptography is the process of converting plain text into unreadable text and vice-versa. This way, only the sender and receiver of the information understand its content.

With cryptography in Node.js, you can hash passwords and store them in the database so that data cannot be converted to plain text after it is hashed; it can only be verified. 

The Node.js crypto module provides cryptographic functions to help you secure your Node.js app. It includes a set of wrappers for OpenSSL’s hash, HMAC, cipher, decipher, sign, and verify functions.

crypto allows you to hash plain texts before storing them in the database. For this, you have a hash class that can create fixed length, deterministic, collision-resistant, and unidirectional hashes. For hashed data, a password cannot be decrypted with a predetermined key, unlike encrypted data. An HMAC class is responsible for Hash-based Message Authentication Code, which hashes both key and values to create a single final hash.
You may need toencrypt and decrypt other user data later for transmission purposes. This is where the Cipher and Decipher classes come in. You can encrypt data with the Cipher class and decrypt it with the Decipher class.
You can also verify encrypted or hashed passwords to ensure they are valid. All you need is the Verify class. Certificates can also be signed with thesign class.

## Classes
### Cipher
The Cipher class is responsible for encrypting information. When the user inputs a password during registration, the Cipher class is called to encrypt the password.
First, we’ll generate a key from an algorithm. After that, we’ll generate a random initialization number (iv) before encrypting the text.
To use this class, you have to create a cipher instance using crypto.createCipheriv()
```js
// Import module into your application
const crypto = require('crypto');

const algorithm = 'aes-192-cbc';
const password = '2001MyForever';

// We will first generate the key, as it is dependent on the algorithm.
// In this case for aes192, the key is 24 bytes (192 bits).
crypto.scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // After that, we will generate a random iv (initialization vector)
  crypto.randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Create Cipher with key and iv
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));// Prints encrypted data with key

    cipher.write('some clear text data');
    cipher.end();
  });
});
```
### Decipher
The Decipher class is responsible for decrypting encrypted texts. When you intend to send information securely to another developer, you have to encrypt it. The only way the receiver of the information can read the information is to decrypt it. This is exactly what the Decipher class does.

The crypto.createDecipheriv() method is used to create decipher instances.

```js
// Import module into your application
const crypto = require('crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// We will first generate the key, as it is dependent on the algorithm.
// In this case for aes192, the key is 24 bytes (192 bits).
// We will use the async `crypto.scrypt()` instead for deciphering.
const key = crypto.scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

// Create decipher with key and iv
const decipher = crypto.createDecipheriv(algorithm, key, iv);

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
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

### Hash

The Hash class is used for plain text hashing purpose. Hashing simply converts plain text into hash functions. Hashed text cannot be converted back to its original version. You cannot create hash objects directly with the new keyword.  
To create a hash instance, use the crypto.createHash() method, as shown in the example below:

```js

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
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

### HMAC
HMAC stands for Hash-based Message Authentication Code, and is a process for applying a hash algorithm to both data and a secret key that results in a single final hash. Its use is similar to that of a vanilla hash, but also allows to check the authenticity of data as well as the integrity of said data 
```js
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```