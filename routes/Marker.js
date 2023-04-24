const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const User = mongoose.model("User");
const Marker = mongoose.model("Marker");

router.post("/add", async (req, res) => {
	const token = req.body.token;
	const { lat, lng, sport, time } = req.body.selected;
	try {
	  if (Object.keys(req.body.selected).length === 0) {
		 return res.json({ status: "error", error: "Didn't select a marker" });
	  }
	  const user = jwt.verify(token, JWT_SECRET);
	  const email = user.email;
	  const oldMarker = await User.findOne(
		 {
			email: email,
			"markers.lat": {
			  $in: [lat],
			},
			"markers.lng": {
			  $in: [lng],
			},
		 },
		 {
			"markers.$": 1,
		 }
	  );
	  if (oldMarker) {
		 return res.json({ status: "error", error: "Marker already exists" });
	  }
	  const findUser = await User.findOne({ email: email });
	  const marker = new Marker({
		 lat,
		 lng,
		 sport,
		 time,
	  });
	  findUser.markers.push(marker);
	  findUser.save();
	  res.json({ status: "ok" });
	} catch (error) {
	  res.json({ status: "error" });
	}
 });

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
			return res.json({ status: "ok", data: data.markers });
		 })
		 .catch((error) => {
			return res.json({ status: "error", data: error });
		 });
	} catch (error) {
	  return res.json({ status: "error", error: error });
	}
 });


 router.delete("/delete", async (req, res) => {
	const { token } = req.body;
	const selected = {
	  lat: req.body.selected.lat,
	  lng: req.body.selected.lng,
	  sport: req.body.selected.sport,
	  time: req.body.selected.time,
	};
 
	try {
	  const user = jwt.verify(token, JWT_SECRET);
	  const email = user.email;
		await User.updateOne(
		 {
			email: email,
		 },
		 {
			$pull: { markers: selected },
		 }
	  )
		 .then((data) => {
			return res.json({ status: "ok", data: data });
		 })
		 .catch((error) => {
			return res.json({ status: "error", data: error });
		 });
	} catch (error) {
	  return res.json({ status: "error", message: error });
	}
 });

 module.exports = router;