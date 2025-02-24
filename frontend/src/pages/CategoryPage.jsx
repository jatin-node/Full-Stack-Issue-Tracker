import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import InputBox from "../components/InputBox";
import Tag from "../components/Tag";
import banner from "../assets/images/Banner.png";
import { Toaster, toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const CategoryPage = () => {
  const { auth } = useContext(AuthContext);
  const categoryForm = useRef();
  const [tags, setTags] = useState([]);
  const [role, setRole] = useState("");
  const tagsLimit = 10;

  const handleKeyDown = (e) => {
    if ((e.keyCode === 13 || e.keyCode === 188) && e.target.value.trim()) {
      e.preventDefault();
      if (tags.length < tagsLimit) {
        setTags([...tags, e.target.value.trim()]);
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      categoryName: categoryForm.current.elements.categoryName.value,
      tags: tags,
      role: role,
    };
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/admin/create-category",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form and tags state after successful submission
      categoryForm.current.reset();
      setTags([]);
      setRole(""); // Reset role after submission
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="flex my-24 flex-col justify-center items-center">
      <div
        className="w-full h-[20vh] md:h-[30vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="w-full h-full bg-zinc-400 opacity-30"></div>
      </div>
      <Toaster />
      <form
        ref={categoryForm}
        className="w-[95%] max-w-[500px] flex flex-col gap-5 py-5 overflow-hidden"
        onSubmit={handleSubmit}
      >
        <h1 className="w-full text-3xl font-bold px-2 py-2 border-[1px] text-zinc-600 shadow-md rounded-xl font-sans">
          Create Category
        </h1>
        {/* New Dropdown for Role Selection */}
        <div>
          <p className="text-zinc-800 mb-2">Select Role</p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border-[1px] border-zinc-200 rounded-md pl-2 w-full py-2"
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="HR">HR</option>
          </select>
        </div>
        <div>
          <p className="text-zinc-800 mb-2">Category Name</p>
          <InputBox
            type="text"
            name="categoryName"
            placeholder="Enter Category Name"
            inputClassname="border-[1px] border-zinc-200 rounded-md pl-2 "
          />
        </div>

        <div>
          <p className="text-zinc-800 mb-2">Sub-Categories-</p>
          <div className="relative px-2 py-2 pb-4 bg-zinc-100 rounded-md w-full ">
            <input
              type="text"
              name="subCategoryName"
              placeholder="Write here..."
              className="sticky top-0 left-0 border-2 w-full outline-none rounded-md px-5 py-2"
              onKeyDown={handleKeyDown}
              disabled={tags.length >= tagsLimit} // Disable input when tags limit is reached
            />
            <p className="mt-1 text-zinc-400 text-right">
              {tagsLimit - tags.length} tags left
            </p>
          </div>
          {tags.map((tag, index) => (
            <Tag
              key={index}
              tag={tag}
              index={index}
              tags={tags}
              setTags={setTags}
            />
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white rounded-md px-4 py-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CategoryPage;
