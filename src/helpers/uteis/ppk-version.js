const colors = require('colors');
const { exec } = require('child_process');
const Promise = require('promise');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
    let package = fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf8');
    package = JSON.parse(package);

    let server_version = await serverVersion();

    if (package.version >= server_version.trim()) return;

    console.log();
    console.log(colors.white(`     Update version  ${package.version} > `), colors.green(server_version.trim()));
    console.log(colors.green(`     > npm i ppk -g`));
    console.log(colors.yellow('     _____________________'));

}

async function serverVersion() {
    return new Promise((resolve, reject) => {
        exec('npm info ppk version', (err, st) => {
            if (err) return reject(err);
            resolve(st);
        });
    })
} 
