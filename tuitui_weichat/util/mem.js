var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');

module.exports.getContent = function (ticket) {
    return new Promise((resolve, reject) => {
        console.log(ticket, '-----------ticket1')
        memcached.get('user_' + ticket, function (err, content) {
            console.log(content, '-----------------content1')
            resolve(content)
        });
    })
}

module.exports.timeContent = function (openid) {
    return new Promise((resolve, reject) => {
        console.log(openid, '-----------usertime')
        memcached.get('usertime_' + openid, function (err, content) {
            console.log(content, '-----------------timecontent')
            resolve(content)
        });
    })
}

module.exports.bindContent =  function (openid) {
    return new Promise((resolve, reject) => {
        console.log(openid, '-----------bindtime')
        memcached.get('bindtime_' + openid, function (err, content) {
            console.log(content, '-----------------bindcontent')
            resolve(content)
        });
    })
}

module.exports.get = function(key){
    return new Promise((resolve, reject)=>{
        memcached.get(key,function(err,value){
            resolve(value);
        });
    });
}

module.exports.set = function(key,value,time){
    return new Promise((resolve, reject)=>{
        memcached.set(key,value,time,function(err,value){
            resolve(value);
        });
    });
}
