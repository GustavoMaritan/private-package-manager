let git = require('../../helpers/bitBucket/bit');
const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');
const spinner = require('../../helpers/uteis/spinner');

module.exports = async (name) => {
    git = await git();

    console.log();
    let sp = spinner('Carregando informações...');
    let packs = name ? [git.packs[name]] : git.packsToList(),
        pack_path = path.join(process.cwd(), 'package.json');

    _isValid(packs);

    let package = JSON.parse(fs.readFileSync(pack_path, 'utf-8'));

    let result = [];
    for (let i = 0; i < packs.length; i++) {
        if (!package.dependencies[packs[i].repositorio]) continue;

        let version = package.dependencies[packs[i].repositorio].split('#v')[1];
        result.push({
            nome: packs[i].nome,
            atual: version,
            patch: await git.lastVersion(packs[i].nome, version, 'p'),
            minor: await git.lastVersion(packs[i].nome, version, 'm'),
            major: await git.lastVersion(packs[i].nome)
        });
    }
    sp.stop(true);

    _print(result);
}

function _isValid(pack) {
    if (!pack.length) {
        console.log('');
        console.log(colors.red('Package não encontrado.'));
        console.log(colors.green('> ppk list '), 'para localizar o package.');
        throw '';
    }
}

function _print(result) {
    if (!result.length) return console.log('Nenhum package encontrado');
    let max = _bigName(result);

    console.log('');
    console.log(colors.green.underline(_header(max)));
    console.log('');
    console.log(colors.white(_body(result, max)));
    console.log(colors.underline(''));
}

function _header(max) {
    return [
        _space('Nome', max + 5),
        '  Atual  ',
        '  Patch  ',
        '  Minor  ',
        '  Major  '
    ].join('');
}

const cor = {
    1: 'red',
    2: 'yellow',
    3: 'white',
}

function _body(packages, max) {
    let body = [];
    packages.forEach(package => {
        let isOld = _isOld(package);
        body.push(
            colors[cor[isOld]](_space(package.nome, max + 5)) +
            `  ${package.atual.replace('v', '')}  ` +
            `  ${package.patch.replace('v', '')}  ` +
            `  ${package.minor.replace('v', '')}  ` +
            colors.green(`  ${package.major.replace('v', '')}  `)
        );
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

function _isOld(package) {
    let atual = package.atual.replace('v', '').split('.').map(Number);
    let last = package.major.replace('v', '').split('.').map(Number);
    if (atual[0] < last[0]) return 1;
    if (atual[1] < last[1]) return 2;
    return 3;
}