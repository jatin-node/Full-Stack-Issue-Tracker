import React, { useContext, useEffect, useState } from "react";
import banner from "../assets/images/Banner.png";
import Dropdown from "../components/Dropdown";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import IssueDetails from "../components/IssueDetails";
import AnimationWrapper from "../components/AnimationWrapper";

const EmployeeRequestPage = ({ type }) => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [selectedRoleOption, setSelectedRoleOption] = useState("");
  const [selectedCategoryOption, setSelectedCategoryOption] = useState("");
  const [role, setRole] = useState([]);
  const [category, setCategory] = useState([]);
  const [firstDropdownSelected, setFirstDropdownSelected] = useState(false);

  const generateTicket = () => uuidv4().replace(/\D/g, "").slice(0, 10);

  const fetchData = async (url, setState, payload = {}) => {
    try {
      const response = await axios.post(url, payload);
      setState(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  const fetchRoles = () =>
    fetchData(`${import.meta.env.VITE_BACKEND_URL}/employee/role`, (data) =>
      setRole(data.role)
    );

  const fetchCategories = () =>
    fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/employee/category`,
      (data) => setCategory(data.categories),
      { roleId: selectedRoleOption }
    );

  const handleDropdownChange = (value, setState, data, key) => {
    const selectedItem = data.find((item) => item[key] === value);
    if (selectedItem) {
      setState(selectedItem._id);
      return selectedItem;
    }
  };

  const handleFirstDropdownChange = (value) => {
    setFirstDropdownSelected(true);
    handleDropdownChange(value, setSelectedRoleOption, role, "roleName");
  };

  const handleCategoryDropdownChange = (value) => {
    const selectedCategory = handleDropdownChange(
      value,
      setSelectedCategoryOption,
      category,
      "categoryName"
    );
    if (selectedCategory) {
      const ticket = generateTicket();
      navigate(
        `/user/${auth.user.username}/request/${selectedCategory.categoryName}/${selectedCategory._id}?TICKET=${ticket}`
      );
    }
    setFirstDropdownSelected(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRoleOption) {
      fetchCategories();
    }
  }, [selectedRoleOption]);

  return role.length ? (
    <AnimationWrapper type={type}>
      <div className="w-full my-24 h-[calc(100vh-100px)] overflow-hidden relative flex flex-col items-center justify-start text-center gap-5 overflow-y-auto">
        {type && (
          <div
            className="w-full h-[25vh] max-h-[300px] bg-cover bg-center"
            style={{ backgroundImage: `url(${banner})` }}
          >
            <div className="w-full h-full bg-zinc-400 opacity-30"></div>
          </div>
        )}
        <div
          className={`flex flex-col items-center justify-center gap-5 px-5 ${
            type ? "py-0" : "py-10"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold capitalize text-nowrap">
            Submit a Request
          </h1>
          <div className="flex flex-col">
            <span className="text-sm md:text-xl text-nowrap text-zinc-700">
              Something not working as expected?
            </span>
            <span className="text-sm md:text-xl text-zinc-700">
              Let us know by submitting a request. We'll get it resolved as soon
              as possible!
            </span>
          </div>
          <hr className="w-full max-w-[800px] border-[1px] border-zinc-200" />
          {type ? (
            <>
              <Dropdown
                message={"Select an option"}
                options={role.map((role) => role.roleName)}
                onChange={handleFirstDropdownChange}
              />
              {firstDropdownSelected && (
                <Dropdown
                  message={"Select an option"}
                  options={category.map((category) => category.categoryName)}
                  onChange={handleCategoryDropdownChange}
                />
              )}
            </>
          ) : (
            <IssueDetails
              selectedRoleOption={selectedRoleOption}
              selectedCategoryOption={selectedCategoryOption}
            />
          )}
        </div>
      </div>
    </AnimationWrapper>
  ) : (
    <h1>Loading...</h1>
  );
};

export default EmployeeRequestPage;
