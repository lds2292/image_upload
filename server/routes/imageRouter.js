const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");
const { s3, getSignedUrl } = require("../aws");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

// const fileUnlink = promisify(fs.unlink);

imageRouter.post("/presigned", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다");

    const { contentTypes } = req.body;
    if (!Array.isArray(contentTypes)) throw new Error("Inavlid ContentTypes");
    const presignedData = await Promise.all(
      contentTypes.map(async (contentType) => {
        const imageKey = `${uuid()}.${mime.extension(contentType)}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl({ key });
        return { imageKey, presigned };
      })
    );

    res.json(presignedData);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.post("/", upload.array("image"), async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다");
    console.log(req.files);
    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = await new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          key: file.key.replace("raw/", ""),
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
    if (lastid && !mongoose.isValidObjectId(lastid))
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
      .limit(20);
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId)) throw new Error("Invalid Image id");
    const image = await Image.findOne({ _id: imageId });

    if (!image) throw new Error("존재하지 않는 이미지 입니다");

    if (
      !image.public &&
      (!req.user || req.user.id !== image.user._id.toString())
    )
      throw new Error("권한이 없습니다");

    res.json(image);
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
    // await fileUnlink(`./uploads/${image.key}`);

    s3.deleteObject(
      {
        Bucket: "browngoo-image-upload-tutorial",
        Key: `raw/${image.key}`,
      },
      (err) => {
        if (err) throw err;
      }
    );

    res.json({ message: "삭제완료", image });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
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
