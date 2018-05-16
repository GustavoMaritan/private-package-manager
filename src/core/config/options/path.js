const utils = require('./utils');

module.exports = _path;

async function _path(config) {
    let respostas = await utils.prompt([
        {
            message: 'nome:',
            type: 'input',
            name: 'name'
        },
        {
            message: 'caminho:',
            type: 'input',
            name: 'path'
        }
    ]);
    respostas.ativo = true;

    if (!respostas.path || !utils.fs.existsSync(respostas.path))
        throw { message: 'Caminho configuração inválido.' };

    if (config.configs.length)
        config.configs.forEach(element => { element.ativo = false });

    config.configs.push(respostas)

    utils.saveConfig(config);
    console.log(utils.colors.green('Ativo: ' + respostas.name));
}