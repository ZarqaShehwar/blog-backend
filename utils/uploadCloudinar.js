const cloudinary = require("../config/cloudinary");
const multer   = require("multer")




// const uploadPath = path.join(__dirname, "../public/img/product");
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure directory exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `product-${req.body.title}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// File filter to allow only images


const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload  = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})
exports.uploadProductImages = upload.single("image");
exports.uploadToCloudinary = async (buffer, folder = "blogs/images") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};
