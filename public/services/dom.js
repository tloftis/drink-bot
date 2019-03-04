export default class EasyDom {
    constructor () {
        let _this = this;
        _this.base = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/`;
    }
    async createElm (elm, classes=[], attributes={}) {
        let _this = this;
        let dom = document.createElement(elm);

        if (typeof classes === 'string') {
            classes = [classes];
        }

        classes.forEach(className => {
            dom.classList.add(className);
        });

        Object.keys(attributes).forEach(key => {
            dom.setAttribute(key, attributes[key]);
        });

        return dom;
    }
    querySelectorAll (sector='', queryObj=document) {
        let _this = this;

        if (!sector.length) {
            throw new Error('Missing selector string!');
        }

        let rowsNodelist = queryObj.querySelectorAll(sector); //selects the query named img
        let array = [];

        if (!rowsNodelist.length) {
            return array;
        }

        rowsNodelist.forEach(element => array.push(element));
        return array;
    }
    querySelector (sector='', queryObj=document) {
        let _this = this;

        if (!sector.length) {
            throw new Error('Missing selector string!');
        }

        return queryObj.querySelector(sector) || {}; //selects the query named img
    }
    get (sector='', queryObj=document) {
        let _this = this;

        if (!sector.length) {
            throw new Error('Missing selector string!');
        }

        return queryObj.querySelector(sector) || {}; //selects the query named img
    }
}
