// require mongoose
var mongoose = require('mongoose');

// new Schema
var ScrapedDataSchema = new mongoose.Schema({
	title: {
		type: String
	},
	imgURL: {
		type: String
	},
	title: {
		synopsis: String
	},
})

// use the abvoe schema to make the ScrapedData model
var ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);

// export the model so the server can use it
module.exports = ScrapedData;