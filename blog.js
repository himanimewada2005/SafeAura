import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, default: "Anonymous" },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  category: { type: String, required: true },
  tags: [String],
  image: { type: String, default: "" },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // optional
  comments: [commentSchema],
}, { timestamps: true });

// Use export default for ESM
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
