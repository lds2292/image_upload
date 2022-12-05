const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");

const fileUnlink = promisify(fs.unlink);

imageRouter.post("/", upload.array("image"), async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다");
    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = await new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          key: file.filename,
          originalFileName: file.originalname,
        }).save();
        return image;
      })
    );
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/", async (req, res) => {
  try {
    const { lastid } = req.query;
    if (lastid && mongoose.isValidObjectId(lastid))
      throw new Error("Invalid lastid");

    const images = await Image.find(
      lastid
        ? {
            public: true,
            _id: { $lt: lastid },
          }
        : { public: true }
    )
      .sort({ _id: -1 })
      .limit(8);
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다");

    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 Image id 입니다");

    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if (!image) return res.json({ message: "삭제완료" });
    await fileUnlink(`./uploads/${image.key}`);

    res.json({ message: "삭제완료", image });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  console.log(req.user);
  try {
    if (!req.user) throw new Error("권한이 없습니다");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 Image id 입니다");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 Image id 입니다");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };
