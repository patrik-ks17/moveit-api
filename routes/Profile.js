const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const User = mongoose.model("User");
const ProfileInfo = mongoose.model("Profile");

router.post("/get", async (req, res) => {
	const { token } = req.body;
	try {
	  const user = jwt.verify(token, JWT_SECRET, (err, res) => {
		 if (err) {
			return "token expired";
		 }
		 return res;
	  });
	  if (user == "token expired") {
		 return res.json({ status: "error", data: "token expired" });
	  }
	  const useremail = user.email;
	  User.findOne({ email: useremail })
		 .then((data) => {
			return res.json({ status: "ok", data: data.profile });
		 })
		 .catch((error) => {
			return res.json({ status: "error", data: error });
		 });
	} catch (error) {
	  return res.json({ status: "error", error: error });
	}
 });

router.put("/edit", async (req, res) => {
	const token = req.body.token;
	const { profilePicture, nickname, profession, info, social } = req.body.profileInfo;
 
	try {
	  const profileInfo = new ProfileInfo({ profilePicture, nickname, profession, info, social });
	  const user = jwt.verify(token, JWT_SECRET);
	  const email = user.email;
 
	  await User.updateOne(
		 {
			email: email
		 },
		 {
			$set: { profile: profileInfo }
		 }
	  )
	  return res.json({ status: "ok" });
	} catch (error) {
	  return res.json({ status: "error" });
	}
 });


 module.exports = router;