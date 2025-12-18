// src/utils/convertToEmbed.js

export function convertToEmbed(url) {
  if (!url) return null;

  try {
    // 🎥 YOUTUBE
    if (url.includes("youtube.com")) {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // 🎬 LOOM
    if (url.includes("loom.com/share/")) {
      return url.replace("/share/", "/embed/");
    }

    // 🎞️ VIMEO
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return null;
  } catch (err) {
    return null;
  }
}

