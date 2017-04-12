const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

module.exports = function parseEach(directive) {
  const matchAlias = directive.match(forAliasRE);
  if (matchAlias === null) {
    return directive;
  }
  const iterators = matchAlias[1], obj = matchAlias[2];
  const matchIterators = iterators.match(forIteratorRE);
  if (matchIterators === null) {
    return {
      val: trim(iterators),
      obj: obj,
      idx: '',
      key: ''
    };
  }
  const val = trim(matchIterators[1]);
  const second = trim(matchIterators[2]);
  if (!matchIterators[3]) {
    return {
      val: val,
      obj: obj,
      idx: '',
      key: second
    };
  }
  const third = trim(matchIterators[3]);
  return {
    val: val,
    obj: obj,
    idx: third,
    key: second
  }
};
