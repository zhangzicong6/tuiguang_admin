let OSS = require('ali-oss');
let accessKeyId = require('../conf/proj.json').accessKeyId;
let accessKeySecret = require('../conf/proj.json').accessKeySecret;


let client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: accessKeyId,
  accessKeySecret: accessKeySecret,
  bucket: 'tuiguang-img'
});

let upload = async (name,filename) =>{
	try{
	    //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
	    let result = await client.put(name, filename);
	    //console.log('------result-------')
	    //console.log(result);
	    return 'https://tuiguang-img.oss-cn-hangzhou.aliyuncs.com/'+name;
	} catch (e) {
	    console.log(e);
	}
}

module.exports.upload = upload;

//upload('baokuan.png',__dirname+'/../public/images/baokuan.png')