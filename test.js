const fs = require('fs');
const parse5 = require('parse5');
const vdomTemplate = require('./lib/vdom-template');

fs.readFile('./test/app.naive', 'utf8', function (err, data) {
  if (err) {
    console.error(err);
  }
  const fragment = parse5.parseFragment(data, {
    locationInfo: true
  });
  const result = vdomTemplate(data, 0);
  fs.writeFile('./test-output.js', result, function (err) {
    if (err) {
      console.error(err);
    }
    console.log('done');
  });
});
