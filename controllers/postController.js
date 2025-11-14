
const { CreateAsync } = require("../utils/CreateAsync");
const AppError = require("../utils/AppError");
const sharp = require("sharp");
const { uploadToCloudinary } = require("../utils/uploadCloudinar");
const Post = require("../models/postModel");
const ApiFeatures = require("../utils/ApiFeatures");

exports.resizeImage = CreateAsync(async (req, res, next) => {

  if (!req.file) return next();

  if (req.file) {
    const processedBuffer = await sharp(req.file.buffer)
      .resize(2000, 1300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();
    const uploadResult = await uploadToCloudinary(processedBuffer, "products/cover");
    req.body.image = uploadResult.secure_url;
  }


  
  next();
});
exports.createPost = CreateAsync(async (req,res,next)=>{
  const payload = req.body;
  console.log(payload);
  
 const post =  await Post.create({
  title:payload.title,
  content:payload.content,
  authorId:req.user._id,
  image:payload.image
 });
 res.status(201).json({
  status:"success",
  message:"Post created Successfully",
  data:{
    post
  }
 })
})
exports.getAllBlogs = CreateAsync(async (req, res, next) => {

  const query = Post.find();
  const totalPosts = await Post.countDocuments();
  const newQuery = new ApiFeatures(query,req.query).filter().pagination().sort();
  const post = await newQuery.query;

  res.status(200).json({
    status: "success",
    results: post.length,
    totalPages : totalPosts,
    data: { post },
  });
});

exports.getPostBySlug = CreateAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const post = await Post.find({ slug });
  if (!post) {
    return next(new AppError('Blog not found', 404))
  }
  res.status(200).json({
    status: "success",
    data: { post },
  });
});


exports.getPostByUser = CreateAsync(async (req,res)=>{
  const queryString  = req.query ; 
 const query =  Post.find({
  authorId:req.user._id
 });
  const newQuery = new ApiFeatures(query,queryString).pagination().sort();
  const post = await newQuery.query;
  res.status(200).json({
    status:"success",
    data:{
      post
    }
  })
})


exports.updatePost = CreateAsync(async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(req.body,"Post is theree");
  

  if (!post) {
    return next(new AppError('Blog not found', 404))

  }

  res.status(200).json({
    status: "success",
    message: "Blog updated successfully",
    data: { post },
  });
});

exports.deletePost = CreateAsync(async (req, res, next) => {
  const { ids } = req.body;

  if (!ids || !ids.length) {
    return next(new AppError("No blog IDs provided", 400));
  }

  const existingBlogs = await Post.find({ _id: { $in: ids } });
  if (!existingBlogs.length) {
    return next(new AppError("No blogs found with these IDs", 404));
  }

  await Post.deleteMany({ _id: { $in: existingBlogs.map(b => b._id) } });

  res.status(200).json({
    status: "success",
    message: "Blog(s) deleted successfully",
  });
});

