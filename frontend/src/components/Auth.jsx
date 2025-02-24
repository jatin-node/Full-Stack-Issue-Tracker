import React, { useContext, useRef, useState } from "react";
import InputBox from "./InputBox";
import { Link, useNavigate } from "react-router-dom";
import ReactSelectDropdown from "./ReactSelectDropdown";
import { emailRegex, passwordRegex } from "../utils/validation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import AnimationWrapper from "./AnimationWrapper";

const Auth = ({ type }) => {
  const characterlimit = 200;
  const navigate = useNavigate();
  const [islock1, setislock1] = useState(true);
  const [islock2, setislock2] = useState(true);

  const registerForm = useRef();
  const registerDetailsForm = useRef();
  const logInForm = useRef();

  const [desc, setDesc] = useState("");
  const [formData, setFormData] = useState({});
  const [selectedRole, setSelectedRole] = useState(null); // Add state for selected role

  const { setAuth } = useContext(AuthContext);

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const serverConnect = async (endpoint, formData) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + endpoint,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { token, user } = response.data;
      setAuth({ token, user });
      localStorage.setItem("user", JSON.stringify(user));
      if (user && user._id) {
        navigate(`/user/${user.username}`);
      } else {
        throw new Error("User ID is missing");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || error.message);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const data = {
      fullname: registerForm.current.elements.fullname.value,
      email: registerForm.current.elements.email.value,
      password: registerForm.current.elements.password.value,
      confirmPassword: registerForm.current.elements.confirmPassword.value,
    };
    if (!data.email) {
      return toast.error("Enter email");
    }
    if (!data.password) {
      return toast.error("Enter password");
    }
    if (type && !data.fullname) {
      return toast.error("Enter Full Name");
    }

    if (!emailRegex.test(data.email)) {
      return toast.error("Invalid email format");
    }
    if (
      !passwordRegex.test(data.password) &&
      !passwordRegex.test(data.confirmPassword)
    ) {
      return toast.error(
        "Password must be 7-20 chars, with upper, lower, digit, and special character"
      );
    }
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setFormData(data);
    navigate("/details");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "details") {
      const elements = registerDetailsForm.current.elements;
      const additionalData = {
        role: selectedRole ? selectedRole.value : null, // Include selected role
        employeeId: elements.employeeId.value,
        quarterNumber: elements.quarterNumber.value,
        phone: elements.phone.value,
        street: elements.street.value,
        city: elements.city.value,
        state: elements.state.value,
        zip: elements.zip.value,
        completeAddress: elements.completeAddress.value,
      };

      // Validation for empty fields
      if (!additionalData.employeeId) return toast.error("Enter Employee ID");
      if (!additionalData.quarterNumber)
        return toast.error("Enter Quarter Number");
      if (!additionalData.phone) return toast.error("Enter Phone Number");
      if (!additionalData.street) return toast.error("Enter Street");
      if (!additionalData.city) return toast.error("Enter City");
      if (!additionalData.state) return toast.error("Enter State");
      if (!additionalData.zip) return toast.error("Enter Zip Code");
      if (!additionalData.completeAddress)
        return toast.error("Enter Complete Address");

      const completeFormData = { ...formData, ...additionalData };
      serverConnect("/sign-in", completeFormData);
    }
    if (type === "log-in") {
      const elements = logInForm.current.elements;
      const formData = {
        email: elements.email.value,
        password: elements.password.value,
      };

      if (!formData.email) {
        return toast.error("Enter email");
      }
      if (!formData.password) {
        return toast.error("Enter password");
      }
      if (!emailRegex.test(formData.email)) {
        return toast.error("Invalid email format");
      }

      serverConnect("/log-in", formData);
    }
  };

  const options = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];

  const renderSignInForm = () => (
    <>
      <InputBox
        type="text"
        name="fullname"
        placeholder="Your Name"
        className="fi fi-sr-user"
      />
      <InputBox
        type="email"
        name="email"
        placeholder="Your Email"
        className="fi fi-sr-envelope"
      />
      <div className="relative w-full">
        <InputBox
          type={`${islock1 ? "password" : "text"}`}
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          className="fi fi-sr-lock"
        />
        <i
          onClick={() => setislock1(!islock1)}
          className={`absolute top-3 right-2 cursor-pointer ${
            islock1 ? "fi fi-br-eye-crossed" : "fi fi-br-eye"
          }`}
        ></i>
      </div>
      <div className="relative w-full">
        <InputBox
          type={`${islock2 ? "password" : "text"}`}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm Password"
          className="fi fi-rr-lock"
        />
        <i
          onClick={() => setislock2(!islock2)}
          className={`absolute top-3 right-2 cursor-pointer ${
            islock2 ? "fi fi-br-eye-crossed" : "fi fi-br-eye"
          }`}
        ></i>
      </div>
      <Link
        to="/details"
        onClick={handleContinue}
        className="px-10 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl"
      >
        Continue
      </Link>
      <div className="flex items-center justify-center w-full gap-2 uppercase opacity-25">
        <hr className="w-1/2 border-black" />
        <p>or</p>
        <hr className="w-1/2 border-black" />
      </div>
      <div>
        Don't have an account&nbsp;
        <Link to="/log-in" className="text-sky-600 underline ">
          log In
        </Link>
      </div>
    </>
  );

  const renderDetailsForm = () => (
    <>
      <ReactSelectDropdown
        options={options}
        name="role"
        placeholder="Select Role"
        onChange={(selectedOption) => setSelectedRole(selectedOption)}
      />
      <InputBox
        type="text"
        name="employeeId"
        placeholder="Employee Id"
        className="fi fi-rr-id-badge"
      />
      <div className="flex gap-2">
        <InputBox
          type="text"
          name="quarterNumber"
          placeholder="Quarter Number"
          className="fi fi-rr-home"
        />
        <InputBox
          type="text"
          name="phone"
          placeholder="Phone no."
          className="fi fi-rr-phone-call"
        />
      </div>

      <div className="flex gap-2">
        <InputBox
          type="text"
          name="street"
          placeholder="Street"
          className="fi fi-rr-road"
        />
        <InputBox
          type="text"
          name="city"
          placeholder="City"
          className="fi fi-rr-building"
        />
      </div>

      <div className="flex gap-2">
        <InputBox
          type="text"
          name="state"
          placeholder="State"
          className="fi fi-rr-map"
        />
        <InputBox
          type="text"
          name="zip"
          placeholder="Zip Code"
          className="fi fi-rr-marker"
        />
      </div>

      <div className="relative w-full">
        <textarea
          maxLength={characterlimit}
          placeholder="Address"
          name="completeAddress"
          className="w-full px-10 py-3 border rounded-md h-24"
          onKeyDown={handleTitleKeyDown}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>
        <p className="mt-1 text-zinc-400 text-sm text-right">
          {characterlimit - desc.length} characters left
        </p>
        <i className="absolute left-4 top-4 fi fi-rr-address-book"></i>
      </div>
      <Link
        to="/"
        onClick={handleSubmit}
        className="px-10 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl"
      >
        Sign-up
      </Link>
    </>
  );

  const renderLogInForm = () => (
    <>
      <InputBox
        type="email"
        name="email"
        placeholder="Your Email"
        className="fi fi-sr-envelope"
      />
      <div className="relative w-full">
        <InputBox
          type={`${islock1 ? "password" : "text"}`}
          name="password"
          placeholder="Password"
          className="fi fi-sr-lock"
        />
        <i
          onClick={() => setislock1(!islock1)}
          className={`absolute top-3 right-2 cursor-pointer ${
            islock1 ? "fi fi-br-eye-crossed" : "fi fi-br-eye"
          }`}
        ></i>
      </div>
      <Link
        to="/"
        onClick={handleSubmit}
        className="px-10 py-3 mt-10 bg-sky-500 hover:bg-sky-600 text-white rounded-xl"
      >
        Log in
      </Link>
      <div className="flex items-center justify-center w-full gap-2 uppercase opacity-25">
        <hr className="w-1/2 border-black" />
        <p>or</p>
        <hr className="w-1/2 border-black" />
      </div>
      <div>
        Don't have an account&nbsp;
        <Link to="/" className="text-sky-600 underline ">
          Sign In
        </Link>
      </div>
    </>
  );

  return (
    <AnimationWrapper type={type}>
      <section className="w-full mt-24 h-[calc(100vh-100px)] overflow-auto flex justify-center items-center relative bg-white md:bg-[#F8F8F8]">
          <div className="w-[95%] absolute top-20 max-w-[500px] rounded-2xl bg-white md:shadow-lg p-5 md:p-10 -mt-10">
            <h1
              className={` ${type === "details" ? "hidden" : "text-4xl"} capitalize font-bold`}
            >
              {type === "sign-in"
                ? "Sign Up"
                : type === "details"
                ? "Sign Up"
                : "Log In"}
            </h1>
            <Toaster />
            <form
              ref={
                type === "sign-in"
                  ? registerForm
                  : type === "log-in"
                  ? logInForm
                  : registerDetailsForm
              }
              className="py-10 flex items-start flex-col gap-5"
            >
              {type === "sign-in" && renderSignInForm()}
              {type === "details" && renderDetailsForm()}
              {type === "log-in" && renderLogInForm()}
            </form>
          </div>
      </section>
    </AnimationWrapper>
  );
};

export default Auth;
