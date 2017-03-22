const parse5 = require('parse5');
const indentString = require('indent-string');
const uuidV4 = require('uuid/v4');

const camelizeRE = /-(\w)/g;
function camelize(str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
};

// 检查是否存在模板指令 n-each n-if n-else
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
    let name = attrs[i].name;
    if (name !== 'n-if' && name !== 'n-each' && name !== 'n-else') {
      if (/^:/.test(name)) {
        name = camelize(name);
      }
      props[name] = attrs[i].value;
    }
  }
  return props;
}

function objectStringify(obj) {
  const attrs = [];
  for (let p in obj) {
    let value = obj[p];
    if (/^:/.test(p)) {
      if (value === '') {
        value = 'true';
      }
      attrs.push(`"${p}":${value}`);
    } else if (/^@/.test(p)) { // 事件
      value = value.replace("$index", '" + $index + "');
      attrs.push(`"${p}":"${value}"`);
    } else {
      attrs.push(`"${p}":"${value}"`);
    }
  }
  return `{${attrs.join(',')}}`;
}

module.exports = function vdomTemplate (rawTemplate, baseIndent) {

  rawTemplate = rawTemplate.trim();
  var fragment = parse5.parseFragment(rawTemplate, {
    locationInfo: true
  });

  let _iid = 1;

  let indent = baseIndent;

  const conditionStack = [];

  function writeLine (content, noIndent) {
    return indentString(`${content}`, noIndent ? 0 : indent * 2);
  }

  function writeLineEnd (content) {
    return indentString(`${content}\n`, indent * 2);
  }

  function createVNodeHS (node, noIndent) {
    let result = '';
    const _uuid = `_uid + "-${++_iid}"`;
    const existEach = checkIfExistDirective(node.attrs, 'each');
    const existIf = checkIfExistDirective(node.attrs, 'if');
    const existElse = checkIfExistDirective(node.attrs, 'else');
    if (existEach) {
      const exps = existEach.value.split(/\s+in\s+/);
      // 处理 each 指令
      result += writeLine(`_.each(${exps[1].trim()}, function(${exps[0].trim()}, $index, $key) { return {key: ${_uuid} + "-" + $key, tagName: "${node.tagName}", attrs: ${objectStringify(attrs2props(node.attrs))}, children: `);
    } else if (existIf) {
      // 处理 if 指令
      conditionStack.push(existIf.value);
      result += writeLine(`_.if(${existIf.value}, {key: ${_uuid}, tagName: "${node.tagName}", attrs: ${objectStringify(attrs2props(node.attrs))}, children: `);
    } else if (existElse) {
      const lastCondition = conditionStack.pop();
      result += writeLine(`_.if(!(${lastCondition}), {key: ${_uuid}, tagName: "${node.tagName}", attrs: ${objectStringify(attrs2props(node.attrs))}, children: `);
    } else {
      result += writeLine(`h("${node.tagName}", ${objectStringify(attrs2props(node.attrs))}, `, noIndent);
    }
    if (node.childNodes.length > 0) {
      result += createHyperScript(node);
      if (existEach) {
        result += '};})';
      } else if (existIf || existElse) {
        result += '})';
      } else {
        result += `, ${_uuid})`;
      }
    } else {
      if (existEach) {
        result += '[]};})';
      } else if (existIf || existElse) {
        result += '[]})';
      } else {
        result += `[], ${_uuid})`;
      }
    }
    return result;
  }

  function createHyperScript (fragment) {
    let result = '[\n';
    indent++;
    fragment.childNodes.forEach((node, idx) => {
      if (idx !== 0) {
        result += ',\n'
      }
      if (node.nodeName === '#text') {
        if (/^\s+$/.test(node.value)) { // 如果只有空白符，用空格替换
          result += writeLine('" "');
        } else {
          result += writeLine(`${handleText(node)}`);
        }
      } else if (node.tagName) {
        result += createVNodeHS(node);
      } else {
        console.log(node);
      }
    });
    indent--;
    result += writeLine('\n]');
    return result;
  }

  // 生成 virtual-dom 构造函数
  function getVirtualDomCreator (fragment) {
    let result = 'function render(h, _) {\n';
    indent++;
    result += writeLine('var state = this.state;\n');
    result += writeLine(`var _uid = "${uuidV4()}";\n`); // 在同一个 render 函数内共用一个 uuid，用内部索引区分组件内的元素
    result += writeLine('return ');
    result += `${createVNodeHS(fragment.childNodes[0], true)};\n`;
    indent--;
    result += writeLineEnd('}\n');
    return result;
  }

  return getVirtualDomCreator(fragment);

};
