const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = mongoose.model("User");


router.post("/", async (req, res) => {
	const { username, email, password } = req.body;
	const encryptedPassword = await bcrypt.hash(password, 10);
	const def_profile = {
		profilePicture: "",
		nickname: "",
		profession: "",
		info: "",
		social: {
			tiktok: "",
			twitter: "",
			instagram: "",
			facebook: "",
			linkedin: ""
		}
	}
	try {
		const oldUser = await User.findOne({ email });
		if (oldUser) {
			return res.json({ error: "User already exists" });
		}
		await User.create({
			username,
			email,
			password: encryptedPassword,
			profile: def_profile,
			usertype: "user",
		});

		return res.json({ status: "ok" });
	} catch (error) {
		return res.json({ status: "error" });
	}
});

module.exports = router;