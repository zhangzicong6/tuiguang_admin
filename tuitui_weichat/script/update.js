/*var ConfigModel = require('../model/Config');

async function delTag(code) {
    await ConfigModel.update({code:code},{status:1})
}

for (let i = 54; i <= 62; i++) {
    delTag(i)
}*/


var program = require('commander');

program.version('1.0.0')
.option('-C , --code <n>','add a code for wechat ',parseInt)
.parse(process.argv);

if(program.code){
	
}


