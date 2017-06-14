////////// 解析文件内容，分成 template script styel 三部分
const parse5 = require('parse5')
const deindent = require('de-indent')

module.exports = function parser(content) {

  const fragment = parse5.parseFragment(content, {
    locationInfo: true
  })

  const output = {
    "template": [],
    "script": [],
    "style": []
  };

  fragment.childNodes.forEach(function(node) {
    const nodeType = node.nodeName
    if (nodeType !== 'template' && (!node.childNodes || !node.childNodes.length)) {
      return
    }
    if ( (nodeType === 'script' || nodeType === 'template') && output[nodeType].length > 0 ) {
      throw new Error(`一个组件只能有一个 <${nodeType}>`)
    }
    if (nodeType === 'template') {
      node = node.content
    }
    const start = node.childNodes[0].__location.startOffset
    const end = node.childNodes[node.childNodes.length - 1].__location.endOffset
    const result = deindent(content.slice(start, end))
    output[nodeType].push({
      content: result
    })
  })

  return output

}
