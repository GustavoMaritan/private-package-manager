const utils = require('./utils');

module.exports = _list;

function _list(config) {
    console.log();

    let max = utils.bigName(config);

    config.configs.sort((a, b) => {
        return a.name > b.name;
    }).forEach(x => {
        console.log(
            utils.colors[`${x.ativo ? 'green' : 'white'}`](`> ${utils.space(x.name, max + 3)} - ${x.ativo ? 'ON' : 'OFF'}`)
        );
    });
}
