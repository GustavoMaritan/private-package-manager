let git = require('../../helpers/bitBucket/bit');
const spinner = require('../../helpers/uteis/spinner');

module.exports = async () => {
    git = await git();
    let sp = spinner();
    let packages = git.packsToList();
    try {
        for (let i = 0; i < packages.length; i++)
            packages[i].version = await git.lastVersion(packages[i]);
        sp.stop(true);
        return packages;
    } catch (error) {
        sp.stop(true);
        console.error(error);
        throw null;
    }
}
