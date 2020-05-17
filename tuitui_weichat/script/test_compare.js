var UserconfModel = require('../model/Userconf');
var OpenidTagModel = require('../model/OpenidTag');
var SubOpenidTagModel = require('../model/SubOpenidTag');

var obj_users = {}

function compare(id) {
    let code = process.argv.slice(2)[0]
    UserconfModel.fetch_userSign(id,code,function(err,data){
		var con_openids = []
		for (var index in data) {
			con_openids.push(data[index].openid);
			obj_users[data[index].openid] = data[index]
		}
		OpenidTagModel.find({code:code,openid:{$in:con_openids}},['openid']).exec(function(error,tag_ois){
			var tag_openids = []
			for (var index in tag_ois) {
				tag_openids.push(tag_ois[index].openid)
			}
			var subArr = subSet(con_openids,tag_openids)
			console.log(subArr.length)
			var openids = [];
            for (var index in subArr) {
            	var openid = subArr[index];
            	if(openid){
            		openids.push({
	                   'openid': openid, 
	                   'code': code,
	                	'sign' : obj_users[openid].sign,
	                	'sex' : obj_users[openid].sex
	                });
            	}
            }
            if(openids.length){
            	// console.log(openids)
                // return
            	SubOpenidTagModel.insertMany(openids,function(err,docs){
	            	obj_users = {}
	            	if(data.length==500){
	            		compare(data[499]._id,code)
	            	}else{
	            		console.log('.........end...........')
	            	}
	            })
            }else{
            	obj_users = {}
            	if(data.length==500){
            		compare(data[499]._id,code)
            	}else{
            		console.log('..........end...........')
            	}
            }
            
		})
	})
}

var subSet = function(arr1, arr2) {
    var set1 = new Set(arr1);
    var set2 = new Set(arr2);

    var subset = [];

    for (let item of set1) {
        if (!set2.has(item)) {
            subset.push(item);
        }
    }

    return subset;
};

compare(null)