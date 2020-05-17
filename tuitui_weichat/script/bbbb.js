var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');

async function b() {
    let code = process.argv.slice(2)[0]
    memcached.get('access_token' + code, function (err, token) {
        console.log(token, '------------test')
    })
}
b()