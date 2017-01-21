////////// 解析文件内容，分成 template script styel 三部分
var parse5 = require('parse5');
var deindent = require('de-indent');

module.exports = function(content) {

  var fragment = parse5.parseFragment(content, {
    locationInfo: true
  });

  var output = {
    "template": [],
    "script": [],
    "style": []
  };

  fragment.childNodes.forEach(function(node) {
    var nodeType = node.nodeName;
    if (nodeType !== 'template' && (!node.childNodes || !node.childNodes.length)) {
      return;
    }
    if ( (nodeType === 'script' || nodeType === 'template') && output[nodeType].length > 0 ) {
      throw new Error(`一个组件只能有一个 <${nodeType}>`);
    }
    if (nodeType === 'template') {
      node = node.content;
    }
    var start = node.childNodes[0].__location.startOffset;
    var end = node.childNodes[node.childNodes.length - 1].__location.endOffset;
    var result = deindent(content.slice(start, end));
    output[nodeType].push({
      content: result
    });
  });

  return output;

};
