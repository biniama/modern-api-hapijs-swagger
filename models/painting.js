const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* There is no ID field because Mongoose will assign an ID to all schemas bydefault.*/

const PaintingSchema = Schema({
    name: String,
    url: String,
    technique: String
});

module.exports = mongoose.model('Painting', PaintingSchema); //Painting will be used for referencing.