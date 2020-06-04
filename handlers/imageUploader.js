
const cloudinary = require('cloudinary').v2;

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.upload = async (req, options) => {
  const { files } = req;
  let images = [];
  for (const file in files) {
    if (files.hasOwnProperty(file)) {
      const path = files[file].tempFilePath;
      // TODO: See if we can upload the images based on type to cloudinary
      if (!options.format) {
        options.format = files[file].mimetype.split('/')[1];
      }
      const image = await cloudinary.uploader.upload(path, options);
      images = [...images, image];
    }
  }
  /*
  if (images.length === 1) {
    return images[0];
  }
  */
  return images;
};

exports.thumbnail_upload = async (thumbnail, options) => {
  const path = thumbnail.tempFilePath;
  const thumbnail_cloud = await cloudinary.uploader.upload(path, options);
  return thumbnail_cloud;
}

exports.images_upload = async (req, options) => {
  let { files } = req;
  let images = [];
  if (!files.images) {
    return;
  }
  if (!Array.isArray(files.images)) {
      files.images = Array(files.images);
  }
  for (let i = 0;  i < files.images.length; i++) {
    if (files.images[i].size) {
        const path = files.images[i].tempFilePath;
        const image = await cloudinary.uploader.upload(path, options);
        images = [...images, image];
    }
  }
  return images;
}
