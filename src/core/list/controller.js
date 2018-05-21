const colors = require('colors/safe');

module.exports = (commander) => {
    commander
        .command('list')
        .alias('l')
        .description('Lista todos packages disponiveis.')
        .action(async () => {
            try {
                const packages = await require('./service')();
                const max = _bigName(packages);
                _print(packages, max);
            } catch (error) {
                if (error) console.log(error);
            }
            await $finish();
        })
        .on('--help', function () {
            console.log();
            console.log('  Examples:');
            console.log();
        });

    return commander;
};

function _print(packages, max) {
    console.log('');
    console.log(colors.green.underline(_header(max)));
    console.log('');
    console.log(colors.white(_body(packages, max)));
    console.log(colors.underline(''));
}

function _header(max) {
    return [
        _space('Nome', max + 5),
        ' Versão '
    ].join('');
}

function _body(packages, max) {
    let body = [];
    packages.forEach(package => {
        body.push(_space(package.nome, max + 5) + ` ${package.version} `);//.replace(/[a-zA-Z]/g, '')
    });
    return body.join('\n');
}

function _bigName(packages) {
    let tamanho = 0;

    packages.forEach(package => {
        tamanho = package.nome.length > tamanho
            ? package.nome.length
            : tamanho;
    });

    return tamanho;
}

function _space(value, tamanho) {
    return value + Array((tamanho + 1) - value.length).join(' ');
}