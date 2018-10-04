var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserPostSchema = {
	id: String,
	name: String,
	is_hidden: Boolean,
	is_published: Boolean,
	from: Object,
	full_picture: String,
	created_time: String,
	picture: String,
	updated_time: String,
	link: String,
	description: String,
	message: String
}

var UserPostModel = mongoose.model('users_posts', UserPostSchema);

module.exports  = UserPostModel;