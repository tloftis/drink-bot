const path = require('path');
const configManager = require('./configManager');
const drinks = require('./drinkManager');
const defaultImg = path.resolve('public/images/default.png');

drinks.init();

class RecipieConfigs extends configManager {
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
        return _this.initalize('./configs/recipies', defaultImg);
    }
    async checkConfig (config) {
        if (!Array.isArray(config.ingredients)) {
            throw new Error('Missing ingredients in config!');
        }

        for (let i = 0, ingredient = config.ingredients[i]; i < config.ingredients.length; i++, ingredient = config.ingredients[i]) {
            if (!drinks.getConfig(drinks.nameToDashCase(ingredient.ingredient))) {
                throw new Error(`Error: Ingredient ${ingredient.ingredient} Doesn't Exist!`);
            }
        }

        if (!config.id) {
            throw new Error('Missing ID in config!');
        }

        return config;
    }
    async checkAddConfig (config) {
        if (!Array.isArray(config.ingredients)) {
            throw new Error('Missing ingredients in config!');
        }

        for (let i = 0, ingredient = config.ingredients[i]; i < config.ingredients.length; i++, ingredient = config.ingredients[i]) {
            if (!drinks.getConfig(drinks.nameToDashCase(ingredient.ingredient))) {
                throw new Error(`Error: Ingredient ${ingredient.ingredient} Doesn't Exist!`);
            }
        }

        return config;
    }
    async updateRecipieConfig(config, createIfNotExist=false) {
        let _this = this;
        await _this.checkConfig(config);
        return _this.updateConfig(config, createIfNotExist);
    }
    async addRecipieConfig (config, addIfExists=true) {
        let _this = this;
        await _this.checkAddConfig(config);
        return _this.addConfig(config, addIfExists);
    }
}

module.exports =  new RecipieConfigs();
