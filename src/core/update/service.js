let git = require('../../helpers/bitBucket/bit');
const colors = require('colors/safe');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const spinner = require('../../helpers/uteis/spinner');
const Promise = require('promise');

module.exports = async (name, options) => {
    git = await git();

    if (options.set && !name) {
        console.log()
        console.log('Para update version informe o nome do package')
        console.log(colors.green('> ppk u package_name -s 0.0.0'));
        return;
    }

    if (!options.patch && !options.minor && !options.major && !options.set)
        throw { message: 'Informe uma opção --[patch, minor, major, set]' }

    let packs = name ? [git.packs[name]] : git.packsToList(),
        pack_path = path.join(process.cwd(), 'package.json'),
        package = JSON.parse(fs.readFileSync(pack_path, 'utf-8'));

    console.log();
    for (let i = 0; i < packs.length; i++) {
        if (!package.dependencies[packs[i].repositorio]) continue;
        let sp = spinner(`Atualizando ${packs[i].repositorio} ...`)

        let version = package.dependencies[packs[i].repositorio].split('.git#')[1];
        let toVersion = options.set
            ? options.set
            : await git.lastVersion(packs[i], version,
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
        exec(`ppk i ${pack.nome} -v "${version}"`, (err) => {
            sp.stop(true);
            if (err) return reject(err);
            console.log(colors.magenta(`${pack.repositorio}@${version}`));
            resolve();
        });
    });
}
