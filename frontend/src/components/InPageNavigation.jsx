import React, { useEffect, useRef, useState } from "react";
export let activeTabRef;
export let activeTabLineRef;

const InPageNavigation = ({
  routes,
  defaultHidden,
  defaultActiveIndex = 0,
  children,
}) => {
  activeTabRef = useRef();
  activeTabLineRef = useRef();
  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, index) => {
    let { offsetLeft, offsetWidth } = btn;
    activeTabLineRef.current.style.left = offsetLeft + "px";
    activeTabLineRef.current.style.width = offsetWidth + "px";
    setInPageNavIndex(index);
  };
  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveIndex);
  }, [defaultActiveIndex]);
  return (
    <>
      <div className="relative bg-white border-b border-zinc-200 flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
              ref={i === defaultActiveIndex ? activeTabRef : null}
              key={i}
              className={
                "p-4 px-5 capitalize " +
                (inPageNavIndex === i ? "text-black " : "text-zinc-400 ") +
                (defaultHidden?.includes(route) ? "md:hidden " : "")
              }
              onClick={(e) => {
                changePageState(e.target, i);
              }}
            >
              {route}
            </button>
          );
        })}
        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 border-black duration-300"
        />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
