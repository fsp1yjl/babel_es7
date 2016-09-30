


async function test() {
    return new Promise((resolve,reject)=>{
        console.log('test')
        setTimeout(function(){console.log('hhhhhh'); resolve('tell me')},5000);
       
    })

    // return new Promise((resolve, reject)=>{
    //     request(options, function (error, response, body) {
    //         if(error)
    //             reject(error)
    //         else
    //             resolve(body)    
    //     })    
    // })
}

(async function printAsync() {
        console.log('a::ddd')
    var a = await test();
    console.log('a::',a)
}())



 // node_modules/.bin/babel ./src --out-dir build



