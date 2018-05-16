const utils = require('./utils');

module.exports = _url;

async function _url(config) {
    let respostas = await utils.prompt([
        {
            message: 'Config name:',
            type: 'input',
            name: 'name',
        },
        {
            message: 'url:',
            type: 'input',
            name: 'url',
        }
    ]);

    let header = await utils.prompt([
        {
            message: 'Definir header autenticação?',
            type: 'confirm',
            name: 'confirm',
        }
    ]);

    if (header.confirm) {
        let token = await utils.prompt([
            {
                message: 'Header name:',
                type: 'input',
                name: 'name',
            },
            {
                message: 'Token:',
                type: 'input',
                name: 'value',
            }
        ]);
        respostas.header = {
            name: token.name,
            token: token.value
        }
    }
    config.configs.forEach(element => {
        element.ativo = false
    });
    config.configs.push({
        "name": respostas.name,
        "url": respostas.url,
        "header": respostas.header,
        "ativo": true
    });
    utils.saveConfig(config);
}