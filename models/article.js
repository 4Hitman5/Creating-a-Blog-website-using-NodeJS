const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
// const createDomPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
// const dompurify = createDomPurify(new JSDOM().window);
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	secretKey: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	slug: {
		type: String,
		required: true,
		unique: true
	}
});

articleSchema.pre('validate', function(next) {
	if(this.title) {
		this.slug = slugify(this.title, { 
			lower: true, 
			strict: true
		});
	}
	next();
});

// sanitizedHtml: {
	// 	type: String,
	// 	required: true
	// }

// if(this.markdown) {
// 	this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
// }

module.exports = mongoose.model('Article', articleSchema);