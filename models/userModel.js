const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	profile: { type: Object, ref: "Profile" },
	markers: [{ type: Object, ref: "Marker" }],
	usertype: { type: String }
}, {
	collection: "User"
});


const ProfileSchema = new mongoose.Schema({
	profilePicture: { type: String, default: "" },
	nickname: { type: String, default: "" },
	profession: { type: String, default: "" },
	info: { type: String, default: "" },
	social: { type: Object, default: Object, ref:"SocialLinks" }
}, {
	collection: "User"
});

const SocialSchema = new mongoose.Schema({
	tiktok: { type: String, default: "" },
	twitter: { type: String, default: "" },
	instagram: { type: String, default: "" },
	facebook: { type: String, default: "" },
	linkedin: { type: String, default: "" }
}, {
	collection: "User"
})


const MarkerSchema = new mongoose.Schema({
	lat: Number,
	lng: Number,
	sport: String,
	time: { type: Object, ref: 'MarkerTime' }
}, {
	collection: "User",
	timestamps: true,
	strict: true
});

const MarkerTimeSchema = new mongoose.Schema({
	start: Date,
	end: Date
}, {
	collection: "User"
})

const ChatSchema = new mongoose.Schema({ 
	message: String
}, {
	collection: "Chat"
})


mongoose.model("Chat", ChatSchema);


mongoose.model('User', UserSchema);

mongoose.model('Marker', MarkerSchema);
mongoose.model('MarkerTime', MarkerTimeSchema);

mongoose.model('Profile', ProfileSchema);
mongoose.model('SocialLinks', SocialSchema);
