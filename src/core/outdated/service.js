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

        let version = package.dependencies[packs[i].repositorio].split('.git#')[1];
        result.push({
            nome: packs[i].nome,
            atual: version,
            patch: await git.lastVersion(packs[i], version, 'p'),
            minor: await git.lastVersion(packs[i], version, 'm'),
            major: await git.lastVersion(packs[i])
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
    let maxVersion = _bigNameVersion(result);

    console.log('');
    console.log(colors.green.underline(_header(max, maxVersion)));
    console.log('');
    console.log(colors.white(_body(result, max, maxVersion)));
    console.log(colors.underline(''));
}

function _header(max, maxVersion) {
    return [
        _space('Nome', max + 5),
        _spaceMid('Atual', maxVersion + 2),
        _spaceMid('Patch', maxVersion + 2),
        _spaceMid('Minor', maxVersion + 2),
        _spaceMid('Major', maxVersion + 2)
    ].join('');
}

const cor = {
    1: 'red',
    2: 'yellow',
    3: 'white',
}

function _body(packages, max, maxVersion) {
    let body = [];
    packages.forEach(package => {
        let isOld = _isOld(package);
        body.push([
            colors[cor[isOld]](_space(package.nome, max + 5)) +
            _spaceMid(package.atual, maxVersion + 2),
            _spaceMid(package.patch, maxVersion + 2),
            _spaceMid(package.minor, maxVersion + 2),
            colors.green(_spaceMid(package.major, maxVersion + 2))
        ].join(''));
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

function _bigNameVersion(packages) {
    let tamanho = 0;
    packages.forEach(package => {
        let atual = package.atual.length;
        let patch = package.patch.length;
        let minor = package.minor.length;
        let major = package.major.length;

        tamanho = atual > patch && atual > minor && atual > major && atual > tamanho
            ? atual
            : patch > minor && patch > major && patch > tamanho
                ? patch
                : minor > major && minor > tamanho
                    ? minor
                    : major > tamanho
                        ? major
                        : tamanho

    });

    return tamanho;
}

function _space(value, tamanho) {
    return value + Array((tamanho + 1) - value.length).join(' ');
}

function _spaceMid(value, tamanho) {
    let resto = tamanho - value.length;
    let left = resto % 2 == 0 ? resto / 2 : ((resto - 1) / 2);
    let rigth = resto % 2 == 0 ? resto / 2 : ((resto - 1) / 2) + 1;
    return (Array(left + 1).join(' ') + value + Array(rigth + 1).join(' '));
}

function _isOld(package) {
    let atual = package.atual.replace(/[a-zA-Z]/g, '').split('.').map(Number);
    let last = package.major.replace(/[a-zA-Z]/g, '').split('.').map(Number);
    if (atual[0] < last[0]) return 1;
    if (atual[1] < last[1]) return 2;
    return 3;
}