var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var MarketingSchema = new Schema({
    app_id: String,
    advertiser_id: String,
    secret: String,
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    refresh_time: Number,
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

var MarketingModel = db.model('Marketing', MarketingSchema);

module.exports = MarketingModel;