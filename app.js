#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pack = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const comandos = require('commander');

comandos
    .version(pack.version)
    .description('Package');

require('./src/core/list/controller')(comandos);
require('./src/core/install/controller')(comandos);
require('./src/core/outdated/controller')(comandos);
require('./src/core/update/controller')(comandos);
require('./src/core/delete/controller')(comandos);
require('./src/core/config/controller')(comandos);

comandos.parse(process.argv);
