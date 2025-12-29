import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./schema/blog.js";
import defaultBlogs from "./config/defaultBlog.js";

dotenv.config();

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected");

    // 1️⃣ Clear old blogs
    await Blog.deleteMany();
    console.log("🗑️ Old blogs deleted");

    // 2️⃣ Insert new blogs
    for (const category of Object.keys(defaultBlogs)) {
      for (const blog of defaultBlogs[category]) {
        await Blog.create({ ...blog, category });
      }
    }

    console.log("🌱 Default blogs seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedBlogs();
