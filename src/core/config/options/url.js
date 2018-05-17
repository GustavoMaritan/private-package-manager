const utils = require('./utils');
const user_config = require('../../../helpers/uteis/configs');

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

    utils.inativeConfigs(config)
    config.configs.push({
        "name": respostas.name,
        "url": respostas.url,
        "header": respostas.header,
        "ativo": true
    });
    user_config.saveConfig(config);
}