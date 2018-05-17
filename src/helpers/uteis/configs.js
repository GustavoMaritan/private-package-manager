const fs = require('fs');
const path = require('path');
const colors = require('colors');
const isWin = process.platform == 'win32';
const user_path = path.join(process.env.HOME, isWin ? '\\AppData\\Roaming' : '', 'ppk');

module.exports = {
    saveConfig,
    getConfigOrDefault,
    getConfig,
    getConfigAtiva,
    saveCollection,
    getCollectionAtiva,
    path_collection: path.join(user_path, 'collections')
}

function saveConfig(config) {
    const full_path = path.join(user_path, 'config');
    if (!fs.existsSync(user_path)) fs.mkdirSync(user_path);
    if (!fs.existsSync(full_path)) fs.mkdirSync(full_path);
    fs.writeFileSync(
        path.join(full_path, 'config.json'),
        JSON.stringify(config, undefined, 4)
    );
}

function getConfigOrDefault() {
    const full_path = path.join(user_path, 'config', 'config.json');

    let config = fs.existsSync(full_path)
        ? JSON.parse(fs.readFileSync(full_path, 'utf8'))
        : { configs: [] };

    return config;
}

function getConfig() {
    const full_path = path.join(user_path, 'config', 'config.json');

    if (!fs.existsSync(full_path)) {
        console.log('Cofiguração não encontrada.')
        console.log(colors.green('> ppk config --help'));
        throw null;
    }
    return JSON.parse(fs.readFileSync(full_path, 'utf8'));
}

function getConfigAtiva() {
    const full_path = path.join(user_path, 'config', 'config.json');

    if (!fs.existsSync(full_path)) {
        console.log('Cofiguração não encontrada.')
        console.log(colors.green('> ppk config --help'));
        throw null;
    }
    let config = JSON.parse(fs.readFileSync(full_path, 'utf8'));

    if (!config.configs || !config.configs.length) {
        console.log('Cofiguração não encontrada.')
        console.log(colors.green('> ppk config --help'));
        throw null;
    }

    return config.configs.find(x => x.ativo);
}

function saveCollection(collection) {
    const full_path = path.join(user_path, 'collections');
    if (!fs.existsSync(user_path)) fs.mkdirSync(user_path);
    if (!fs.existsSync(full_path)) fs.mkdirSync(full_path);

    collection.name = collection.name || 'semNome';

    fs.writeFileSync(
        path.join(full_path, collection.name + '.json'),
        JSON.stringify(collection, undefined, 4)
    );
}

async function getCollectionAtiva() {
    let config = getConfigAtiva();
    config = !config.url
        ? JSON.parse(fs.readFileSync(config.path))
        : await _getConfigUrl(config);
    return config;
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