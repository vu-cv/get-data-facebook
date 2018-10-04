var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = {
	id: String,
	age_range: String,
	birthday: String, 
	email: String, 
	first_name: String, 
	last_name: String, 
	education: String, 
	favorite_athletes: String, 
	favorite_teams: String, 
	link: String, 
	languages: String, 
	location: String, 
	middle_name: String, 
	quotes: String, 
	security_settings: Object, 
	short_name: String, 
	significant_other: Array, 
	sports: String, 
	picture: Object, 
	likes: Object
}

var UserModel = mongoose.model('users', UserSchema);

module.exports  = UserModel;