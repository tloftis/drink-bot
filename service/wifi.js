const { spawn } = require('child_process');

class NetworkManager {
    constructor () {
        let _this = this;
        _this.spawn = spawn;
    }
    wifiList () {
        let _this = this;

        return new Promise((resolve, reject) => {
            let nmcli = _this.spawn('nmcli', ['device', 'wifi']);
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
                    return reject(new Error(error || `Error: Unable to get access points, error code ${code}`));
                }

                // Separates each source by new line, then by double spaces since wifi names can have single, then removes any empty strings with a filter
                let source = out.split(`\n`).map(line => line.split(`  `).filter(a=>a));

                // Remove the header and any blank entries
                source = source.filter(ssid => (ssid[0] !== 'IN-USE') && !!ssid.length);
                let carCodes = (str) =>{
                    return str.split('').map(char=>char.charCodeAt(0) + '').join(' ');
                };

                //Trim the items, and look for -- which means none
                source = source.map(line => {
                    return line.map(item => {
                        let nItem = item.trim();

                        if (nItem === '--') {
                            return 'None';
                        }

                        return nItem;
                    });
                });

                let ssds = source.map(rawSSID => {
                    if (rawSSID[0] === '*') {
                        return {
                            connected: true,
                            ssid: rawSSID[1],
                            mode: rawSSID[2],
                            channel: +rawSSID[3],
                            rate: rawSSID[4],
                            signalStrength: +rawSSID[5],
                            barIcon: rawSSID[6],
                            security: rawSSID[7],
                            secure: rawSSID[7] !== 'None'
                        }
                    }
                    return {
                        connected: false,
                        ssid: rawSSID[0],
                        mode: rawSSID[1],
                        channel: +rawSSID[2],
                        rate: rawSSID[3],
                        signalStrength: +rawSSID[4],
                        barIcon: rawSSID[5],
                        security: rawSSID[6],
                        secure: rawSSID[7] !== 'None'
                    }
                });

                resolve(ssds);
            });

        });
    }
    wifiRescan () {
        let _this = this;

        return new Promise((resolve, reject) => {
            let nmcli = _this.spawn('nmcli', ['device', 'wifi', 'rescan']);
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
                    return reject(new Error(error || `Error: Unable to get access points, error code ${code}`));
                }

                resolve();
            });

        });
    }
    wifiConnect(ssid, password) {
        let _this = this;

        return new Promise((resolve, reject) => {
            let nmcli;

            if (password) {
                nmcli = _this.spawn('nmcli', ['device', 'wifi', 'connect', ssid, password]);
            } else {
                nmcli = _this.spawn('nmcli', ['device', 'wifi', 'connect', ssid]);
            }
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
                    return reject(new Error(error || `Error: Unable to connect to access point ${ssid}, error code ${code}`));
                }

                resolve();
            });

        });
    }
}

module.exports = NetworkManager;
