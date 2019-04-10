const { spawn } = require('./helper');

class Wifi {
    constructor () {
        let _this = this;
        _this.spawn = spawn;
    }
    async list () {
        let _this = this;
        let out = await _this.spawn('nmcli', ['device', 'wifi']);

        // Separates each source by new line, then by double spaces since wifi names can have single, then removes any empty strings with a filter
        let source = out.split(`\n`).map(line => line.split(`  `).filter(a=>a));

        // Remove the header and any blank entries
        source = source.filter(ssid => (ssid[0] !== 'IN-USE') && !!ssid.length);

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

        return source.map(rawSSID => {
            let connected = false;

            if (rawSSID[0] === '*') {
                connected = true;
                rawSSID.shift();
            }

            return {
                connected,
                ssid: rawSSID[0],
                mode: rawSSID[1],
                channel: +rawSSID[2],
                rate: rawSSID[3],
                signalStrength: +rawSSID[4],
                barIcon: rawSSID[5],
                security: rawSSID[6],
                secure: rawSSID[6] !== 'None'
            }
        });
    }
    async rescan () {
        let _this = this;
        return _this.spawn('nmcli', ['device', 'wifi', 'rescan']);
    }
    async on () {
        let _this = this;
        return _this.spawn('nmcli', ['radio', 'wifi', 'on']);
    }
    async off () {
        let _this = this;
        return _this.spawn('nmcli', ['radio', 'wifi', 'off']);
    }
    async connect (ssid, password) {
        let _this = this;
        let args = ['device', 'wifi', 'connect', ssid];

        if (password) {
            args = [...args, 'password', password];
        }

        return _this.spawn('nmcli', args);
    }
}

module.exports = Wifi;
