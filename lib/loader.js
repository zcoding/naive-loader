const parseRaw = require('./parser')
const loaderUtils = require("loader-utils")
const vdomTemplate = require('./vdom-template')
const selectorPath = require.resolve('./selector')

const defaultLoaders = {
  html: 'html-loader',
  css: 'style-loader!css-loader'
}

const jsLoader = 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'

module.exports = function loader (source, map) {

  const filePath = this.resourcePath

  const parts = parseRaw(source)

  const indent = 0

  let output = 'var __component__, render;\n'

  output += '__component__ = require(' + loaderUtils.stringifyRequest(this, '!!' + jsLoader + '!' + selectorPath + '?type=script&index=0!' + filePath) + ');\n'

  output += 'if (__component__.__esModule) {\n'
  output += '  __component__ = __component__["default"];\n'
  output += '}\n\n'

  output += vdomTemplate(parts.template[0].content, indent)

  output += '__component__.render = render;\n\n'
  output += 'module.exports = __component__;\n'
  return output
}
