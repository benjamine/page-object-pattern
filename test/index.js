/*
* mocha's bdd syntax is inspired in RSpec
*   please read: http://betterspecs.org/
*/
require('./util/globals');

describe('pageObjectPattern', function(){
  before(function(){
  });
  it('has a semver version', function(){
    expect(pageObjectPattern.version).to.match(/^\d+\.\d+\.\d+(-.*)?$/);
  });
});
