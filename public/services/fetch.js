export default class EasyFetch {
    constructor () {
        let _this = this;
        _this.base = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/`;
    }
    async post (url, data, headers={}) {
        let _this = this;
        let finalUrl = `${_this.base}${url}`;

        let resp = await fetch(finalUrl, {
            method: 'POST',
            body: typeof data === 'string' ? data :JSON.stringify(data),
            headers: new Headers(headers)
        });

        let resData = await resp.json();

        if (resp.status !== 200) {
            throw new Error(resData || 'Error occurred while requesting data')
        }

        return resData;
    }
    async postJson (url, data, headers={}) {
        let _this = this;
        let finalUrl = `${_this.base}${url}`;

        headers['Content-type'] = 'application/json';

        let resp = await fetch(finalUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers(headers || {})
        });

        let resData = await resp.json();

        if (resp.status !== 200) {
            throw new Error(resData.message || 'Error occurred while requesting data')
        }

        return resData
    }
    async put (url, data, headers={}, noJson=false) {
        let _this = this;
        let finalUrl = `${_this.base}${url}`;

        if (!noJson) {
            headers['Content-type'] = 'application/json';
        }

        let resp = await fetch(finalUrl, {
            method: 'PUT',
            body: noJson ? data : JSON.stringify(data),
            headers: new Headers(headers)
        });

        return resp.json();
    }
    async putJson (url, data, headers={}) {
        let _this = this;
        let finalUrl = `${_this.base}${url}`;

        headers['Content-type'] = 'application/json';

        let resp = await fetch(finalUrl, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers(headers)
        });

        let resData = await resp.json();

        if (resp.status !== 200) {
            throw new Error(resData.message || 'Error occurred while requesting data')
        }

        return resData
    }
    async delete (url, headers={}) {
        let _this = this;
        let finalUrl = `${_this.base}${url}`;

        let resp = await fetch(finalUrl, {
            method: 'DELETE',
            headers: new Headers(headers)
        });

        return resp.json();
    }
    async deleteJson (url, headers={}) {
        let _this = this;
        let finalUrl = `${_this.base}${url}`;

        let resp = await fetch(finalUrl, {
            method: 'DELETE',
            headers: new Headers(headers)
        });

        let resData = await resp.json();

        if (resp.status !== 200) {
            throw new Error(resData.message || 'Error occurred while requesting data')
        }

        return resData
    }
    async get (url, params, headers={}) {
        let _this = this;
    	let query = (new URLSearchParams(params || {})).toString();
    	let finalUrl = `${_this.base}${url}${query ? `?${query}` : ''}`;

        let resp = await fetch(finalUrl, {
            method: 'GET',
            headers: new Headers(headers)
        });

        return resp.json();
    }
    async getJson (url, params, headers={}) {
        let _this = this;
        let query = (new URLSearchParams(params || {})).toString();
        let finalUrl = `${_this.base}${url}${query ? `?${query}` : ''}`;

        let resp = await fetch(finalUrl, {
            method: 'GET',
            headers: new Headers(headers)
        });

        let resData = await resp.json();

        if (resp.status !== 200) {
            throw new Error(resData.message || 'Error occurred while requesting data')
        }

        return resData
    }
}
