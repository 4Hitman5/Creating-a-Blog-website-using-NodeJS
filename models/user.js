const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	admin: {
		type: Boolean,
		default:false
	}
}, {
	timestamps: true
});

// User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);