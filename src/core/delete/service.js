let bit = require('../../helpers/bitBucket/bit');
const { exec } = require('child_process');
const spinner = require('../../helpers/uteis/spinner');

module.exports = async (name, options) => {
    bit = await bit();

    console.log();
    let sp = spinner('Removendo package...');
    let pack = bit.packs[name];

    exec(`npm uninstall ${pack.repositorio} --save`, (err, st) => {
        sp.stop(true);
        if (err) throw { message: err };
        console.log(`${pack.repositorio} removido`);
    });
}