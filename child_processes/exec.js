const { exec, spawn } = require('child_process');

exec('find . -type f | wc -l', (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }

    console.log(`Number of files ${stdout}`);
});


/*
const child = spawn('find . -type f | wc -l', {
    stdio: 'inherit',
    shell: true
});

process.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`);
});

process.stderr.on('data', (data) => {
    console.error(`child stderr:\n${data}`);
});*/
