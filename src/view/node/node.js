import 'assets/lib/scroll/jquery.nanoscroller';

var b = 'hello';
console.log('node.js');

$('body').css({
    'background': '#ff0101'
});
require.ensure([], function (require) {
    console.log('node.js');
    var b = require('components/c/c');
    console.log(b);
    $('body').css({
        'background': '#ff0101'
    });
}, 'node');


