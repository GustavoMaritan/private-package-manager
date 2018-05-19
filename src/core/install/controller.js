const colors = require('colors/safe');

module.exports = (commander) => {
    commander
        .command('install <name>')
        .alias('i')
        .option("-v, --version [name]", "Define versão a ser instalada.", null)
        .option("-d, --dev", "Package somente dev ambiente.", null)
        .description('Instala package --save.')
        .action(async (name, options) => {
            try {
                await require('./service')(name, options);
            } catch (error) {
                if (error.message) console.error(error.message);
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