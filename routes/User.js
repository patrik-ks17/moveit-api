const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const User = mongoose.model("User");
const ProfileInfo = mongoose.model("Profile");

router.post("/logged", async (req, res) => {
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
				res.json({ status: "ok", data: data });
			})
			.catch((error) => {
				res.json({ status: "error", data: error });
			});
	} catch (error) {
		res.json({ status: "error", error: error });
	}
});


router.post("/all", async (req, res) => {
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
		if (!user) {
			res.json({ status: "error", error: "Invalid User" });
		}
		User.collection
			.find()
			.toArray()
			.then((data) => {
				res.json({ status: "ok", data: data });
			})
			.catch((error) => {
				res.json({ status: "error", data: error });
			});
	} catch (error) {
		res.json({ status: "error", error: error });
	}
});


router.put("/edit", async (req, res) => {
	const { token, clickedUser: email, editedData } = req.body;

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
		const ReqUser = await User.findOne({ email: user.email })
		if (ReqUser.usertype !== "admin") {
			return res.json({ status: "error", data: "you are not an admin" })
		}
		const EditingUser = await User.findOne(
			{
				email: email
			}
		)
		const Data = new ProfileInfo({
			profilePicture: EditingUser.profile.profilePicture,
			nickname: editedData?.nickname ? editedData.nickname : EditingUser.profile.nickname,
			profession: editedData?.profession ? editedData.profession : EditingUser.profile.profession,
			info: editedData?.info ? editedData.info : EditingUser.profile.info,
			social: EditingUser.profile.social
		})
		await User.findOneAndUpdate(
			{
				email: email
			},
			{
				$set: {
					profile: Data
				}
			}
		)
		res.json({ status: "ok" });
	} catch (error) {
		res.json({ status: "error" });
	}
});



router.put("/usertype", async (req, res) => {
	const { token, clickedUser: email, setUsertype } = req.body;

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
		const ReqUser = await User.findOne({ email: user.email })
		if (ReqUser.usertype !== "admin") {
			return res.json({ status: "error", data: "you are not an admin" })
		}
		await User.updateOne(
			{
				email: email
			},
			{
				$set: { usertype: setUsertype }
			}
		)
		res.json({ status: "ok" });
	} catch (error) {
		res.json({ status: "error" });
	}
});


router.delete("/delete", async (req, res) => {
	const { token, clickedUser: email } = req.body;

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
		const ReqUser = await User.findOne({ email: user.email })
		if (ReqUser.usertype !== "admin") {
			return res.json({ status: "error", data: "you are not an admin" })
		}
		await User.findOneAndDelete(
			{
				email: email
			}
		)
		res.json({ status: "ok" });
	} catch (error) {
		res.json({ status: "error" });
	}
});




module.exports = router;
