const Video = require("../models/Video");

// GET - listar vídeos
exports.getVideos = async (req, res) => {
  const videos = await Video.find().sort({ publishDate: -1 });
  res.json(videos);
};

// POST - crear vídeo (admin)
exports.createVideo = async (req, res) => {
  const { title, description, youtubeId, publishDate } = req.body;

  if (!title || !youtubeId || !publishDate) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  const video = new Video({
    title,
    description,
    youtubeId,
    publishDate,
  });

  await video.save();
  res.status(201).json({ msg: "Vídeo añadido 🎥" });
};

// DELETE - borrar vídeo (admin)
exports.deleteVideo = async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ msg: "Vídeo eliminado 🗑️" });
};

// EDITA - borrar vídeo (admin)
exports.updateVideo = async (req, res) => {
  try {
    const { title, description, publishDate } = req.body;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description, publishDate },
      { new: true }
    );

    res.json(video);
  } catch (error) {
    console.error("ERROR UPDATE VIDEO:", error);
    res.status(500).json({ msg: "Error al actualizar vídeo" });
  }
};
