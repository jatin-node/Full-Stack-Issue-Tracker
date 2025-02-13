import React from "react";

const Tag = ({ tag, index, tags, setTags }) => {
  const handleTagDelete = (e) => {
    e.preventDefault();
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  return (
    <div className="w-full relative border-b-[1px] p-2 mt-2 mr-2 px-5 rounded-lg flex hover:bg-opacity-50 pr-10">
      <p className="outline-none text-wrap overflow-hidden text-ellipsis whitespace-nowrap">{tag}</p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
