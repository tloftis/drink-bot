const { spawn } = require('child_process');

module.exports = {
    spawn (cmd, args) {
        return new Promise((resolve, reject) => {
            let nmcli = spawn(cmd, args);
            let out = '';
            let error = '';

            nmcli.stdout.on('data', (data) => {
                out += data;
            });

            nmcli.stderr.on('data', (data) => {
                error += data;
            });

            nmcli.on('close', (code) => {
                if (code) {
                    return reject(new Error(error || `Error: Unable to preform command, error code ${code}`));
                }

                resolve(out);
            });
        });
    }
};
