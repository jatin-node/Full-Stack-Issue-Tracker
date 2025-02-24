import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputBox from "./InputBox";
import axios from "axios";
import ReactSelectDropdown from "./ReactSelectDropdown";
import { Toaster, toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import AnimationWrapper from "./AnimationWrapper";
import { slugify } from "../utils/slugify";

const IssueDetails = ({ selectedRoleOption, selectedCategoryOption }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ticket = queryParams.get("TICKET");
  const characterlimit = 300;
  const detailsForm = useRef();
  const { auth } = useContext(AuthContext);

  const [desc, setDesc] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [files, setFiles] = useState([]);

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/employee/subcategory`,
        { categoryId: selectedCategoryOption },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const subcategories = response.data.subCategories.map((c) => ({
        label: c.subcategoryName,
        value: c._id,
      }));
      setSubcategories(subcategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDropdownChange = (selectedOption) => {
    setSelectedSubcategory(selectedOption.value);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    const newFileNames = newFiles.map((file) => file.name);
    setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const elements = detailsForm.current.elements;
    if (!selectedSubcategory) {
      toast.error("Please select a subcategory");
      return;
    }
    if (!elements.email.value.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    if (!elements.issueTitle.value.trim()) {
      toast.error("Issue title cannot be empty");
      return;
    }
    if (!elements.issueDescription.value.trim()) {
      toast.error("Issue description cannot be empty");
      return;
    }
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 files.");
      return;
    }

    const toastId = toast.loading("Submitting issue...");
    try {
      const formData = new FormData();
      formData.append("issueTicket", ticket);
      formData.append("reportedBy", auth.user._id);
      formData.append("email", elements.email.value.trim());
      formData.append("issueTitle", elements.issueTitle.value.trim());
      formData.append(
        "issueDescription",
        elements.issueDescription.value.trim()
      );
      formData.append("role", selectedRoleOption);
      formData.append("category", selectedCategoryOption);
      formData.append("subcategory", selectedSubcategory);
      files.forEach((file) => formData.append("images", file));

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/employee/submit`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      toast.dismiss(toastId);
      toast.success("Issue submitted successfully!");
      navigate(
        `/request/${auth.user._id}/${slugify(
          elements.issueTitle.value.trim()
        )}/ticket/${ticket}`
      );

      detailsForm.current.reset();
      setDesc("");
      setFileNames([]);
      setFiles([]);
      setSelectedSubcategory("");
    } catch (error) {
      console.error("Error submitting issue:", error);
      toast.dismiss(toastId);
      toast.error("Issue submission failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedCategoryOption]);

  return (
    <AnimationWrapper className="w-full max-w-[500px]">
      <div className="w-full max-w-[500px]">
        <Toaster />
        <form
          ref={detailsForm}
          className="flex justify-center flex-col gap-5"
          onSubmit={handleSubmit}
        >
          {subcategories.length > 0 && (
            <ReactSelectDropdown
              options={subcategories}
              name="subcategory"
              placeholder="Select Subcategory"
              onChange={handleDropdownChange}
              value={subcategories.find(
                (option) => option.value === selectedSubcategory
              )}
            />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-start">Your Email Address</p>
            <InputBox
              type="text"
              name="email"
              inputClassname="pl-2 border-[1px] border-zinc-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-start">Your Issue Title</p>
            <InputBox
              type="text"
              name="issueTitle"
              inputClassname="pl-2 border-[1px] border-zinc-400"
            />
          </div>
          <div className="relative w-full">
            <p className="text-start">Your Issue Description</p>
            <textarea
              maxLength={characterlimit}
              name="issueDescription"
              className="w-full px-2 py-3 border-[1px] border-zinc-400 rounded-md h-40"
              onKeyDown={handleTitleKeyDown}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
            <p className="mt-1 text-zinc-400 text-sm text-right">
              {characterlimit - desc.length} characters left
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-start">Attachments</p>
            <div className="relative w-full h-20 border-dashed border-[3px]">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                multiple
              />
              <p className="text-center absolute inset-0 flex items-center justify-center text-zinc-400 text-sm uppercase z-0">
                add files here
              </p>
            </div>
            {fileNames.length > 0 && (
              <div className="mt-1 text-zinc-400 text-sm text-start">
                {fileNames.map((name, index) => (
                  <p key={index}> {name}</p>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-52 text-center text-white font-semibold py-2 bg-[#E4373C]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </AnimationWrapper>
  );
};

export default IssueDetails;
