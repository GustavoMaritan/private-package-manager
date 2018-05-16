const colors = require('colors/safe');

module.exports = (commander) => {
    commander
        .command('config')
        .option("-p, --path", "Informar caminho e nome do arquivo de configuração.")
        .option("-u, --url", "Definir url que retorne configuração.")
        .option("-l, --list", "Listar configurações existentes.")
        .option("-n, --new <name>", "Iniciar nova configuração.")
        //.option("-e, --edit <name>", "Editar configuração existente.")
        .option("-s, --set <name>", "Ativar configuração.")
        .description('Controle de configurações.')
        .action(async (options) => {
            try {
                await require('./service')(options);
            } catch (error) {
                if (error.message) console.error(error.message);
            }
        })
        .on('--help', function () {
            console.log();
            console.log('   Examples:');
            console.log();
            console.log('      > ppk config -p');
            console.log('      > ppk config -l');
            console.log('      > ppk config -n "name"');
        });

    return commander;
}; 