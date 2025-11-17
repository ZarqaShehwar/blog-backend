const mongoose = require('mongoose');
const slugify = require('slugify');
const { trim } = require('validator');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    image: {
      type: String,
      required: [true, "Post image is required"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim:true
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true, 
  }
);

postSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true });
  next(); 
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "authorId",
    select: "name email", 
  });
  next();
});

module.exports = mongoose.model("Post", postSchema);

