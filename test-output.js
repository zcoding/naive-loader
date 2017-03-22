function render(h, _) {
  var state = this.state;
  var _uid = "3cd92d44-b012-4fc1-9481-893cf5c59d18";
  return h("ul", {}, [
    "\n  ",
    _.each(list, function(item, $index, $key) { return {key: _uid + "-3" + "-" + $key, tagName: "li", attrs: {"@click": _.bindEvent('handleClick', [item, $index, '$event']), children: [
      item
    ]};}),
    "\n"
  ], _uid + "-2");
}

