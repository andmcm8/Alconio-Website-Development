const { execSync } = require('child_process');

function killPort(port) {
    try {
        console.log(`Checking port ${port}...`);
        const pids = execSync(`lsof -t -i:${port}`).toString().trim().split('\n');
        pids.forEach(pid => {
            if (pid) {
                console.log(`Killing PID ${pid} on port ${port}`);
                try {
                    process.kill(parseInt(pid), 'SIGKILL');
                } catch (err) {
                    console.error(`Failed to kill ${pid}: ${err.message}`);
                }
            }
        });
    } catch (e) {
        console.log(`No process found on port ${port}`);
    }
}

killPort(3000);
killPort(8081);
console.log('Force restart script completed.');
process.exit(0);
