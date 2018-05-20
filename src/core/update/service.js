let git = require('../../helpers/bitBucket/bit');
const colors = require('colors/safe');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const spinner = require('../../helpers/uteis/spinner');
const Promise = require('promise');

module.exports = async (name, options) => {
    git = await git();

    if (options.version) {/* a fazer */ }

    if (!options.patch && !options.minor && !options.major && !options.version)
        throw { message: 'Informe uma opção --[patch, minor, major, verion]' }

    let packs = name ? [git.packs[name]] : git.packsToList(),
        pack_path = path.join(process.cwd(), 'package.json'),
        package = JSON.parse(fs.readFileSync(pack_path, 'utf-8'));

    console.log();
    for (let i = 0; i < packs.length; i++) {
        if (!package.dependencies[packs[i].repositorio]) continue;
        let sp = spinner(`Atualizando ${packs[i].repositorio} ...`)

        let version = package.dependencies[packs[i].repositorio].split('#v')[1];
        let toVersion = await git.lastVersion(packs[i].nome, version,
            options.patch ? 'p' : options.minor ? 'm' : 'mj'
        );
        await uninstall(packs[i]);
        await install(packs[i], toVersion, sp);
    }
}

async function uninstall(pack) {
    return new Promise((resolve, reject) => {
        exec(`npm uninstall ${pack.repositorio}`, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

async function install(pack, version, sp) {
    return new Promise((resolve, reject) => {
        exec(`ppk i ${pack.nome} -v ${version}`, (err) => {
            sp.stop(true);
            if (err) return reject(err);
            console.log(colors.magenta(`${pack.repositorio}@${version}`));
            resolve();
        });
    });
}
