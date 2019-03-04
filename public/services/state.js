export default class EasyState {
    constructor () {
        let _this = this;
        _this.location = window.location;
        _this.decodeURIComponent = decodeURIComponent;
        _this.base = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    }
    async getParams () {
        let _this = this;
        return _this.location.search
            .substr(1)
            .split('&')
            .reduce(function (glob, item) {
                let tmp = item.split('=');

                if (!tmp[0] || !tmp[1]) {
                    return glob;
                }

                glob[tmp[0]] = _this.decodeURIComponent(tmp[1]);
                return glob
            }, {});
    }
    async goToState (path, params = {}) {
        let _this = this;

        let query = Object.keys(params).map(key => {
            return `${key}=${params[key]}`;
        });

        window.location = `${_this.base}/${path}${query.length ? `?${query}` : `` }`
    }
    async routeParams () {

    }
}
