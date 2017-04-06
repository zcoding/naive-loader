const babylon = require('babylon');
const babelTraverse = require('babel-traverse')['default'];
const babelGenerate = require('babel-generator')['default'];

const ctx = '$vm';
const ctxState = '$state';

module.exports = function parseExpression(exp, alias = []) {
  exp = '(' + exp + ')';
  const ast = babylon.parse(exp);
  let needRemoveBrackets = false;
  if (ast.program.body[0].expression.type === 'ObjectExpression') {
    needRemoveBrackets = true;
  }
  babelTraverse(ast, {
    MemberExpression(path) {
      if (path.node.object.type === 'Identifier') {
        path.node.object.shouldSkip = true;
        if (alias.indexOf(path.node.object.name) === -1) {
          path.node.object.name = `${ctxState}.${path.node.object.name}`;
        }
      }
    },
    ObjectProperty(path) {
      if (path.node.key.type === 'Identifier') {
        path.node.key.shouldSkip = true;
      }
    },
    CallExpression(path) {
      if (path.node.callee.type === 'Identifier') {
        path.node.callee.shouldSkip = true;
        path.node.callee.name = `${ctx}.${path.node.callee.name}`;
      }
    },
    Identifier(path) {
      if (!path.node.shouldSkip && (path.parent.type !== 'MemberExpression' || path.parent.computed) && alias.indexOf(path.node.name) === -1) {
        path.node.name = `${ctxState}.${path.node.name}`;
      }
    }
  });
  let code = babelGenerate(ast).code.replace(/;$/g, '');
  if (needRemoveBrackets) {
    code = code.replace(/^\(|\)$/g, '');
  }
  return code;
}
