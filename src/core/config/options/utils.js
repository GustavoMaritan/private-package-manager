
const colors = require('colors/safe');
const { prompt } = require('inquirer');
const fs = require('fs');
const path = require('path');
const path_config = path.join(__dirname, '../../../helpers/user/config.json');
const path_user_configs = path.join(__dirname, '../../../resources/user-configs/');

module.exports = {
    colors,
    prompt,
    fs,
    path,
    path_config,
    path_user_configs,

    saveConfig,
    inativeConfigs,
    
    space,
    bigName
}

function saveConfig(config) {
    fs.writeFileSync(path_config, JSON.stringify(config, undefined, 4));
}

function inativeConfigs(config) {
    config.configs.forEach(x => { x.ativo = false });
}


function space(value, chars = 2, position = 'r') {
    return (position == 'l' ? '' : value) +
        Array((chars + 1) - value.length).join(' ') +
        (position == 'r' ? '' : value);
}

function bigName(config) {
    let max = 0;
    config.configs.forEach(x => {
        max = x.name.length > max ? x.name.length : max;
    });
    return max;
}
