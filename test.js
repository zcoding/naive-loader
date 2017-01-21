const parse5 = require('parse5');
const fs = require('fs');
const indentString = require('indent-string');

const jsLoader = 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false';

let indent = 0;

// 处理 each 指令
const directiveEach = `function _each (list) {
  let hList = [];
  for (let i = 0; i < list.length; ++i) {
    hList.push(h(list[i]));
  }
  return hList;
}
`;

// 处理 if 指令
const directiveIf = `function _if (condition, vdom) {
  return condition ? h(vdom) : false;
}`;

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
      _textNodes.push(`_.s("${_parts[0].replace(/^\s+|\s+$/g, '').replace(/"/g, '\\"')}")`);
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

function createHyperScript (fragment) {
  let result = '[\n';
  indent++;
  fragment.childNodes.forEach((node, idx) => {
    if (idx !== 0) {
      result += ',\n'
    }
    if (node.nodeName === '#text') {
      result += indentString(`${handleText(node)}`, indent * 2);
    } else if (node.tagName) {
      const existEach = checkIfExistDirective(node.attrs, 'each');
      const existIf = checkIfExistDirective(node.attrs, 'if');
      if (existEach) {
        // 处理 each 指令
        result += indentString(`_.each({tagName: "${node.tagName}", attrs: ${JSON.stringify(node.attrs)}, children: `, indent * 2);
      } else if (existIf) {
        // 处理 if 指令
        result += indentString(`_.if(_.s("${existIf.value}"), {tagName: "${node.tagName}", attrs: ${JSON.stringify(node.attrs)}, children: `, indent * 2);
      } else {
        result += indentString(`h("${node.tagName}", ${JSON.stringify(node.attrs)}, `, indent * 2);
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
  result += indentString('\n]', indent * 2);
  return result;
}

// 生成 virtual-dom 构造函数
function getVirtualDomCreator (template) {
  let result = 'function render(h, _) {\n';
  indent++;
  result += indentString('return ', indent * 2);
  result += `${createHyperScript(template)};\n`;
  indent--;
  result += indentString('}\n\n', indent * 2);
  return result;
}

function writeLine (content) {
  return indentString(`${content}\n`, indent * 2);
}

function exportComponentOptions () {
  let result = '';
  result += writeLine('componentOptions.render = render;');
  result += writeLine('export default componentOptions;');
  return result;
}

function getComponentConstructor () {
  let result = `var __scripts__ = require('${jsLoader}!path/to/file');\n`;
  return result;
}

fs.readFile('./test/app.naive', 'utf8', function (err, data) {
  if (err) {
    console.error(err);
  }
  const fragment = parse5.parseFragment(data, {
    locationInfo: true
  });
  let result = '';
  fragment.childNodes.forEach(node => {
    const nodeType = node.nodeName;
    if (nodeType === 'template') {
      const _template = node.content;
      result += getVirtualDomCreator(_template);
    } else if (nodeType === 'script') {
      if (node.childNodes && node.childNodes.length > 0) {
        const start = node.childNodes[0].__location.startOffset;
        const end = node.childNodes[node.childNodes.length - 1].__location.endOffset;
        const _script = data.slice(start, end);
        result += writeLine(_script);
      }
    } else if (nodeType === 'style') {
      if (node.childNodes && node.childNodes.length > 0) {
        const start = node.childNodes[0].__location.startOffset;
        const end = node.childNodes[node.childNodes.length - 1].__location.endOffset;
        const _style = data.slice(start, end);
      }
    } else {
      // 忽略
    }
  });
  result += exportComponentOptions();
  fs.writeFile('./test-output.js', result, function (err) {
    if (err) {
      console.error(err);
    }
    console.log('done');
  });
});
