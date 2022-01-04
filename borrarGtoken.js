const fs = require('fs');

var data = fs.readFileSync('./node_modules/gtoken/build/src/index.js', 'utf-8');
var newValue = data.replace('const pify = require("pify");', '');
fs.writeFileSync('./node_modules/gtoken/build/src/index.js', newValue, 'utf-8');

var data2 = fs.readFileSync('./node_modules/gtoken/build/src/index.js', 'utf-8');
var newValue2 = data2.replace('const readFile = pify(fs.readFile);', '');
fs.writeFileSync('./node_modules/gtoken/build/src/index.js', newValue2, 'utf-8');