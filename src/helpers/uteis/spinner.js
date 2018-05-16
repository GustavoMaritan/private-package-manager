const Spinner = require('cli-spinner').Spinner;
const colors = require('colors/safe');

module.exports = spinner;

function spinner(message = 'Carregando aguarde... %s ', loading = '|/-\\', color = 'green') {
    var spinner = new Spinner({
        text: colors[color](message)
        // stream: process.stderr,
        // onTick: function (msg) {
        //     this.clearLine(this.stream);
        //     this.stream.write('oi');
        // }
    });
    spinner.setSpinnerString(loading);
    
    spinner.start();
    return spinner;
}