import React from "react";

const AdminDeatilsBox = ({ data, message, customClass, image }) => {
  return (
    <div className={`${customClass} w-[80%] md:max-w-[350px]  bg-white shadow-md border-[1px] border-zinc-200 rounded-xl flex flex-col sm:gap-2 p-2 py-5 md:p-5`}>
      <h1 className="text-lg md:text-2xl flex items-center justify-start gap-2 text-nowrap font-semibold text-zinc-50t0">
        <img src={image} alt="" />
        {message}
      </h1>
      <p className="ml-8 text-lg md:text-2xl font-semibold text-zinc-500">{data}</p>
    </div>
  );
};

export default AdminDeatilsBox;