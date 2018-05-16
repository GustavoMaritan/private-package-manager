let git = require('../../helpers/bitBucket/bit');
const colors = require('colors/safe');
const { exec } = require('child_process');
const spinner = require('../../helpers/uteis/spinner');

module.exports = async (name, options) => {
    git = await git();

    console.log();
    let pack = git.packs[name];
    let sp = spinner('Carregando informações...');
    _isValid(pack);

    pack.version = !options.version
        ? await git.lastVersion(name)
        : 'v' + options.version.replace('v', '');
    sp.stop(true);
    sp = spinner(`Instalando ${pack.repositorio}@${pack.version}`);

    let url = git.urlBitBucket(pack);

    exec(`npm i '${url}' --save`, (err, st, std) => {
        sp.stop(true);
        if (err) return _msgError(err);
        console.log(colors.magenta(`${pack.repositorio}@${pack.version}`));
    })
}

function _msgError(err) {
    console.log();
    console.log(colors.red(err));
}

function _isValid(pack) {
    if (!pack) {
        console.log('');
        console.log(colors.red('Package não encontrado.'));
        console.log(colors.green('> ppk list '), 'para localizar o package.');
        throw '';
    }
}