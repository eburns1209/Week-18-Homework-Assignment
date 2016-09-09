// require mongoose
var mongoose = require('mongoose');

// new Schema
var ScrapedDataSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true // make sure the article is not repeated again
	},
	imgURL: {
		type: String,
		required: true
	},
	synopsis: {
		type: String,
		required: true
	},
	articleURL: {
		type: String,
		required: true
	}
})

// use the abvoe schema to make the ScrapedData model
var ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);

// export the model so the server can use it
module.exports = ScrapedData;