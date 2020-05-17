var UserconfModel = require('../model/Userconf');
function distinct() {
    var group = { openid: "$openid", code: '$code', sex: "$sex"};

    UserconfModel.aggregate({code:89,sex:'0'}).group({
        _id: group,
        uniqueIds: {$addToSet: '$_id'},
        count: {$sum: 1},
        allowDiskUse:true
    }).match({ count: {$gt: 1}}).exec(function (err,data) {
        console.log(err,'---------------------err')
        console.log(data,'---------------------data')
    });

}

distinct()