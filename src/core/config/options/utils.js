const colors = require('colors/safe');
const { prompt } = require('inquirer');
const fs = require('fs');
const path = require('path');

module.exports = {
    colors,
    prompt,
    fs,
    path,
    
    inativeConfigs,
    space,
    bigName
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
