import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminDeatilsBox from "../components/AdminDeatilsBox";

import Pending from "../assets/images/Pending_circle.png";
import inProgress from "../assets/images/In-Progress_circle.png";
import Resolved from "../assets/images/Resolved_circle.png";
import issueRequest from "../assets/images/Issue_Request.png";
import InPageNavigation from "../components/InPageNavigation";
import AnimationWrapper from "../components/AnimationWrapper";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests } from "../store/actions/requestsAction";
import RequestCard from "../components/RequestCard";
import NoDataMessage from "../components/NoDataMessage";

const EmployeePage = ({ type }) => {
  const { auth } = useContext(AuthContext);
  const dispatch = useDispatch();

  const allRequests = useSelector((state) => state.requestsReducer.requests);
  const filterRequestsByStatus = (requests, status) => {
    return requests.filter((request) => request.issueDetails.status === status);
  };
  const allPendingRequests = filterRequestsByStatus(allRequests, "open");
  const allInProgressRequests = filterRequestsByStatus(
    allRequests,
    "in-progress"
  );
  const allReslovedRequests = filterRequestsByStatus(allRequests, "resolved");

  useEffect(() => {
    dispatch(fetchRequests(auth.token, null, null, auth.user._id));
  }, [dispatch]);
  return (
    <AnimationWrapper>
      <div className="w-full my-24 h-full p-3 flex flex-col justify-center overflow-auto ">
        <div className="w-full flex flex-col gap-5 justify-center items-center">
          <div className="w-full flex gap-2 md:gap-5 justify-center">
            <AdminDeatilsBox
              message="Pending"
              data={allPendingRequests.length}
              image={Pending}
            />
            <AdminDeatilsBox
              message="In-Progress"
              data={allInProgressRequests.length}
              image={inProgress}
            />
            <AdminDeatilsBox
              message="Resolved"
              data={allReslovedRequests.length}
              image={Resolved}
              customClass="hidden sm:flex"
            />
          </div>

          <div className="w-full h-full max-w-[1100px] flex flex-col gap-5 items-start justify-center">
            <Link
              to={`/user/${auth.user.username}/request`}
              className="px-10 w-full min-[400px]:w-auto py-5 flex justify-start items-center gap-2 border-[1px] rounded-xl border-sky-500 bg-sky-400 hover:bg-sky-500 text-white shadow-lg"
            >
              <img className="" src={issueRequest} alt="" />
              <span className="text-nowrap font-semibold text-xl">
                Report an Issue
              </span>
            </Link>

            <InPageNavigation
              routes={["view Requests", "Resolved Requests"]}
              defaultHidden={"Resolved Requests"}
            >
              <>
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full h-[8vh] border-b-[1px] border-zinc-400 hidden md:flex items-center justify-between gap-5 ">
                    <div className="flex w-[400px] md:w-[500px] gap-12">
                      <h3 className="text-zinc-400  text-sm uppercase font-semibold">
                        Ticket
                      </h3>
                      <div className="text-zinc-400 text-sm  uppercase font-semibold">
                        Subject
                      </div>
                    </div>
                    <h3 className="uppercase text-sm  font-semibold text-zinc-400">
                      Status
                    </h3>
                    <h3 className="uppercase text-sm  font-semibold text-zinc-400">
                      Last updated
                    </h3>
                  </div>
                  {allRequests.length ? (
                    allRequests.map((request, index) => (
                      <AnimationWrapper key={index}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      >
                        <RequestCard data={request} />
                      </AnimationWrapper>
                    ))
                  ) : (
                    <NoDataMessage message="No Request made" />
                  )}
                </div>
              </>
              <div className="w-full flex flex-col gap-2">
                {allReslovedRequests.length ? (
                  allReslovedRequests.map((request, index) => (
                    <AnimationWrapper key={index}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <RequestCard data={request} />
                    </AnimationWrapper>
                  ))
                ) : (
                  <NoDataMessage message="No Resolved Request" />
                )}
              </div>
            </InPageNavigation>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default EmployeePage;
