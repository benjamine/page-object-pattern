var url = require('url');
var util = require('util');
/*jshint -W079 */
var Element = require('./element');

function Page(world){
  Element.call(this, world);
  this.page = this;
}

util.inherits(Page, Element);

Page.prototype.visit = function(params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  // compose a target url
  var targetUrl = this.route;
  if (!targetUrl) {
    throw new Error('this page has no specified route');
  }
  if (targetUrl.substr(0, 1) === '/') {
    targetUrl = url.resolve(this.config.baseUrl, targetUrl);
  }

  if (params && typeof params === 'object') {

    var usedParams = {};
    targetUrl = targetUrl
      .replace(/\*.*$/, '')
      .replace(/\:[a-z0-9]+[\?]?/ig, function(match) {
        var name = match.substr(1, match.length - 1);
        var suffix = '';
        if (match.substr(match.length - 1) === '?') {
          suffix = name.slice(-1);
          name = name.slice(0, -1);
        }
        if (params && params[name]) {
          usedParams[name] = true;
          return params[name] + suffix;
        }
        return suffix;
      })
      .replace(/\/[\/]+/g, '/');

    // additional query params
    Object.keys(params).forEach(function(name) {
      if (name === '_hash' || usedParams[name]) {
        return;
      }
      targetUrl += (targetUrl.indexOf('?') < 0) ? '?' : '&';
      var value = params[name];
      targetUrl += name + '=' + encodeURIComponent(value);
    });

    if (params._hash) {
      targetUrl += '#' + params._hash;
    }
  }

  return this.world.visitAbsoluteUrl(targetUrl, callback);
};

module.exports = Page;
