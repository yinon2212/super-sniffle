const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CodeSchema = new Schema({
    code: String,
    lan: String,
    uniqueID: String
});

module.exports = mongoose.model('code', CodeSchema);