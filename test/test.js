// load Unit.js module
var test = require('unit.js');

var fs = require('fs');

var version = /VERSION\s*=\s*(.*?)\n/.exec(
        fs.readFileSync('Makefile').toString())[1];

var min_js = 'final/bkrs.info/colorize-pinyin@{}/colorize-pinyin.min.js'.replace('{}', version),
    dest_js = 'test/bkrs.info/javascript/color.min.js';

if (fs.existsSync(dest_js)) {
    fs.unlinkSync(dest_js)
}
fs.linkSync(min_js, dest_js);

var htmls = fs.readdirSync('test/bkrs.info')
            .filter(function(name){return name.endsWith('.html')})
            .map(function(name){return 'test/bkrs.info/' + name});

console.log("manual tesing.  opening pages in browser:");
console.log(htmls);

// Mac OS X way to open files in default application.
require('child_process').spawnSync("open", htmls);
