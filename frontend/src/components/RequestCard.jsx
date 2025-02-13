import React, { useContext } from "react";
import { Link } from "react-router-dom";
import LastUpdated from "./LastUpdated";
import AnimationWrapper from "./AnimationWrapper";
import { slugify } from "../utils/slugify";
import { AuthContext } from "../context/AuthContext";

const RequestCard = ({ data }) => {
  const { auth } = useContext(AuthContext);
  const title = data.issueDetails.issueTitle;
  const slugifiedTitle = slugify(title);
  return (
    <>
      <AnimationWrapper duration>
        <Link
          to={`/request/${auth.user._id}/${slugifiedTitle}/ticket/${data.issueTicket}`}
          className="w-full hover:bg-zinc-100"
        >
          <div className="w-full text-zinc-600 md:text-black h-[20vh] p-5 md:p-0 md:h-[5vh] border-[1px] md:border-0 md:border-b-[1px] border-zinc-400 md:flex items-center justify-between">
            <div className="md:flex w-full md:w-[500px] gap-5">
              <div>
                <span className="text-lg md:text-sm flex gap-2 font-semibold">
                  <h3 className="text-black block md:hidden">Ticket :</h3>
                  {data.issueTicket}
                </span>
              </div>
              <div>
                <h2 className="w-full text-red-500 font-serif leading-7 text-md md:text-sm line-clamp-2 md:line-clamp-1">
                  {data.issueDetails.issueTitle}
                </h2>
              </div>
            </div>
            <div>
              <div className="flex gap-2 md:flex-col">
                <h3 className="text-black block md:hidden font-semibold">
                  Status :
                </h3>
                <span className="font-semibold">
                  {data.issueDetails.status}
                </span>
              </div>
            </div>
            <div>
              <div className="flex gap-2 md:flex-col text-nowrap">
                <h3 className="text-black block md:hidden font-semibold">
                  Last Updated :
                </h3>
                <LastUpdated dateString={data.updatedAt} />
              </div>
            </div>
          </div>
        </Link>
      </AnimationWrapper>
    </>
  );
};

export default RequestCard;
