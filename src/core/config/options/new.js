const utils = require('./utils');
const user_config = require('../../../helpers/uteis/configs');

module.exports = _new;

async function _new(config, name) {
    let respostas = { name: name };

    respostas.bit_auth = await utils.prompt([
        {
            message: 'username:',
            type: 'input',
            name: 'username',
        },
        {
            message: 'password:',
            type: 'input',
            name: 'password',
        },
        {
            message: 'client_id:',
            type: 'input',
            name: 'client_id',
        },
        {
            message: 'client_secret:',
            type: 'input',
            name: 'client_secret',
        },
        {
            message: 'url_user:',
            type: 'input',
            name: 'url_user',
        }
    ]);

    let bit_clone = await utils.prompt([
        {
            message: 'Inserir usuário para clonar packages?',
            type: 'confirm',
            name: 'confirm',
        }
    ]);

    if (bit_clone.confirm) {
        respostas.bit_auth.bit_clone = await utils.prompt([
            {
                message: 'user:',
                type: 'input',
                name: 'user',
            },
            {
                message: 'pass:',
                type: 'input',
                name: 'pass',
            }
        ])
    }

    respostas.bit_packages = await $new_packages();

    config.configs.forEach(x => { x.ativo = false; });

    config.configs.push({
        "name": name,
        "path": utils.path.join(user_config.path_collection, name + '.json'),
        "ativo": true
    });

    user_config.saveCollection(respostas);
    user_config.saveConfig(config);
}

async function $new_packages() {
    let bit_packages = {};

    let respostas = await utils.prompt([
        {
            message: 'Package:',
            type: 'input',
            name: 'nome',
        }
    ]);

    if (!respostas.nome) return bit_packages;

    respostas = Object.assign(respostas, await utils.prompt([
        {
            message: 'repositorio:',
            type: 'input',
            name: 'repositorio',
        },
        {
            message: 'descricao:',
            type: 'input',
            name: 'descricao',
        }
    ]));

    bit_packages = { [respostas.nome]: respostas };
    return Object.assign(bit_packages, await $new_packages());
}