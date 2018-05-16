const colors = require('colors/safe');

module.exports = (commander) => {
    commander
        .command('check [name]')
        .alias('c')
        .description('Verifica versões dos packages.')
        .action(async (name) => {
            try {
                await require('./service')(name);
            } catch (error) {
                if (error.message) console.error(error.message);
            }
        })
        .on('--help', function () {
            console.log();
            console.log('  Examples:');
            console.log();
        });

    return commander;
};