import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUsers } from "../store/actions/requestsAction";
import GetDay from "../components/GetDay";
import AnimationWrapper from "../components/AnimationWrapper";

const UserDetails = () => {
  const { userId } = useParams();
  console.log(userId);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.requestsReducer.users);
  console.log("getUser", users);

  useEffect(() => {
    dispatch(fetchUsers(null, null, userId)); // Fetch users when component mounts
  }, [dispatch]);
  return users ? (
    <AnimationWrapper>
      <div className="w-full my-24 flex justify-center">
        {users?.map((user, index) => {
          return (
            <div
              key={index}
              className="w-full max-w-[800px] flex flex-col justify-center items-center md:flex-row gap-5 p-5"
            >
              <div className=" w-full md:w-[30%] flex flex-col items-center gap-5 md:border-r-[1px] p-5">
                <img
                  className="w-52 object-cover rounded-full border-blue-300"
                  src={user?.personalInfo.profile_img}
                  alt="profile"
                />
                <div>
                  <h2 className="text-2xl text-center font-bold">
                    {user?.personalInfo.username}
                  </h2>
                  <p className="text-sm text-center text-zinc-400">
                    {user?.personalInfo.email}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-[70%] flex flex-col justify-center gap-5 p-5">
                <h2 className="uppercase font-semibold text-sm text-zinc-600">
                  About User
                </h2>
                <div className="flex flex-col gap-1">
                  <p className=" text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">
                      Fullname :{" "}
                    </span>
                    {user?.personalInfo.fullname}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">
                      Contact number :{" "}
                    </span>
                    {user?.personalInfo.phone}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">Address : </span>
                    {user?.address.completeAddress}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">state : </span>
                    {user?.address.state}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">City : </span>
                    {user?.address.city}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">
                      Zip Code :{" "}
                    </span>
                    {user?.address.zip}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">
                      Quarter Number :{" "}
                    </span>
                    {user?.address.quarterNumber}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">Street : </span>
                    {user?.address.street}
                  </p>
                  <p className="text-zinc-400">
                    {" "}
                    <span className="text-black font-semibold">
                      Account Created :{" "}
                    </span>
                    {GetDay(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AnimationWrapper>
  ) : (
    <div>Loading...</div>
  );
};

export default UserDetails;
