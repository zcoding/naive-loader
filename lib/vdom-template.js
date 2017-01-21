var parse5 = require('parse5');
const indentString = require('indent-string');

// 检查是否存在指令
function checkIfExistDirective (attrs, directiveName) {
  let exist = false;
  for (let i = 0; i < attrs.length; ++i) {
    if (attrs[i].name === `n-${directiveName}`) {
      exist = attrs[i];
      break;
    }
  }
  return exist;
}

// 处理插值
function handleText (textNode) {
  let _textNodes = [];
  let _splits = textNode.value.split('{{');
  _splits.forEach(_text => {
    const _parts = _text.split('}}');
    if (_parts.length > 1) {
      _textNodes.push(`_._("${_parts[0].replace(/^\s+|\s+$/g, '').replace(/"/g, '\\"')}")`);
      if (_parts[1]) {
        _textNodes.push(`"${_parts[1].replace(/\n/g, '\\n')}"`);
      }
    } else {
      if (_parts[0]) {
        _textNodes.push(`"${_parts[0].replace(/\n/g, '\\n')}"`);
      }
    }
  });
  return _textNodes.join(',');
}

function attrs2props (attrs) {
  const props = {};
  for (let i = 0; i < attrs.length; ++i) {
    props[attrs[i].name] = attrs[i].value;
  }
  return props;
}

module.exports = function vdomTemplate (rawTemplate, baseIndent) {

  var fragment = parse5.parseFragment(rawTemplate, {
    locationInfo: true
  });

  let indent = baseIndent;

  function writeLine (content) {
    return indentString(`${content}`, indent * 2);
  }

  function writeLineEnd (content) {
    return indentString(`${content}\n`, indent * 2);
  }

  function createHyperScript (fragment) {
    let result = '[\n';
    indent++;
    fragment.childNodes.forEach((node, idx) => {
      if (idx !== 0) {
        result += ',\n'
      }
      if (node.nodeName === '#text') {
        result += writeLine(`${handleText(node)}`);
      } else if (node.tagName) {
        const existEach = checkIfExistDirective(node.attrs, 'each');
        const existIf = checkIfExistDirective(node.attrs, 'if');
        if (existEach) {
          // 处理 each 指令
          result += writeLine(`_.each({tagName: "${node.tagName}", attrs: ${JSON.stringify(attrs2props(node.attrs))}, children: `);
        } else if (existIf) {
          // 处理 if 指令
          result += writeLine(`_.if(_._("${existIf.value}"), {tagName: "${node.tagName}", attrs: ${JSON.stringify(attrs2props(node.attrs))}, children: `);
        } else {
          result += writeLine(`h("${node.tagName}", ${JSON.stringify(attrs2props(node.attrs))}, `);
        }
        if (node.childNodes.length > 0) {
          result += createHyperScript(node);
          result += existEach || existIf ? '})' : ')';
        } else {
          result += existEach || existIf ? '[]})' : '[])';
        }
      } else {
        console.log(node)
      }
    });
    indent--;
    result += writeLine('\n]');
    return result;
  }

  // 生成 virtual-dom 构造函数
  function getVirtualDomCreator (template) {
    let result = 'function render(h, _) {\n';
    indent++;
    result += writeLine('return ');
    result += `${createHyperScript(template)};\n`;
    indent--;
    result += writeLineEnd('}\n');
    return result;
  }

  return getVirtualDomCreator(fragment);

};
