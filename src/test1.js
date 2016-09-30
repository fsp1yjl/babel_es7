
const crypto = require('crypto')
const https = require('https');
const parseString = require('xml2js').parseString;

let obj = {};
let arr = [];
obj.appid = 'wx80c1fa604d0b9852';  //应用ID
obj.mch_id = '1377366902'; //商户号
// const device_info = "WEB"; //设备号
obj.nonce_str = "both%app"; //随机字符串,先写死，后续使用随机字符，不超过32位
obj.sign = ""; //签名
obj.body = "RunnerCamp-跑鞋"; //商品描述
obj.out_trade_no = "f83494ee744f9182ebec5b4e40a9a6dd"; //商品系统内部的订单号
obj.total_fee = 1;    //订单总金额，单位为分。 100表示一块钱
obj.spbill_create_ip = "192.168.1.100" //用户终端ip
obj.notify_url = "http://www.weixin.qq.com/wxpay/pay.php"  //后台异步回调地址
obj.trade_type = "APP"; //支付类型

for(var prop in obj) {
    if(obj[prop] != '') {
        arr.push(prop);
    }
}

arr.sort();
let comma = ""
let stringA = ""
for(let prop of arr) {
    stringA += `${comma}${prop}=${obj[prop]}`
    comma = "&"
}


console.log(stringA)


let key = 'f83494ee744f9182ebec5b4e40a9a6eb'
let stringSignTemp = `${stringA}&key=${key}`
obj.sign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
console.log('sign:::',obj.sign)

let content = `<xml>
                    <appid>${obj.appid}</appid>
                    <body>${obj.body}</body>
                    <mch_id>${obj.mch_id}</mch_id>
                    <nonce_str>${obj.nonce_str}</nonce_str>
                    <notify_url>${obj.notify_url}</notify_url>
                    <out_trade_no>${obj.out_trade_no}</out_trade_no>
                    <sign>${obj.sign}</sign>
                    <spbill_create_ip>${obj.spbill_create_ip}</spbill_create_ip>
                    <total_fee>${obj.total_fee}</total_fee>
                    <trade_type>${obj.trade_type}</trade_type>
                </xml>
                `
    console.log('contetn::::',content)

    let options = {
        host: 'api.mch.weixin.qq.com',
        path: '/pay/unifiedorder',
        method: 'POST',
        agent: false,
        rejectUnauthorized: false,

        headers: {
            'Content-Type': 'text/xml;charset=gbk',
            'Content-Length': content.length
            //'Content-Length' : Buffer.byteLength(comment,'utf8')
        }
    };


    let req = https.request(options, function (res) {
        res.setEncoding('utf8');
        let msg = "";
        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {
            console.log('over msg:' + msg);
            parseString(msg,function(err,result) {
                console.dir(JSON.stringify(result))
                let ret = sign_check(result.xml);
                console.log('ret::',ret)
            })
        });
    });

    req.write(content);
    req.end();
    //console.log("this...." + JSON.stringify(this.session))



function sign_check(prepay_info) {
    let param_obj = {};
    let param_arr = [];
    for(let prop in prepay_info) {
        param_obj[prop] = prepay_info[prop][0];
        if(prop != 'sign') {
            param_arr.push(prop)
        }
    }
    param_arr = param_arr.sort();

    let stringA = '';
    let comma = ''
    for( let elem of param_arr) {
        stringA += `${comma}${elem}=${param_obj[elem]}`
        comma = '&'
    }
    const key = 'f83494ee744f9182ebec5b4e40a9a6eb'
    stringA += `${comma}key=${key}`
    let check_sign = crypto.createHash('md5').update(stringA).digest('hex').toUpperCase();
    console.log('check_sign....',check_sign)
    if(check_sign == param_obj.sign) {
        return 1;
    } else {
        return 0;
    }

}

