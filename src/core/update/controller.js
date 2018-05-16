const colors = require('colors/safe');

module.exports = (commander) => {
    commander
        .command('update [name]')
        .alias('u')
        .option('--patch', 'Altera para maior versao patch - 0.0.[0]')
        .option('--minor', 'Altera para maior versao minor - 0.[0].0')
        .option('--major', 'Altera para maior versao major - [0].0.0')
        .description('Atualiza versões dos packages')
        .action(async (name, options) => {
            try {
                await require('./service')(name, options);
                //await require('../../helpers/uteis/ppk-version')();
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