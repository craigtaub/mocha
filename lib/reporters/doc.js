'use strict';
/**
 * @module Doc
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var utils = require('../utils');

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

/**
 * Initialize a new `Doc` reporter.
 *
 * @class
 * @memberof Mocha.reporters
 * @extends {Base}
 * @public
 * @param {Runner} runner
 */
function Doc(runner) {
  Base.call(this, runner);
  var self = this;

  var indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('suite', function(suite) {
    if (suite.root) {
      return;
    }
    ++indents;
    self.print('%s<section class="suite">', indent());
    ++indents;
    self.print('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
    self.print('%s<dl>', indent());
  });

  runner.on('suite end', function(suite) {
    if (suite.root) {
      return;
    }
    self.print('%s</dl>', indent());
    --indents;
    self.print('%s</section>', indent());
    --indents;
  });

  runner.on('pass', function(test) {
    self.print('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
    var code = utils.escape(utils.clean(test.body));
    self.print('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });

  runner.on('fail', function(test, err) {
    self.print(
      '%s  <dt class="error">%s</dt>',
      indent(),
      utils.escape(test.title)
    );
    var code = utils.escape(utils.clean(test.body));
    self.print(
      '%s  <dd class="error"><pre><code>%s</code></pre></dd>',
      indent(),
      code
    );
    self.print('%s  <dd class="error">%s</dd>', indent(), utils.escape(err));
  });
}

Doc.description = 'HTML documentation';
