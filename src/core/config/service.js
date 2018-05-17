const fs = require('fs');
const path = require('path');
const user_config = require('../../helpers/uteis/configs');
const opts = require('./options/index');

module.exports = async (options) => {
    let config = user_config.getConfigOrDefault();

    if (options.url) return opts.url(config);
    if (options.list) return opts.list(config);
    if (options.path) return await opts.path(config);
    if (options.set) return opts.set(config, options.set);
    if (options.new) return await opts.new(config, options.new);
}