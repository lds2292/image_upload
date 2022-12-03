const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.password.length < 6) throw new Error("비밀번호 6자 이상");
    const hashedPassword = await hash(req.body.password, 10);
    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();

    const session = user.sessions[0];

    res.json({
      message: "user registered",
      sessionId: session._id,
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) throw new Error("회원을 찾을 수 없습니다");

    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("입력하신 정보가 올바르지 않습니다");
    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length - 1];
    await user.save();
    res.json({
      message: "user validated",
      sessionId: session._id,
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user) throw new Error("Invalid User");

    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );

    res.json({ message: "user is logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다");

    res.json({
      message: "user registered",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.meesage });
  }
});

module.exports = { userRouter };
