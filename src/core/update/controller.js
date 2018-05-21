const colors = require('colors/safe');

module.exports = (commander) => {
    commander
        .command('update [name]')
        .alias('u')
        .option('-p, --patch', 'Altera para maior versao patch - 0.0.[0]')
        .option('-m, --minor', 'Altera para maior versao minor - 0.[0].0')
        .option('-M, --major', 'Altera para maior versao major - [0].0.0')
        .option('-s, --set <version>', 'Setar versão definida.')
        .description('Atualiza versões dos packages')
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