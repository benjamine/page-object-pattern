var _S = require('underscore.string');

function getElementAbsoluteSelector(elem) {
  var selector = [];
  if (elem.parent) {
    selector.push(getElementAbsoluteSelector(elem.parent));
  }
  if (elem._selector) {
    selector.push(elem._selector);
  }
  return selector.join(' ').trim();
}

function updateElementSelector(elem) {
  /*
  // allow this type of syntax:
  var page = this.page('cart');
  this.browser.click(page.checkoutButton.s));
  */
  if (!elem._selector) {
    elem.s = '#' + _S.dasherize('component' + elem.constructor.name);
    return;
  }
  elem.s = getElementAbsoluteSelector(elem);
  elem._children.forEach(updateElementSelector);
}

function Element(world) {
  this._children = [];
  this.setWorld(world);
  updateElementSelector(this);
}

Element.prototype.element = function(name) {
  var child = name ? this.world.pageManager.element(name) :
    new Element(this.world);
  child.parent = this;
  if (this.page) {
    child.page = this.page;
  }
  updateElementSelector(child);
  this._children.push(child);
  return child;
};

Element.prototype.at = function(selector) {
  this._selector = selector;
  updateElementSelector(this);
  return this;
};

Element.prototype.setWorld = function(world) {
  this.world = world;
  if (this.world.browser) {
    this.browser = this.world.browser;
  }
  if (this.world.config) {
    this.config = this.world.config;
  }
  this._children.forEach(function(child){
    child.setWorld(world);
  });
};

Element.prototype.find = function() {
  if (typeof this.world.findByCssSelector !== 'function') {
    throw new Error('world.findByCssSelector function not found');
  }
  var args = Array.prototype.slice.apply(arguments);
  args.unshift(this.s);
  return this.world.findByCssSelector.apply(this.world, args);
};

module.exports = Element;
