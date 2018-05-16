const Token = require('./auth');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');

async function init() {
    const user = await _userConfig();
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
        return {
            uri: _url + rota,
            headers: {
                'Authorization': 'Bearer ' + await token.get()
            },
            json: true
        };
    }

    function _packRepositorio(nome) {
        return user.bit_packages[nome].repositorio;
    }

    function _prepareUrl(url, params) {
        if (!params.length) return url;
        return url + '?' + params.join('&');
    }

    async function _userConfig() {
        let config_path = path.join(__dirname, '..', 'user/config.json');

        if (!fs.existsSync(config_path)) {
            console.log();
            console.log(colors.red('Configurações não encontradas.'));
            console.log(colors.green('> ppk config --help'));
            throw null;
        }

        let obj = JSON.parse(fs.readFileSync(config_path));
        if (!obj.configs.length) return null;
        let userConfig = obj.configs.find(x => x.ativo);

        userConfig = !userConfig.url
            ? JSON.parse(fs.readFileSync(userConfig.path))
            : await _getConfigUrl(userConfig);

        return userConfig;
    }

    async function _getConfigUrl(config) {
        let retorno = await request({
            uri: config.url,
            method: 'get',
            headers: config.header,
            json: true
        });
        return retorno;
    }
}

module.exports = init;
