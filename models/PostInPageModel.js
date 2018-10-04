var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostInPageSchema = {
	id: String, 
	caption: String, 
	created_time: String, 
	description: String, 
	cities: String, 
	from: Object, 
	full_picture: Array, 
	icon: String, 
	is_hidden: Boolean, 
	is_published: Boolean, 
	link: String, 
	message: String, 
	message_tags: Array, 
	name: String
}

var PostInPageModel = mongoose.model('posts_in_pages', PostInPageSchema);

module.exports  = PostInPageModel;