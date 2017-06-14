var fs = require('fs')
function wrap(func,is_multi_return) {
    return function() {
        return new Promise((resolve,reject) => {
            arguments[arguments.length++] = function(err, ...rest) {
                console.log('3333')
                resolve(rest);
            }
            console.log('2222')
            func.apply(this,arguments)
        })

    }
}

var util = {};
util.readdir = wrap(fs.readdir);

async function test() {
    console.log('1111')
    let ret = await util.readdir(__dirname);
    console.log('4444')
    console.log('ret:',ret)
    return ret;
}
console.log('befor test');
test().then(ses => console.log('rest:',ses));

/*
console.log('5555');
(async () => {await test()})();
*/
