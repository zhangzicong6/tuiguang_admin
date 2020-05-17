var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url); 

var DomainSchema = new Schema({
    domain_name: String
});

var DomainModel = db.model('Domain', DomainSchema);
module.exports = DomainModel;
