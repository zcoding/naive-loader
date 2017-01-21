var parseRaw = require('./parser');
var loaderUtils = require("loader-utils");
var vdomTemplate = require('./vdom-template');
var selectorPath = require.resolve('./selector')

module.exports = function loader (source, map) {
  this.cacheable();

  var defaultLoaders = {
    html: 'html-loader',
    css: 'style-loader!css-loader',
    js: 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
  };

  var filePath = this.resourcePath;

  var query = loaderUtils.parseQuery(this.query);

  var parts = parseRaw(source);


  var indent = 0;

  var output = 'var __component__, render;\n';

  output += '__component__ = require(' + loaderUtils.stringifyRequest(this, '!!' + defaultLoaders['js'] + '!' + selectorPath + '?type=script&index=0!' + filePath) + ');\n';

  output += 'if (__component__.__esModule) {\n';
  output += '  __component__ = __component__["default"];\n';
  output += '}\n\n';

  output += vdomTemplate(parts.template[0].content, indent);

  output += '__component__.render = render;\n\n';
  output += 'module.exports = __component__;\n';
  return output;
};
