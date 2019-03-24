const path = require('path');
const util = require('util');
const fs = require('fs');
const stream = require('stream');
const fsPromsifiy = {
    readdir: util.promisify(fs.readdir),
    readFile: util.promisify(fs.readFile),
    writeFile: util.promisify(fs.writeFile),
    lstat: util.promisify(fs.lstat),
    mkdir: util.promisify(fs.mkdir),
    rmdir: util.promisify(fs.rmdir),
    unlink: util.promisify(fs.unlink)
};

const deleteFolderRecursive = async (pathLoc) => {
    let stat = await fsPromsifiy.lstat(pathLoc);

    if (stat.isDirectory()) {
        let files = await fsPromsifiy.readdir(pathLoc);

        for (let i = 0, file = files[i]; i < files.length; i++, file = files[i]) {
            await deleteFolderRecursive(path.join(pathLoc, file));
        }

        await fsPromsifiy.rmdir(pathLoc);
    } else {
        await fsPromsifiy.unlink(pathLoc);
    }

    return true;
};

const getFileAsBase64 = async loc => {
    let rawBuff = await fsPromsifiy.readFile(loc);
    return new Buffer(rawBuff).toString('base64');
};

const safeJsonRequire = async source => {
    let strJson = await fsPromsifiy.readFile(source);
    return JSON.parse(strJson);
};

const isDirectory = async source => {
    let stat = await fsPromsifiy.lstat(source);
    return stat.isDirectory();
};

const getDirectories = async source => {
    let dirs = await fsPromsifiy.readdir(source);

    return dirs.map(name => {
        return path.resolve(path.join(source, name));
    }).filter(async (dir) => {
        return await isDirectory(dir);
    });
};

class Configs {
    constructor () {
        this.configDirs = [];
        this.configs = [];
    }
    nameToProperCase (str) {
        if (typeof str !== 'string') {
            throw new Error(`Expected type string for name but instead got type ${typeof str}!`);
        }

        if (str.length === 0) {
            throw new Error(`Name must be at least one character long!`);
        }

        return str.replace(/ /g, '-').split('-').map(word => {
            return word[0].toUpperCase() + word.substr(1, word.length).toLowerCase()
        }).join(' ');
    };
    nameToDashCase (str) {
        if (typeof str !== 'string') {
            throw new Error(`Expected type string for name but instead got type ${typeof str}!`);
        }

        if (str.length === 0) {
            throw new Error(`Name must be at least one character long!`);
        }

        return str.toLowerCase().replace(/ /g, '-');
    };
    async initalize (dirs, defaultImageLoc) {
        let _this = this;
        _this.configsLoc = path.resolve(dirs);
        _this.configDirs = await getDirectories(_this.configsLoc);
        _this.configs = [];
        _this.defaultImg = defaultImageLoc;

        for (let i = 0, dir = _this.configDirs[i]; i < _this.configDirs.length; i++, dir = _this.configDirs[i]) {
            let config = await safeJsonRequire(path.join(dir, 'config.json'));
            config.id = path.basename(dir);

            if (!config.image) {
                config.image = await getFileAsBase64(_this.defaultImg);
            }

            _this.configs.push(config);
        }

        _this.existingDocs = await fsPromsifiy.readdir(_this.configsLoc);
    }
    async updateConfig(config, createIfNotExist=false) {
        let _this = this;
        let existingConfig =  _this.getConfig(config.id);

        if (!createIfNotExist && !existingConfig) {
            throw new Error(`No existing configuration with ID ${config.id} found to update!`);
        }

        let newConfig = {
            ...existingConfig,
            ...config
        };

        newConfig.displayName = _this.nameToProperCase(newConfig.name);

        await fsPromsifiy.writeFile(`${_this.configsLoc}/${newConfig.id}/config.json`, JSON.stringify(newConfig, null, 2));
        await _this.initalize(_this.configsLoc, _this.defaultImg);
        return _this.getConfig(newConfig.id);
    }
    getConfig (id) {
        let _this = this;

        for (let i = 0, conf = _this.configs[i]; i < _this.configs.length; i++, conf = _this.configs[i]) {
            if (conf.id === id) {
                return conf;
            }
        }

        return null;
    }
    getConfigs () {
        let _this = this;
        return _this.configs;
    }
    getConfigIds () {
        let _this = this;
        return _this.configs.map(config => config.id);
    }
    async addConfig (config, addIfExists=true) {
        let _this = this;
        let name = _this.nameToDashCase(config.name);
        let id = name;
        let idx = 1;

        if (!config.image) {
            config.image = await getFileAsBase64(_this.defaultImg);
        }

        while (_this.existingDocs.indexOf(id) !== -1) {
            if (!addIfExists) {
                throw new Error(`Drink config ${id} already exists!`)
            }

            id = `${name}-${idx}`;
            idx++;
        }

        config.id = id;
        await fsPromsifiy.mkdir(`${_this.configsLoc}/${id}`);
        return _this.updateConfig(config, true);
    }
    async deleteConfig (id) {
        let _this = this;
        let loc = path.join(_this.configsLoc, id);
        await deleteFolderRecursive(loc);
        await _this.initalize(_this.configsLoc, _this.defaultImg);

        return { success: true };
    }
    async addImageToConfig (id, imgLoc) {
        let _this = this;
        let config = _this.getConfig(id);
        config.image = await getFileAsBase64(imgLoc);
        return _this.updateConfig(config);
    }
    async getConfigImageReadStream (id) {
        let _this = this;
        let config = _this.getConfig(id);

        if (!config.image) {
            return fs.createReadStream(_this.defaultImg)
        }

        let buf = new Buffer(config.image, 'base64'); // Ta-d
        let bufferStream = new stream.PassThrough();
        bufferStream.end(new Buffer(buf));

        return bufferStream;
    }
}

module.exports = Configs;
