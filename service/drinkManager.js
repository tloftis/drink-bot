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
    async checkConfig (config) {
        if (!config.id) {
            throw new Error('Missing ID in config!');
        }

        if (!config.pin) {
            throw new Error('Missing PIN in config!');
        }

        return config;
    }
    async checkAddConfig (config) {
        if (!config.pin) {
            throw new Error('Missing PIN in config!');
        }

        return config;
    }
    async updateDrinkConfig(config, createIfNotExist=false) {
        let _this = this;
        await _this.checkConfig(config);
        return _this.updateConfig(config, createIfNotExist);
    }
    async addDrinkConfig (config, addIfExists=true) {
        let _this = this;
        await _this.checkAddConfig(config);
        return _this.addConfig(config, addIfExists);
    }
}

module.exports = new DrinkConfigs();
