var insert = function(collections,selector,callback) {
	var user = new collections(selector)
    user.save(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            //console.log("Res:" + res);
            callback(res)
        }
    });
}
var find = function(collections,selector,callback){
    collections.find(selector, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            //console.log("Res:" + res);
            callback(res)
        }
    })	
}
var update = function(collections, selector, callback){
    collections.update(selector[0], selector[1], function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            //console.log("Res:" + res);
            callback(res)
        }
    })
}
var deletes = function(collections, selector, callback) {
    collections.remove(selector, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            //console.log("Res:" + res);
            callback(res)
        }
    })
}
var methodType={
	insert:insert,
	find:find,
	update:update,
	delete:deletes
}
module.exports = function(method,collections,selector,callback){
	methodType[method](collections,selector,callback)
}