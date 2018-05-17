const Token = require('./auth');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
const user_configs = require('../uteis/configs');

async function init() {
    const user = await user_configs.getCollectionAtiva();
    const _url = `https://api.bitbucket.org/2.0/repositories/${user.bit_auth.url_user}/`;
    const token = new Token(user.bit_auth);

    return {
        packs: user.bit_packages,
        packsToList,
        lastVersion,
        urlBitBucket
    }

    /**
     * 
     * @param {String} name 
     * @param {String} version 
     * @param {String} type p=patch, m=minor, mj=major
     */
    async function lastVersion(name, version, type = 'mj') {

        let query = ['sort=-name', 'page=1', 'pagelen=1'];

        if (version) {
            let v = version.replace('v', '').split('.');

            if (type != 'mj') {
                if (type == 'm') query.push(`q=name~"v${v[0]}"`)
                if (type == 'p') query.push(`q=name~"v${v[0]}.${v[1]}"`)
            }
        }
        const tag = await _tags({ nome: name }, query);
        return tag ? tag.values[0].name : null;
    }

    function urlBitBucket(package) {
        return _concat([
            'https://',
            user.bit_auth.bit_clone ? user.bit_auth.bit_clone.user : user.bit_auth.username,
            `:`,
            user.bit_auth.bit_clone ? user.bit_auth.bit_clone.pass : user.bit_auth.password,
            `@bitbucket.org/${user.bit_auth.url_user}/`,
            package.repositorio, `.git#`, package.version
        ]);
    }

    function packsToList() {
        let list = [];
        for (let i in user.bit_packages)
            list.push(user.bit_packages[i]);
        return list;
    }

    // PRIVATES

    async function _tags(params, query) {
        let url = _prepareUrl(_packRepositorio(params.nome) + '/refs/tags', query);
        return await request(await _api(url));
    }

    function _concat(params, char = '') {
        return params.join(char);
    }

    async function _api(rota) {
        try {
            let tk = await token.get();
            return {
                uri: _url + rota,
                headers: {
                    'Authorization': 'Bearer ' + tk
                },
                json: true
            };
        } catch (error) {
            throw 'Token bitbucket inválido, verifique suas credenciais.';
        }
    }

    function _packRepositorio(nome) {
        return user.bit_packages[nome].repositorio;
    }

    function _prepareUrl(url, params) {
        if (!params.length) return url;
        return url + '?' + params.join('&');
    }
}

module.exports = init;
