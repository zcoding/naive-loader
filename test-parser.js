const parseExpression = require('./lib/expression-parser');
console.log(parseExpression("{a: 1}", []));

// const babylon = require('babylon');
// console.log(babylon.parse("({a: 1})").program.body[0].expression.type);
