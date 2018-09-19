import 'assets/lib/scroll/jquery.nanoscroller';

var b = 'hello';
console.log('index.js');

require.ensure([], function(require){
    console.log('index.js');
    var b = require('components/a/a');

    console.log(b);
    $('body').css({
        'background': '#ff0000'
    });
}, 'index');

require.ensure([], function(require){
    var c = require('components/c/c');
    console.log(c);

}, 'indexB');