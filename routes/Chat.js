const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model("User");
const Chat = mongoose.model("Chat");


router.get('/', async (req,res)=> {
	const mess = await Chat.findById({_id: "643d0200c7f7a4b2471a89af"});
	res.send(mess)
})


module.exports = router;