import axios from "axios";
import React, { useState, useEffect, useRef, useContext } from "react";
import InputBox from "../components/InputBox";
import { toast, Toaster } from "react-hot-toast";
import { passwordRegex } from "../utils/validation";
import { signOut } from "../utils/signOut.js";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useParams();
  const { auth, setAuth } = useContext(AuthContext);

  const [edit, setEdit] = useState(false);
  const [passwordEdit, setpasswordEdit] = useState(false);
  const [userDetails, setUserDetails] = useState({
    personalInfo: {
      fullname: "",
      email: "",
      password: "",
      username: "",
      phone: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      completeAddress: "",
      quarterNumber: "",
    },
    employeeId: "",
  });

  const passwordForm = useRef();

  const fetchUserDetails = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/get/user/details",
        {username: user},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUserDetails(response.data); // Set the fetched user details
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in userDetails.personalInfo) {
      setUserDetails({
        ...userDetails,
        personalInfo: { ...userDetails.personalInfo, [name]: value },
      });
    } else if (name in userDetails.address) {
      setUserDetails({
        ...userDetails,
        address: { ...userDetails.address, [name]: value },
      });
    } else {
      // This ensures `employeeId` is updated properly
      setUserDetails({
        ...userDetails,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/update/user/details",
        userDetails,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Account details updated successfully!");
      setEdit(false); // Disable editing after submit
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || error.message);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    try {
      const elements = passwordForm.current.elements;
      const formData = {
        password: elements.password.value,
        confirmPassword: elements.confirmPassword.value,
      };
      if (
        !passwordRegex.test(formData.password) &&
        !passwordRegex.test(formData.confirmPassword)
      ) {
        return toast.error(
          "Password must be 7-20 chars, with upper, lower, digit, and special character"
        );
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
      }
      axios.post(
        import.meta.env.VITE_BACKEND_URL + "/update/password",
        { username: user, password: formData.password },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Password updated successfully!");
      setEdit(false); // Disable editing after submit
      setpasswordEdit(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || error.message);
    }
  };

  const handleProfileImageUpload = async () => {
    const loader = toast.loading("Updating profile image...");
    try {
      const fileInput = document.getElementById("profileImage");
      if (!fileInput.files[0]) {
        toast.error("Please select an image!");
        return;
      }

      const formData = new FormData();
      formData.append("image", fileInput.files[0]);

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/update/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.dismiss(loader);
      toast.success("Profile image updated successfully!");

      const newImageUrl = response.data.imageUrl;
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: { ...prevAuth.user, profile_img: newImageUrl },
      }));

      fileInput.value = "";
    } catch (error) {
      toast.dismiss(loader);
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [user]);

  return userDetails ? (
    <div className="w-full my-24 flex flex-col items-center gap-10 p-5">
      <div className="w-full max-w-[800px] flex items-start flex-col gap-5">
        <Toaster />

        <div className="relative w-full max-w-[800px] h-full flex flex-col gap-5">
          <div className="text-xl md:text-2xl font-semibold border-[1px] w-full p-5 bg-zinc-100 text-black rounded-xl flex flex-col items-center">
            <label
              htmlFor="profileImage"
              className="cursor-pointer text-red-500 flex items-center gap-2"
            >
              <i className="mt-1 fi fi-sr-file-edit"></i>
              <span>Upload Profile Image</span>
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageUpload}
            />
          </div>
        </div>

        <form
          className="relative w-full max-w-[800px] h-full flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div
            className={`${
              edit ? "cursor-pointer" : "cursor-not-allowed"
            } text-xl md:text-5xl font-bold border-[1px] w-full p-5 bg-black text-white rounded-xl`}
          >
            Account Information
          </div>
          <hr className="bg-black w-full border-[1px] border-zinc-400" />
          <div className="w-full h-full shadow-lg border-[1px] border-zinc-400 p-5 flex flex-col gap-5">
            <h2 className="text-xl text-nowrap md:text-4xl font-bold">
              Personal Information
            </h2>
            <div className="relative">
              <InputBox
                type="text"
                name="username"
                placeholder="Your username"
                value={userDetails.personalInfo.username || ""}
                onChange={handleChange}
                inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                  !edit && "cursor-not-allowed"
                }`}
                disabled={!edit}
              />
              <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                Username
              </label>
            </div>

            <div className="w-full gap-5 flex flex-col sm:flex-row justify-between">
              <div className="w-full relative">
                <InputBox
                  type="text"
                  name="email"
                  placeholder="email"
                  value={userDetails.personalInfo.email || ""}
                  onChange={handleChange}
                  inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                    !edit && "cursor-not-allowed"
                  }`}
                  disabled={!edit}
                />
                <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                  Email
                </label>
              </div>
              <div className={`w-full relative ${auth.user.role === "admin" ? "block" : "hidden"}`}>
                <InputBox
                  type="text"
                  name="employeeId"
                  placeholder="Employee Id"
                  value={userDetails.employeeId || ""}
                  onChange={handleChange}
                  inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                    !edit && "cursor-not-allowed"
                  }`}
                  disabled={!edit}
                />
                <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                  Employee Id
                </label>
              </div>
            </div>

            <div className="relative">
              <InputBox
                type="text"
                name="phone"
                placeholder="Your Phone"
                value={userDetails.personalInfo.phone || ""}
                onChange={handleChange}
                inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                  !edit && "cursor-not-allowed"
                }`}
                disabled={!edit}
              />
              <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                Phone
              </label>
            </div>

            <h2 className="text-xl text-nowrap md:text-4xl font-bold">
              Address Information
            </h2>
            <div className="relative">
              <InputBox
                type="text"
                name="street"
                placeholder="Street"
                value={userDetails.address.street || ""}
                onChange={handleChange}
                inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                  !edit && "cursor-not-allowed"
                }`}
                disabled={!edit}
              />
              <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                Street
              </label>
            </div>

            <div className="w-full gap-5 flex flex-col sm:flex-row justify-between">
              <div className="w-full relative">
                <InputBox
                  type="text"
                  name="city"
                  placeholder="City"
                  value={userDetails.address.city || ""}
                  onChange={handleChange}
                  inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                    !edit && "cursor-not-allowed"
                  }`}
                  disabled={!edit}
                />
                <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                  City
                </label>
              </div>
              <div className="w-full relative">
                <InputBox
                  type="text"
                  name="state"
                  placeholder="State"
                  value={userDetails.address.state || ""}
                  onChange={handleChange}
                  inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                    !edit && "cursor-not-allowed"
                  }`}
                  disabled={!edit}
                />
                <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                  State
                </label>
              </div>
            </div>

            <div className="w-full gap-5 flex flex-col sm:flex-row justify-between">
              <div className="w-full relative">
                <InputBox
                  type="text"
                  name="zip"
                  placeholder="Zip"
                  value={userDetails.address.zip || ""}
                  onChange={handleChange}
                  inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                    !edit && "cursor-not-allowed"
                  }`}
                  disabled={!edit}
                />
                <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                  Zip
                </label>
              </div>
              <div className="w-full relative">
                <InputBox
                  type="text"
                  name="quarterNumber"
                  placeholder="Quarter Number"
                  value={userDetails.address.quarterNumber || ""}
                  onChange={handleChange}
                  inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                    !edit && "cursor-not-allowed"
                  }`}
                  disabled={!edit}
                />
                <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                  Quarter Number
                </label>
              </div>
            </div>

            <div className="w-full relative">
              <InputBox
                type="text"
                name="completeAddress"
                placeholder="Complete Address"
                value={userDetails.address.completeAddress || ""}
                onChange={handleChange}
                inputClassname={`pl-4 pr-4 pt-5 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-md md:text-xl font-semibold ${
                  !edit && "cursor-not-allowed"
                }`}
                disabled={!edit}
              />
              <label className="absolute text-xs md:text-md top-[-8px] md:top-[-10px] z-10 bg-white left-4 font-bold uppercase text-zinc-700 ">
                Complete Address
              </label>
            </div>
            {/* </div> */}
            {/* Edit Button */}
            {!edit && (
              <div
                onClick={() => setEdit(true)}
                className="absolute top-24 md:top-28 left-2 p-2 bg-white text-blue-500 font-semibold capitalize cursor-pointer"
              >
                Edit Details
              </div>
            )}

            {edit && (
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 font-semibold capitalize">
                Save Changes
              </button>
            )}
          </div>

          <hr className="bg-black w-full border-[1px] border-zinc-400" />
        </form>

        <form
          ref={passwordForm}
          onSubmit={handlePasswordChange}
          className="relative w-full max-w-[800px] h-full flex items-start flex-col gap-5"
        >
          <div className="w-full h-full shadow-lg border-[1px] border-zinc-400 p-5 flex flex-col gap-5">
            <h2
              className={` ${
                passwordEdit ? "cursor-pointer" : "cursor-not-allowed"
              } text-xl text-nowrap md:text-4xl font-bold`}
            >
              Change Password
            </h2>

            <InputBox
              type="text"
              name="password"
              placeholder="New Password"
              value={""}
              autoComplete={"new-password"}
              onChange={handleChange}
              inputClassname={`pl-4 pr-4 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-text-md md:xl font-semibold ${
                !passwordEdit && "cursor-not-allowed"
              }`}
              disabled={!passwordEdit}
            />
            <InputBox
              type="text"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={""}
              autoComplete={"new-password"}
              onChange={handleChange}
              inputClassname={`pl-4 pr-4 border-[1px] border-zinc-400 bg-white rounded-md focus:bg-zinc-100 text-text-md md:xl font-semibold ${
                !passwordEdit && "cursor-not-allowed"
              }`}
              disabled={!passwordEdit}
            />

            {!passwordEdit && (
              <div
                onClick={() => setpasswordEdit(true)}
                className="absolute -top-3 left-2  bg-white text-blue-500 font-semibold capitalize cursor-pointer"
              >
                Change password
              </div>
            )}

            {passwordEdit && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 font-semibold capitalize"
              >
                Save New Password
              </button>
            )}
          </div>
        </form>

        <div className={`w-full h-full shadow-lg border-[1px] border-zinc-400 p-5 flex flex-col items-start gap-5 ${auth.user.role === "admin" ? "hidden" : "block"}`}>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 font-semibold capitalize"
            onClick={() => signOut(setAuth, navigate)}
          >
            Sign-out
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Account;
