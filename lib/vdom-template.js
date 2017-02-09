var parse5 = require('parse5');
const indentString = require('indent-string');
const uuidV4 = require('uuid/v4');

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
  let _splits = textNode.value.split(/{{{?/);
  _splits.forEach(_text => {
    const _parts = _text.split(/}}}?/);
    if (_parts.length > 1) {
      _textNodes.push(`${_parts[0].replace(/^\s+|\s+$/g, '').replace(/"/g, '\\"')}`);
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
    const name = attrs[i].name;
    if (name !== 'n-if' && name !== 'n-each' && name !== 'n-else') {
      props[name] = attrs[i].value;
    }
  }
  return props;
}

function objectStringify(obj) {
  const attrs = [];
  for (let p in obj) {
    let value = obj[p];
    if (/^n-|:|@/.test(p)) {
      if (value === '') {
        value = 'true';
      }
      attrs.push(`"${p}":${value}`);
    } else {
      attrs.push(`"${p}":"${value}"`);
    }
  }
  return `{${attrs.join(',')}}`;
}

module.exports = function vdomTemplate (rawTemplate, baseIndent) {

  var fragment = parse5.parseFragment(rawTemplate, {
    locationInfo: true
  });

  let indent = baseIndent;

  const conditionStack = [];

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
        const _uuid = uuidV4();
        const existEach = checkIfExistDirective(node.attrs, 'each');
        const existIf = checkIfExistDirective(node.attrs, 'if');
        const existElse = checkIfExistDirective(node.attrs, 'else');
        if (existEach) {
          const exps = existEach.value.split('in');
          // 处理 each 指令
          result += writeLine(`_.each(${exps[1].trim()}, function(${exps[0].trim()}, $index, $key) { return {key: "${_uuid}-" + $key, tagName: "${node.tagName}", attrs: ${objectStringify(attrs2props(node.attrs))}, children: `);
        } else if (existIf) {
          // 处理 if 指令
          conditionStack.push(existIf.value);
          result += writeLine(`_.if(${existIf.value}, {key: "${_uuid}", tagName: "${node.tagName}", attrs: ${objectStringify(attrs2props(node.attrs))}, children: `);
        } else if (existElse) {
          const lastCondition = conditionStack.pop();
          result += writeLine(`_.if(!(${lastCondition}), {key: "${_uuid}", tagName: "${node.tagName}", attrs: ${objectStringify(attrs2props(node.attrs))}, children: `);
        } else {
          result += writeLine(`h("${node.tagName}", ${objectStringify(attrs2props(node.attrs))}, `);
        }
        if (node.childNodes.length > 0) {
          result += createHyperScript(node);
          if (existEach) {
            result += '};})';
          } else if (existIf || existElse) {
            result += '})';
          } else {
            result += `, "${_uuid}")`;
          }
        } else {
          if (existEach) {
            result += '[]};})';
          } else if (existIf || existElse) {
            result += '[]})';
          } else {
            result += `[], "${_uuid}")`;
          }
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
    result += writeLine('var state = this.state;\n');
    result += writeLine('return h(');
    result += `${createHyperScript(template)});\n`;
    indent--;
    result += writeLineEnd('}\n');
    return result;
  }

  return getVirtualDomCreator(fragment);

};
