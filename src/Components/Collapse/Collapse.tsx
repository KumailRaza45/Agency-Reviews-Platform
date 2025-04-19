import React, { useState, useEffect } from 'react'
import "./style.css"
const Collapse: React.FC<any> = ({ collapsed, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
	const description = isCollapsed ? children : `${children.slice(0,160)}...`;
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };
  const descriptionHandler = () => {
    setIsCollapsed(!isCollapsed)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <p
        className="lead"
      >
        {children.length ? description : children}
      </p>
      <button
        className="collapse-button text-[14px] font-semibold font-montseorrat text-[#329BFA] cursor-pointer ml-auto mt-2"
        onClick={descriptionHandler}
        style={screenWidth > 600 ? { margin: "" } : { margin: "15px auto" }}
      >
        {children.length > 160 ? `Read ${isCollapsed ? "Less" : "More"}`: ''}
      </button>
    </div>
  )
}

export default Collapse
