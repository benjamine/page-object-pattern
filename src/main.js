
// global exports

exports.Page = require('./page');
exports.Element = require('./element');
exports.PageManager = require('./page-manager');


var packageInfo = require('../pack' + 'age.json');
exports.version = packageInfo.version;
exports.homepage = packageInfo.homepage;
