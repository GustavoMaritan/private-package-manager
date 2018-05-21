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
    async function lastVersion(package, version, type = 'mj') {

        let query = ['sort=-name', 'page=1', 'pagelen=1'];

        if (version) {
            let alias = '';
            if (/[a-zA-Z]/g.test(version))
                alias = version[0];

            let v = version.replace(/[a-zA-Z]/g, '').split('.');

            if (type != 'mj') {
                if (type == 'm') query.push(`q=name~"${alias}${v[0]}"`)
                if (type == 'p') query.push(`q=name~"${alias}${v[0]}.${v[1]}"`)
            }
        }

        const tag = await _tags({ nome: package.nome }, query);

        // if (tag && tag.values[0] && !package.alias && typeof package.alias != 'boolean') {
        //     package.alias = !/^(\w){1}[0-9].[0-9].[0-9]$/g.test() ? tag.values[0].name[0] : false;
        //     user_configs.saveCollection(user);
        //^([a-zA-Z]?){1}[0-9]{1,}.[0-9]{1,}.[0-9]{1,}$
        // }

        return tag && tag.values[0] ? tag.values[0].name : 'Não encontrado';
    }

    function urlBitBucket(package) {
        if (!user.bit_auth.bit_clone)
            throw { message: 'bit_clone não informado.' };

        return _concat([
            'https://', user.bit_auth.bit_clone.user, `:`, user.bit_auth.bit_clone.pass,
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
