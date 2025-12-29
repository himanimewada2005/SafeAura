// pages/Home.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/BlogNavbar";
import BlogCard from "../components/BlogCard";
import API from "../services/api"; // make sure this points to your API instance

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch all blogs on mount
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/blogs"); // adjust endpoint if needed
      setBlogs(res.data);
      setFilteredBlogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle category selection
  const handleCategorySelect = (cat) => {
    setCategory(cat);
    if (cat === "All") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((b) => b.category === cat);
      setFilteredBlogs(filtered);
    }
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      // if search is empty, reset to current category
      handleCategorySelect(category);
    } else {
      const filtered = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Navbar */}
      <Navbar
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        currentCategory={category}
      />

      {/* Blogs */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  mt-8 sm:mt-10">
        {loading ? (
          <p className="text-white col-span-full text-center">Loading...</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-white col-span-full text-center">No blogs found</p>
        ) : (
          filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))
        )}
      </div>
    </div>
  );
}

