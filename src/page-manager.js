var url = require('url');
var _S = require('underscore.string');
var Page = require('./page');
/*jshint -W079 */
var Element = require('./element');

function PageManager(world) {
  world = world || {};
  this.world = world;
  world.pageManager = this;
  this.pages = {};
  this.elements = {};

  world.visit = function(targetUrl, callback) {
    return this.pageManager.visit(targetUrl, callback);
  };
  world.page = function(name) {
    return this.pageManager.page(name);
  };
}

PageManager.prototype.page = function(name) {
  if (!name) {
    name = 'any';
  }
  if (!this.pages[name]) {
    throw new Error('page not found: ' + name);
  }
  var definition = this.pages[name];
  if (typeof definition === 'object') {
    // TODO: build constructor using definition object
    throw new Error('not implemented');
  }
  /* jshint newcap:false */
  var page = new (definition)(this.world);
  return page;
};

PageManager.prototype.element = function(name) {
  if (!this.elements[name]) {
    throw new Error('element not found: ' + name);
  }
  var definition = this.elements[name];
  if (typeof definition === 'object') {
    // TODO: build constructor using definition object
    throw new Error('not implemented');
  }
  /* jshint newcap:false */
  var element = new (definition)(this.world);
  return element;
};

PageManager.prototype.define = function() {

  function isPageDefinition(definition) {
    if (typeof definition === 'object') {
      return (typeof definition.route !== 'undefined' && definition.route !== null);
    } else {
      return definition.prototype instanceof Page;
    }
  }

  function isElementDefinition(definition) {
    if (typeof definition === 'object') {
      return !(typeof definition.route !== 'undefined' && definition.route !== null);
    } else {
      return definition.prototype instanceof Element;
    }
  }

  if (typeof arguments[0] === 'string') {
    if (isPageDefinition(arguments[1])) {
      this.definePage.apply(this, arguments);
    } else if (isElementDefinition(arguments[1])) {
      this.defineElement.apply(this, arguments);
    } else {
      throw new Error('invalid element or page definition');
    }
  } else if (typeof arguments[0] === 'object') {
    for (var name in arguments[0]) {
      this.define(name, arguments[0][name]);
    }
  } else if (typeof arguments[0] === 'function' && isPageDefinition(arguments[0])) {
    this.definePage(_S.dasherize(arguments[0].constructor.name), arguments[0]);
  } else if (typeof arguments[0] === 'function' && isElementDefinition(arguments[0])) {
    this.defineElement(_S.dasherize(arguments[0].constructor.name), arguments[0]);
  } else {
    throw new Error('invalid arguments');
  }
  return this;
};


PageManager.prototype.definePage = function(name, definition) {
  if (this.pages[name]) {
    throw new Error('page already defined: ' + name);
  }
  this.pages[name] = definition;
  return this;
};

PageManager.prototype.defineElement = function(name, definition) {
  if (this.elements[name]) {
    throw new Error('element already defined: ' + name);
  }
  this.elements[name] = definition;
  return this;
};

PageManager.prototype.visit = function(targetUrl, callback){
  if (typeof this.world.visitAbsoluteUrl !== 'function') {
    throw new Error('world.visitAbsoluteUrl function not found');
  }
  if (!/^https?\:\/\//i.test(targetUrl)) {
    targetUrl = url.resolve(this.world.config.baseUrl, targetUrl);
  }
  return this.world.visitAbsoluteUrl(targetUrl, callback);
};

module.exports = PageManager;
