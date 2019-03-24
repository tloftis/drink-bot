const fs = require('fs');
const path = require('path');
const os = require('os');

const recipies = require('../service/recipeManager');
const drinks = require('../service/drinkManager');

recipies.init();
drinks.init();

module.exports = (app, socket) => {
    app.route('/machine')
        .get((req, res) => {
            res.status(200).json({
                status: 'Operational'
            });
        });

    app.route('/machine/make/:id')
        .put(async (req, res) => {
            let id = req.params.id;
            let request = req.body.config;
            let config = recipies.getConfig(id);

            if (!config) {
                return res.status(400).json({
                    message: `Recipie ${id} was not found!`
                });
            }

            if (!request || !request.ounces) {
                return res.status(400).json({
                    message: `The amount must be specified!`
                });
            }

            let ounces = request.ounces;

            try {
                await recipies.checkConfig(config);
            } catch (err) {
                return res.status(400).json({
                    message: err.message
                });
            }

            let total = 0;
            for (let i = 0, recipe = config.ingredients[i]; i < config.ingredients.length; i++, recipe = config.ingredients[i]) {
                total += +recipe.parts;
                recipe.pin = drinks.getConfig(recipe.ingredient).pin;
            }

            let ratio = ounces/total;

            res.status(200).json(config);
        });
};
