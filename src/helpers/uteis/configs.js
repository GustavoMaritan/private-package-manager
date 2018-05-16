const fs = require('fs');
const path = require('path');
const colors = require('colors');
const isWin = process.platform == 'win32';
const user_path = path.join(process.env.HOME, isWin ? '\\AppData\\Roaming' : '', 'ppk');

module.exports = {
    saveConfig
}

async function saveConfig(config) {
    const full_path = path.join(user_path, 'config');
    if (!fs.existsSync(user_path)) fs.mkdirSync(user_path);
    if (!fs.existsSync(full_path)) fs.mkdirSync(full_path);
    fs.writeFileSync(
        path.join(full_path, 'config.json'),
        JSON.stringify(config, undefined, 4)
    );
}

async function getConfig() {
    const full_path = path.join(user_path, 'config', 'config.json');

    if (!fs.existsSync(full_path)) {
        console.log('Cofiguração não encontrada.')
        console.log(colors.green('> ppk config --help'));
        throw null;
    }
    return JSON.parse(fs.readFileSync(full_path, 'utf8'));
}

async function saveCollections(collection) {
    const full_path = path.join(user_path, 'collections');
    if (!fs.existsSync(user_path)) fs.mkdirSync(user_path);
    if (!fs.existsSync(full_path)) fs.mkdirSync(full_path);

    collection.name = collection.name || 'semNome';

    fs.writeFileSync(
        path.join(full_path, collection.name + '.json'),
        JSON.stringify(collection, undefined, 4)
    );
}

async function getCollections(name) {
    const full_path = path.join(user_path, 'collections', name + '.json');

    if (!fs.existsSync(full_path)) {
        console.log('Collection não encontrada.')
        console.log(colors.green('> ppk config --help'));
        throw null;
    }
    
    return JSON.parse(fs.readFileSync(full_path, 'utf8'));
}