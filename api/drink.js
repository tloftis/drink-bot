const fs = require('fs');
const path = require('path');
const os = require('os');
const drinks = require('../service/drinkManager');

drinks.init();

module.exports = (app, socket) => {
    app.route('/drinks')
        .get((req, res) => {
            res.status(200).json(drinks.getConfigs());
        })
        .post((req, res) => {
            let drink = req.body.config;
            delete drink.id;

            drinks.addDrinkConfig(drink).then((drink) => {
                res.status(200).json(drink);
            }, err => {
                res.status(400).json({
                    message: err && err.message || 'Unknown Error!'
                });
            })
        });

    app.route('/drinks/:id')
        .get((req, res) => {
            let id = req.params.id;
            res.status(200).json(drinks.getConfig(id));
        })
        .put((req, res) => {
            let id = req.params.id;
            let drink = req.body.config;
            drink.id = id;

            drinks.updateDrinkConfig(drink).then((drink) => {
                res.status(200).json(drink);
            }, err => {
                res.status(400).json({
                    message: err && err.message || 'Unknown Error!'
                });
            })
        })
        .delete((req, res) => {
            let id = req.params.id;

            drinks.deleteConfig(id).then((drink) => {
                res.status(200).json(drink);
            }, err => {
                res.status(400).json({
                    message: err && err.message || 'Unknown Error!'
                });
            })
        });

    app.route('/drinks/ids')
        .get((req, res) => {
            res.status(200).json(drinks.getConfigIds());
        });

    app.route('/drink-image/:id')
        .get((req, res) => {
            let id = req.params.id;

            drinks.getConfigImageReadStream(id).then((stream) => {
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
                drinks.addImageToConfig(id, tmpLoc).then(() => {
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
