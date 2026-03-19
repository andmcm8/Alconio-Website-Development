const { spawn } = require('child_process');
const path = require('path');

function startProcess(name, command, args, cwd) {
    console.log(`Starting ${name}...`);
    const proc = spawn(command, args, {
        cwd: cwd,
        stdio: 'inherit',
        shell: true,
        detached: true
    });

    proc.on('error', (err) => {
        console.error(`Failed to start ${name}:`, err);
    });

    proc.on('exit', (code) => {
        console.log(`${name} exited with code ${code}. Restarting in 5s...`);
        setTimeout(() => startProcess(name, command, args, cwd), 5000);
    });

    return proc;
}

const root = '/Users/andresmcmahon/Documents/Alconio Website';

// Start API Server (3000)
startProcess('API Server', 'node', ['server.js'], root);

// Start Static Server (8081)
startProcess('Static Server', 'node', ['dev_server.js'], root);

console.log('--- Servers Manager Started ---');
console.log('API: http://localhost:3000');
console.log('Static: http://localhost:8081');
