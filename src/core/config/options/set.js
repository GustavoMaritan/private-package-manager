const utils = require('./utils');

module.exports = _set

function _set(config, name) {
    utils.inativeConfigs(config);
    let item = config.configs.find(x => x.name === x.name);
    if (!item) {
        console.error('Configuração não encontrada.');
        console.log('Use ', utils.colors.green('> ppk config -l '), 'para verificar opções disponíveis.');
    }
    item.ativo = true;
    utils.saveConfig(config)
    console.log(utils.colors.green('Ativo: ' + item.name));
}