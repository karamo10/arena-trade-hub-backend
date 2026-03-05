import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadToCloudinary = (fileBuffer, folder = 'arena_uploads') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error('No file buffer provided'));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 500, crop: 'limit' },
          { quality: 'auto'},
          { fetch_format: 'auto' }
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default uploadToCloudinary;
