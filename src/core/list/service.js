let git = require('../../helpers/bitBucket/bit');
const spinner = require('../../helpers/uteis/spinner');

module.exports = async () => {
    git = await git();

    console.log();
    let sp = spinner();
    let packages = git.packsToList();

    for (let i = 0; i < packages.length; i++)
        packages[i].version = await git.lastVersion(packages[i].nome);

    sp.stop(true);

    return packages;
}

