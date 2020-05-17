const schedule = require("node-schedule");
const MarketingModel = require('../model/marketing')
const request = require("request");

var refreshToken = async function () {
    var markets = await MarketingModel.find()
    for (let market of markets) {
        request({
            url: "https://ad.oceanengine.com/open_api/oauth2/refresh_token/",
            method: "post",
            qs: {
                app_id: market.app_id,
                secret: market.secret,
                grant_type: 'refresh_token',
                refresh_token: market.refresh_token
            },
            json: true
        }, async (err, res) => {
            if (res.code == 0) {
                await mem.set('marketing_access_token_' + market.app_id, res.data.access_token, 60)
                await MarketingModel.update({app_id: market.app_id}, {
                    access_token: res.data.access_token,
                    expires_in: res.data.expires_in,
                    refresh_token: res.data.refresh_token,
                    refresh_time: Date.now()
                })
            } else {
                console.log('refresh access_token error')
            }
        })
    }
}

var rule = new schedule.RecurrenceRule();
var times = [1];
rule.hour = times;
var j = schedule.scheduleJob(rule, function () {
    refreshToken()
});