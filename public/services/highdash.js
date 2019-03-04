export default class HighDash {
    constructor () {
        let _this = this;
    }
    get (obj={}, tail='') {
        let _this = this;
        let keys = tail.replace(/\[/g,'.').replace(/\]/g,'.').split('.').filter(a=>a);

        return keys.reduce((key, glob) => {
            return glob && glob[key];
        }, obj);
    }
}
