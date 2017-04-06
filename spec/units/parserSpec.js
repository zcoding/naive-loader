describe("表达式解析", function() {
  const parseExpression = require('../../lib/expression-parser');

  it("函数调用", function() {
    expect(parseExpression('handleClick()')).toEqual('$vm.handleClick()');
    expect(parseExpression('handleClick(123)')).toEqual('$vm.handleClick(123)');
    expect(parseExpression('handleClick("123")')).toEqual('$vm.handleClick("123")');
    expect(parseExpression('handleClick(item)')).toEqual('$vm.handleClick($state.item)');
    expect(parseExpression('handleClick($event)', ['$event'])).toEqual('$vm.handleClick($event)');
  });

  it("对象成员", function() {
    expect(parseExpression('a.b.c')).toEqual('$state.a.b.c');
    expect(parseExpression('a.b.c', ['b', 'c'])).toEqual('$state.a.b.c');
    expect(parseExpression('a.b.c', ['a', 'b', 'c'])).toEqual('a.b.c');
    expect(parseExpression('a[b[c[d]]]')).toEqual('$state.a[$state.b[$state.c[$state.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a'])).toEqual('a[$state.b[$state.c[$state.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a', 'b'])).toEqual('a[b[$state.c[$state.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a', 'b', 'c'])).toEqual('a[b[c[$state.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a', 'b', 'c', 'd'])).toEqual('a[b[c[d]]]');
    expect(parseExpression('a[b].c')).toEqual('$state.a[$state.b].c');
    expect(parseExpression('a.b[c]')).toEqual('$state.a.b[$state.c]');
    expect(parseExpression('a["b"].c')).toEqual('$state.a["b"].c');
    expect(parseExpression('a.b["c"]')).toEqual('$state.a.b["c"]');
    expect(parseExpression('a[b + c]', ['a'])).toEqual('a[$state.b + $state.c]');
    expect(parseExpression('a[b + c].d', ['a', 'b'])).toEqual('a[b + $state.c].d');
  });

  it("对象表达式", function() {
    expect(parseExpression('{a: 1}')).toEqual('{ a: 1 }');
    expect(parseExpression('{a: b}')).toEqual('{ a: $state.b }');
    expect(parseExpression('{a: b}', ['b'])).toEqual('{ a: b }');
    expect(parseExpression('{a: b}', ['a', 'b'])).toEqual('{ a: b }');
  });

  it("二元运算", function() {
    expect(parseExpression('1 + 1')).toEqual('1 + 1');
    expect(parseExpression('1 + item')).toEqual('1 + $state.item');
    expect(parseExpression('1 + item', ['item'])).toEqual('1 + item');
    expect(parseExpression('1 + item + "3"')).toEqual('1 + $state.item + "3"');
    expect(parseExpression('(1 + 2) * (a - b)')).toEqual('(1 + 2) * ($state.a - $state.b)');
  });

  it("一元运算", function() {
    expect(parseExpression('+1')).toEqual('+1');
    expect(parseExpression('+item')).toEqual('+$state.item');
    expect(parseExpression('++item')).toEqual('++$state.item');
    expect(parseExpression('item--')).toEqual('$state.item--');
  });

  it("条件运算", function() {
    expect(parseExpression('(2 * a) ? b : c', ['a', 'b', 'c'])).toEqual('2 * a ? b : c');
    expect(parseExpression('(2 * a) ? b : c', [])).toEqual('2 * $state.a ? $state.b : $state.c');
  })

});
