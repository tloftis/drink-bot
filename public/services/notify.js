export default class EasyNotify {
    constructor (opts = {}) {
        let _this = this;

        _this.defaults = {
            theme: 'light',
            layout: 'bottomRight',
            timeout: 3000,
            progressBar: true,
            closeWith: ['click','timeout'],
            ...opts
        };
    }
    checkLoaded () {
        let _this = this;
        if (!Noty) {
            throw new Error('Requires Noty to be used!');
        }

        _this.Noty = Noty;
    }
    success (text = '', opts = {}) {
        let _this = this;
        _this.checkLoaded();
        let finalOpts = {
            ..._this.defaults,
            ...opts,
            type: 'success',
            text
        };

        return new _this.Noty(finalOpts);
    }
    error (text = '', opts = {}) {
        let _this = this;
        _this.checkLoaded();
        let finalOpts = {
            ..._this.defaults,
            ...opts,
            type: 'error',
            text
        };

        return new _this.Noty(finalOpts);
    }
    info (text = '', opts = {}) {
        let _this = this;
        _this.checkLoaded();
        let finalOpts = {
            ..._this.defaults,
            ...opts,
            type: 'info',
            text
        };

        return new _this.Noty(finalOpts);
    }
    alert (text = '', opts = {}) {
        let _this = this;
        _this.checkLoaded();
        let finalOpts = {
            ..._this.defaults,
            ...opts,
            type: 'alert',
            text
        };

        return new _this.Noty(finalOpts);
    }
    warning (text = '', opts = {}) {
        let _this = this;
        _this.checkLoaded();
        let finalOpts = {
            ..._this.defaults,
            ...opts,
            type: 'warning',
            text
        };

        return new _this.Noty(finalOpts);
    }
}
