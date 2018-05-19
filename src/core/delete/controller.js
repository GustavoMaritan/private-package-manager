const colors = require('colors/safe');

module.exports = (commander) => {
    commander
        .command('remove <name>')
        .alias('r')
        .description('Remove package')
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