const fs = require('fs');
const path = require('path');
const path_config = path.join(__dirname, '../../helpers/user/config.json');
const opts = require('./options/index');

module.exports = async (options) => {
    let config = fs.existsSync(path_config)
        ? JSON.parse(fs.readFileSync(path_config))
        : { configs: [] };

    if (options.url) return opts.url(config);
    if (options.list) return opts.list(config);
    if (options.path) return await opts.path(config);
    if (options.set) return opts.set(config, options.set);
    if (options.new) return await opts.new(config, options.new);
}