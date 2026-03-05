import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage, limits: {fileSize: 2 * 1024 * 1024} }); // limit file size to 2MB

export default upload;
