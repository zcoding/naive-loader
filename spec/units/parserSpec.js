describe("表达式解析", function() {
  const parseExpression = require('../../lib/expression-parser');

  it("函数调用", function() {
    expect(parseExpression('handleClick()')).toEqual('$vm.handleClick()');
    expect(parseExpression('handleClick(123)')).toEqual('$vm.handleClick(123)');
    expect(parseExpression('handleClick("123")')).toEqual('$vm.handleClick("123")');
    expect(parseExpression('handleClick(item)')).toEqual('$vm.handleClick($vm.item)');
    expect(parseExpression('handleClick($event)', ['$event'])).toEqual('$vm.handleClick($event)');
  });

  it("对象成员", function() {
    expect(parseExpression('a.b.c')).toEqual('$vm.a.b.c');
    expect(parseExpression('a.b.c', ['b', 'c'])).toEqual('$vm.a.b.c');
    expect(parseExpression('a.b.c', ['a', 'b', 'c'])).toEqual('a.b.c');
    expect(parseExpression('a[b[c[d]]]')).toEqual('$vm.a[$vm.b[$vm.c[$vm.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a'])).toEqual('a[$vm.b[$vm.c[$vm.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a', 'b'])).toEqual('a[b[$vm.c[$vm.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a', 'b', 'c'])).toEqual('a[b[c[$vm.d]]]');
    expect(parseExpression('a[b[c[d]]]', ['a', 'b', 'c', 'd'])).toEqual('a[b[c[d]]]');
    expect(parseExpression('a[b].c')).toEqual('$vm.a[$vm.b].c');
    expect(parseExpression('a.b[c]')).toEqual('$vm.a.b[$vm.c]');
    expect(parseExpression('a["b"].c')).toEqual('$vm.a["b"].c');
    expect(parseExpression('a.b["c"]')).toEqual('$vm.a.b["c"]');
    expect(parseExpression('a[b + c]', ['a'])).toEqual('a[$vm.b + $vm.c]');
    expect(parseExpression('a[b + c].d', ['a', 'b'])).toEqual('a[b + $vm.c].d');
  });

  it("二元运算", function() {
    expect(parseExpression('1 + 1')).toEqual('1 + 1');
    expect(parseExpression('1 + item')).toEqual('1 + $vm.item');
    expect(parseExpression('1 + item', ['item'])).toEqual('1 + item');
    expect(parseExpression('1 + item + "3"')).toEqual('1 + $vm.item + "3"');
    expect(parseExpression('(1 + 2) * (a - b)')).toEqual('(1 + 2) * ($vm.a - $vm.b)');
  });

  it("一元运算", function() {
    expect(parseExpression('+1')).toEqual('+1');
    expect(parseExpression('+item')).toEqual('+$vm.item');
    expect(parseExpression('++item')).toEqual('++$vm.item');
    expect(parseExpression('item--')).toEqual('$vm.item--');
  });

  it("条件运算", function() {
    expect(parseExpression('(2 * a) ? b : c', ['a', 'b', 'c'])).toEqual('2 * a ? b : c');
    expect(parseExpression('(2 * a) ? b : c', [])).toEqual('2 * $vm.a ? $vm.b : $vm.c');
  })

});
