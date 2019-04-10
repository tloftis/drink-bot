const { spawn } = require('./helper');

class Hotspot {
    constructor () {
        let _this = this;
        _this.spawn = spawn;
    }
    async add (ssid, adapter) {
        let _this = this;
        return _this.spawn('nmcli', ['con', 'add', 'type', 'wifi', 'ifname', adapter, 'con-name', ssid, 'autoconnect', 'yes', 'ssid', ssid]);
    }
    async modify (ssid, opts) {
        let _this = this;
        return _this.spawn('nmcli', ['con', 'modify', ssid, ...opts]);
    }
    async setup (ssid, adapter, password) {
        let _this = this;
        await _this.add (ssid, adapter);
        await _this.modify (ssid, ['802-11-wireless.mode', 'ap', '802-11-wireless.band', 'bg', 'ipv4.method', 'shared']);
        await _this.modify (ssid, ['wifi-sec.key-mgmt', 'wpa-psk']);
        await _this.modify (ssid, ['wifi-sec.psk', password]);
    }
    async up (ssid) {
        let _this = this;
        return _this.spawn('nmcli', ['con', 'up', ssid]);
    }
    async down (ssid) {
        let _this = this;
        return _this.spawn('nmcli', ['con', 'down', ssid]);
    }
    async hotspot (ssid, adapter, password, band, channel) {
        let _this = this;
        let args = ['device', 'wifi', 'hotspot', 'ifname', adapter, 'con-name', ssid,'ssid', ssid];

        if (band) {
            let legalBand = ['a', 'bg'];

            if (legalBand.indexOf(band) === -1) {
                throw new Error(`Band ${band} is not part of allowed bands [${legalBand.join(', ')}]`);
            }

            args = [...args, 'band', band];
        }

        if (channel) args = [...args, 'channel', channel];
        if (password) args = [...args, 'password', password];

        return _this.spawn('nmcli', args);
    }
}

module.exports = Hotspot;
