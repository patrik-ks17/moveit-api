const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const User = mongoose.model("User");


router.post("/", async (req, res) => {
	const { usern, password } = req.body;
	const user = await User.findOne({
	  $or: [{ email: usern }, { username: usern }],
	});
	if (!user) {
	  return res.json({ error: "User not found" });
	}
	if (await bcrypt.compare(password, user.password)) {
	  const token = jwt.sign({ email: user.email }, JWT_SECRET, {
		 expiresIn: "10h",
	  });
	  const data = {
		 token: token,
		 email: user.email,
		 usertype: user.usertype,
	  };
 
	  if (res.status(201)) {
		 return res.json({ status: "ok", data: data });
	  } else {
		 return res.json({ error: "error" });
	  }
	}
	res.json({ status: "error", error: "Invalid password" });
 });

 module.exports = router;