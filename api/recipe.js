const fs = require('fs');
const path = require('path');
const os = require('os');
const recipies = require('../service/recipeManager');
const drinks = require('../service/drinkManager');

recipies.init();
drinks.init();

module.exports = (app, socket) => {
    app.route('/recipes')
        .get((req, res) => {
            res.status(200).json(recipies.getConfigs());
        })
        .post((req, res) => {
            let config = req.body.config;
            delete config.id;

            return recipies.addRecipieConfig(config).then((config) => {
                res.status(200).json(config);
            }, err => {
                res.status(400).json({
                    message: err && err.message || 'Unknown Error!'
                });
            })
        });

    app.route('/recipes/:id')
        .get((req, res) => {
            let id = req.params.id;
            let config = recipies.getConfig(id);

            if (!config) {
                return res.status(400).json({
                    message: `Config with id ${id} not found!`
                });
            }

            res.status(200).json(config);
        })
        .put((req, res) => {
            let id = req.params.id;
            let config = req.body.config;
            config.id = id;

            recipies.updateRecipieConfig(config).then((config) => {
                res.status(200).json(config);
            }, err => {
                res.status(400).json({
                    message: err && err.message || 'Unknown Error!'
                });
            })
        })
        .delete((req, res) => {
            let id = req.params.id;

            recipies.deleteConfig(id).then((drink) => {
                res.status(200).json(drink);
            }, err => {
                res.status(400).json({
                    message: err && err.message || 'Unknown Error!'
                });
            })
        });

    app.route('/recipe-image/:id')
        .get((req, res) => {
            let id = req.params.id;

            recipies.getConfigImageReadStream(id).then((stream) => {
                stream.pipe(res);
            }, err => {
                res.status(400).json({
                    message: err && err.message || 'Error uploading file!'
                });
            })
        })
        .put((req, res) => {
            let id = req.params.id;
            let stream;
            let tmpLoc;

            try {
                let folderLoc = fs.mkdtempSync(path.join(os.tmpdir(), 'img-'));
                tmpLoc = path.resolve(`${folderLoc}/temp`);
                let writeStream = fs.createWriteStream(tmpLoc);
                stream = req.pipe(writeStream);
            } catch (err) {
                return res.status(400).json({
                    message: err && err.message || 'Error uploading file!'
                });
            }

            stream.on('finish', () => {
                recipies.addImageToConfig(id, tmpLoc).then(() => {
                    res.status(200).json({
                        message: 'Image successfully added!'
                    });
                }, err => {
                    res.status(400).json({
                        message: err && err.message || 'Error uploading file!'
                    });
                })

            });

            stream.on('error', err => {
                res.status(400).json({
                    message: err && err.message || 'Error uploading file!'
                });
            });
        });
};
