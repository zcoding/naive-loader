const path = require('path')
const parse = require('./parser')
const loaderUtils = require('loader-utils')

module.exports = function loader (source, map) {
  const query = loaderUtils.parseQuery(this.query)
  const filename = path.basename(this.resourcePath)
  const parts = parse(source, filename, this.sourceMap)
  const part = parts[query.type][query.index]
  this.callback(null, part.content, part.map)
}
