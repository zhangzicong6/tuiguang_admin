var fs = require('fs')
    , gm = require('gm');
var request = require('request');
var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');
var exec = require('child_process').exec;
var zero_conf = require('../conf/zero.json');
process.env.PATH += ":/usr/local/GraphicsMagick-1.3.28/bin";

function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

function downloadHead(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

function share_img(ticket, qr_name, callback) {
    /*gm(__dirname+'/qr_image/'+qr_name)
     .resize(300)
     .write(__dirname+'/qr_image/small_'+qr_name,function(err){
     if(err){
     console.log(err);
     }
     gm()
     .in('-page', '+0+0')
     .in(__dirname+'/qr_image/temp.jpeg')
     .in('-page', '+270+500')
     .in(__dirname+'/qr_image/small_'+qr_name)
     .mosaic()
     .write(__dirname+'/../public/qr_image/'+qr_name, function (err) {
     if(err){
     console.log(err);
     }
     memcached.set('qr_'+ticket,qr_name,7*24*60*60,function(err){});
     callback(qr_name);
     });
     });*/
    var resize_cmd = 'gm "convert" "' + __dirname + '/qr_image/' + qr_name + '" "-resize" "164x" "' + __dirname + '/qr_image/small_' + qr_name + '"';
    exec(resize_cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/qr_image/tmp_bg_nickname.png" "-page" "+294+1119" "' + __dirname + '/qr_image/small_' + qr_name + '" "-mosaic" "' + __dirname + '/../public/qr_image/' + qr_name + '"'
        exec(mosaic_cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            memcached.set('qr_' + ticket, qr_name, 7 * 24 * 60 * 60, function (err) {
            });
            callback(qr_name);
        });
    });
}

function getQRImg(ticket, callback) {
    memcached.get('qr_' + ticket, function (err, qr) {
        if (qr) {
            return callback(qr);
        }
        var qr_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
        console.log(qr_url);
        var qr_name = Date.now() + '' + parseInt(Math.random() * 10000) + '.jpg';
        var qr_path = __dirname + '/qr_image/' + qr_name;
        downloadFile(qr_url, qr_path, function (err, res) {
            share_img(ticket, qr_name, callback);
        });
    });
}

function user_img(ticket, qr_name, nickname, headimgurl, callback) {
    var resize_cmd = 'gm "convert" "' + __dirname + '/user_image/' + qr_name + '" "-resize" "200x" "' + __dirname + '/user_image/small_' + qr_name + '"';
    if (nickname && headimgurl) {
        var resize_head = 'gm "convert" "' + __dirname + '/user_image/head_' + qr_name + '" "-resize" "167x" "' + __dirname + '/user_image/smallhead_' + qr_name + '"';

        exec(resize_cmd, function (error, stdout, stderr) {
            exec(resize_head, function (errorhead, stdouthead, stderrhead) {
                if (error) {
                    console.log(error);
                }
                if (errorhead) {
                    console.log(errorhead);
                }
                var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/user_image/tmp_bg_nickname.png" ' +
                    '"-page" "+369+1046" "' + __dirname + '/user_image/small_' + qr_name + '" "-page" "+163+1042" "' + __dirname + '/user_image/smallhead_'
                    + qr_name + '" "-mosaic" "' + __dirname + '/user_image/' + qr_name + '"'
                console.log(mosaic_cmd,'--------------------mosaic_cmd')

                exec(mosaic_cmd, function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                    }
                    memcached.set('img_' + ticket, qr_name, 7 * 24 * 60 * 60, function (err, qr) {
                        console.log(qr, '------------------set qr');
                    });
                    callback(qr_name);
                });
            });
        });
    } else {
        exec(resize_cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/user_image/tmp_bg.png" ' +
                '"-page" "+274+1046" "' + __dirname + '/user_image/small_' + qr_name + '"' +
                ' "-mosaic" "' + __dirname + '/user_image/' + qr_name + '"'

            exec(mosaic_cmd, function (error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                memcached.set('img_' + ticket, qr_name, 7 * 24 * 60 * 60, function (err, qr) {
                    console.log(qr, '------------------set qr');
                });
                callback(qr_name);
            });
        });
    }
}


function getUserImg(ticket, nickname, headimgurl, callback) {
    memcached.get('img_' + ticket, function (err, qr) {
        if (qr) {
            return callback(qr);
        }
        var qr_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
        var qr_name = Date.now() + '' + parseInt(Math.random() * 10000) + '.jpg';
        var qr_path = __dirname + '/user_image/' + qr_name;
        var head_path = __dirname + '/user_image/head_' + qr_name;
        if (headimgurl) {
            downloadHead(headimgurl, head_path, function (err1, res) {
                if (err1) {
                    console.log(err1, '------------------err1')
                }
                downloadFile(qr_url, qr_path, function (err2, res) {
                    if (err2) {
                        console.log(err2, '------------------err2')
                    }
                    user_img(ticket, qr_name, nickname, headimgurl, callback);
                });
            })
        } else {
            downloadFile(qr_url, qr_path, function (err2, res) {
                if (err2) {
                    console.log(err2, '------------------err2')
                }
                user_img(ticket, qr_name, nickname, headimgurl, callback);
            });
        }
    });
}

function zero_img(code,headimgurl, ticket, qr_name, callback) {
    var resize_cmd = 'gm "convert" "' + __dirname + '/qr_image/' + qr_name + '" "-resize" "168x" "' + __dirname + '/qr_image/small_' + qr_name + '"';
    if (headimgurl) {
        var resize_head = 'gm "convert" "' + __dirname + '/qr_image/head_' + qr_name + '" "-resize" "159x" "' + __dirname + '/qr_image/smallhead_' + qr_name + '"';
        exec(resize_cmd, function (error, stdout, stderr) {
            exec(resize_head, function (errorhead, stdouthead, stderrhead) {
                if (error) {
                    console.log(error);
                }
                var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/create_fixed/'+code+'_zero_tmp_bg.png" "-page" "+475+1158" "'
                    + __dirname + '/qr_image/small_' + qr_name + '" "-page" "+268+1156" "' + __dirname + '/qr_image/smallhead_' + qr_name
                    + '" "-mosaic" "' + __dirname + '/../public/qr_image/' + qr_name + '"'

                exec(mosaic_cmd, function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                    }else{
                        console.log('======图片生成完成======-----'+qr_name);
                        memcached.set('zero_' + zero_conf[code].version + ticket, qr_name, 7 * 24 * 60 * 60, function (err) {
                        });
                    }
                    callback(qr_name);
                });
            });
        });
    } else {
        exec(resize_cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/create_fixed/zero_tmp_bg.png" "-page" "+475+1158" "' + __dirname + '/qr_image/small_' + qr_name + '" "-mosaic" "' + __dirname + '/../public/qr_image/' + qr_name + '"'
            exec(mosaic_cmd, function (error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                memcached.set('zero_' + zero_conf.version + ticket, qr_name, 7 * 24 * 60 * 60, function (err) {
                });
                callback(qr_name);
            });
        });
    }
}

function getZeroImg(code,headimgurl, ticket, callback) {
    memcached.get('zero_' + zero_conf[code].version + ticket, function (err, qr) {
        if (qr) {
            return callback(qr);
        }
        var qr_url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
        console.log('ticket url  :  '+qr_url);
        var qr_name = Date.now() + '' + parseInt(Math.random() * 10000) + '.jpg';
        var qr_path = __dirname + '/qr_image/' + qr_name;
        var head_path = __dirname + '/qr_image/head_' + qr_name;
        if (headimgurl) {
            downloadHead(headimgurl, head_path, function (err1, res1) {
                downloadFile(qr_url, qr_path, function (err, res) {
                    zero_img(code,headimgurl, ticket, qr_name, callback);
                });
            })
        } else {
            downloadFile(qr_url, qr_path, function (err, res) {
                zero_img(code,headimgurl, ticket, qr_name, callback);
            });
        }
    });
}

// zero_img('ticket-------test', '15275821543044430.jpg', function (name) {
//     console.log(name)
// })

module.exports.getQRImg = getQRImg
module.exports.getUserImg = getUserImg
module.exports.getZeroImg = getZeroImg

/*
 getQRImg('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQEX8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyRDBfa0p3dXdkYWgxMDAwMGcwN0QAAgSHZ69aAwQAAAAA',function(qr_name){
 console.log('生成宣传图：'+qr_name);
 });*/