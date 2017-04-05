const babylon = require('babylon');
const babelTraverse = require('babel-traverse')['default'];
const babelGenerate = require('babel-generator')['default'];

const ctx = '$vm';
const ctxState = '$state';

module.exports = function parseExpression(exp, alias = []) {
  const ast = babylon.parse(exp);
  babelTraverse(ast, {
    MemberExpression(path) {
      if (path.node.object.type === 'Identifier') {
        path.node.object.shouldSkip = true;
        if (alias.indexOf(path.node.object.name) === -1) {
          path.node.object.name = `${ctxState}.${path.node.object.name}`;
        }
      }
    },
    CallExpression(path) {
      if (path.node.callee.type === 'Identifier') {
        path.node.callee.shouldSkip = true;
        path.node.callee.name = `${ctx}.${path.node.callee.name}`;
      }
    },
    Identifier(path) {
      if (path.node.shouldSkip) {
        path.skip();
      } else if (path.parent.type !== 'MemberExpression' || path.parent.computed) {
        if (alias.indexOf(path.node.name) === -1) {
          path.node.name = `${ctxState}.${path.node.name}`;
        }
      }
    }
  });
  const code = babelGenerate(ast).code;
  return code.replace(/;$/, '');
}
