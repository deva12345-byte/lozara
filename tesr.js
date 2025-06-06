const imageModel = require("../model/imageModel");
const fs = require("fs");
const path = require("path");

module.exports.uploadImage = async (req, res) => {
  try {
    const title = req.body.title || '';
    const filename = req.file?.filename;

    if (!filename) return res.status(400).json({ error: "Image required" });

    const result = await imageModel.addImage(filename, title);
    res.json({ success: true, message: "Image uploaded", data: result });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.listImages = async (req, res) => {
  try {
    const images = await imageModel.getAllImages();
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const [image] = await imageModel.getImageById(id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Delete file from uploads/
    const filePath = path.join(__dirname, "../uploads", image.filename);
    fs.unlinkSync(filePath);

    await imageModel.deleteImage(id);
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
