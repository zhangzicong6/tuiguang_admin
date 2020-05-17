const crypto = require('crypto');
const request = require("request");
const rp = require('request-promise');
const schedule = require("node-schedule");

const Platform = require("../model/Platform");
const PlatformData = require("../model/PlatformData");

const secret = "n3BtjDGlSL23wk4vbd2kj8dboaOZHMi8";


// let rule = new schedule.RecurrenceRule();
// rule.second = 50;
// let j = schedule.scheduleJob(rule, function () {
//     // getPlatformData()
// });

function getAdvertisePlan(qs) {
    return new Promise((resolve, reject) => {
        let url = "https://ad.oceanengine.com/open_api/2/ad/get/";
        request({
            url,
            method: "get",
            qs: {...qs},
            json: true
        }, (err, res) => {
            if(err || res.statusCode !=200) {
                console.log("error: " + err);
                console.log(res.statusCode)
                reject(err)
            } else {
                let {code, data} = res.body;
                if(code == 1) {
                    console.log("============getTengwenData success===============")
                    console.log(JSON.stringify(res.body))
                    let {pageCount, currentPage, dataSource} = data;
                    mapUserDataSource(dataSource, qs)
                } else {
                    console.log("============getTengwenData===============")
                    console.log(res.body)
                }
            }
        })
    })
};
