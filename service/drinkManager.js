const path = require('path');
const configManager = require('./configManager');
const defaultImg = path.resolve('public/images/default-bottle.png');

class DrinkConfigs extends configManager {
    constructor () {
        super();
        let _this = this;
        _this.initted = false;
    }
    async init () {
        let _this = this;

        if (_this.initted) {
            return Promise.resolve();
        }

        _this.initted = true;
        return _this.initalize('./configs/drinks', defaultImg);
    }
    async cleanConfig (config) {
        let uniqueHash = config.pins.reduce((hash, pin) => {
            hash[pin] = true;
            return hash;
        }, {});

        config.pins = Object.keys(uniqueHash);

        return config;
    }
    async checkAddConfig (config) {
        let _this = this;

        if (!config.pins || !(config.pins instanceof Array)) {
            throw new Error('Missing PINS in config!');
        }

        let configs = _this.getConfigs();

        let pins = configs.reduce((pins, iConfig) => {
            if (iConfig.id === config.id) {
                return pins;
            }

            return [...iConfig.pins, ...pins];
        }, []);

        for (let i = 0, cPin = config.pins[i]; i < config.pins.length; i++, cPin = config.pins[i]) {
            if (pins.indexOf(cPin) !== -1) {
                throw new Error(`Pin ${cPin} is already in use!`);
            }
        }

        return config;
    }
    async checkConfig (config) {
        let _this = this;

        if (!config.id) {
            throw new Error('Missing ID in config!');
        }

        return _this.checkAddConfig(config);
    }
    async updateDrinkConfig(config, createIfNotExist=false) {
        let _this = this;
        await _this.checkConfig(config);
        await _this.cleanConfig(config);
        return _this.updateConfig(config, createIfNotExist);
    }
    async addDrinkConfig (config, addIfExists=true) {
        let _this = this;
        await _this.checkAddConfig(config);
        await _this.cleanConfig(config);
        return _this.addConfig(config, addIfExists);
    }
}

module.exports = new DrinkConfigs();
