describe("指令解析", function() {
  const parseEach = require('../../lib/directive-parser');

  it("n-each", function() {
    expect(parseEach('item in items')).toEqual({val: 'item', obj: 'items', idx: '', key: ''});
    expect(parseEach('(item, index) in items')).toEqual({val: 'item', obj: 'items', idx: '', key: 'index'});
    expect(parseEach('(val, key) in object')).toEqual({val: 'val', obj: 'object', idx: '', key: 'key'});
    expect(parseEach('(val, key, index) in object')).toEqual({val: 'val', obj: 'object', idx: 'index', key: 'key'});
    expect(parseEach('(val, key, index) in object.a.b.c')).toEqual({val: 'val', obj: 'object.a.b.c', idx: 'index', key: 'key'});
  });

});
