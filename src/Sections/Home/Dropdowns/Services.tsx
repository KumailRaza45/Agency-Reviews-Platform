import React, { useRef, useEffect, useState } from "react";
import arrowUp from "../../../assets/Icons/ArrowUp.svg";
import arrowDown from "../../../assets/Icons/ArrowDownWhite.svg";

import Check from "../../../assets/Icons/Checked.svg";
import { ServicesData } from "../../../Utilities/utilities";

const Services = ({
  services,
  setServices,
  setMoreFilter,
  setSort,
  selectedCheckboxes,
  handleCheckboxChange,
  clearSelectedFilter,
  handleSubmit,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !isButtonClick(event)
    ) {
      setServices(false);
    }
  };
  const isButtonClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    return !!target?.closest(".button");
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 " style={screenWidth > 600 ? {} : { position: "absolute", left: "0" }}>
      <button
        className={`button z-10 grid grid-cols-[auto_auto] items-center px-4 py-[10px] gap-2 rounded-lg border border-grayBorder ${services ? "bg-[#3364F7]" : "bg-whiteColor"
          } `}
        style={{ maxHeight: "42px", position: "relative" }}
        onClick={() => {
          setServices(!services);
          setMoreFilter(false);
          setSort(false);
        }}
      >
        {screenWidth < 928 && (
          <span
            className="absolute top-[-16px] right-[-5px]  bg-[#3364F7] text-[#fff] font-montserrat text-xs w-6 h-6 flex items-center justify-center rounded-full"
            style={{}}
          >
            {selectedCheckboxes.length}
          </span>
        )}
        <span
          className={`${services ? "text-[#fff]" : "text-gray700"
            } font-montserrat text-sm not-italic font-semibold`}
        >
          Services
        </span>

        <img
          src={services ? arrowDown : arrowUp}
          alt="Arrow up"
          className="w-5"
        />
      </button>
      {services && (
        <div
          ref={dropdownRef}
          className={`w-full absolute top-12 z-20  ${screenWidth > 600 ? "max-w-[774px] right-0" : "max-w-[328px] left-0 "}  rounded-lg border border-gray200 bg-whiteColor`}
          role="menu"
          aria-orientation="vertical"
          style={{ width: screenWidth > 600 ? "100%" : "calc(100vw - 40px)" }}
        >
          <div className="grid gap-x-5 gap-y-2 p-2 justify-items-center md:justify-items-start md:grid-cols-4 mobile:grid-cols-2">
            {ServicesData.map((item, index) => {
              return (
                <>
                  <div key={index} className="col-span-1 w-full">
                    <div className="hover:bg-[#F9FAFB] text-[14px] flex flex-row items-center justify-start p-1 font-montserrat font-medium w-full  px-[10px] rounded-[6px] text-[#344054] py-[9px] gap-[12px] ">
                      <div className="grid grid-cols-1 hover:cursor-pointer">
                        <input
                          type="checkbox"
                          id={item.buttonText}
                          name={item.buttonText}
                          value={item.id}
                          className="hidden"
                          onChange={handleCheckboxChange}
                        />
                        <div className="inline-flex items-center cursor-pointer">
                          <label
                            htmlFor={item.buttonText}
                            className={`cursor-pointer relative w-4 h-4 rounded border bg-whiteColor ${selectedCheckboxes.includes(item.id)
                              ? "border-activeColorBreadCrum"
                              : "border-grayBorder"
                              }`}
                          >
                            {selectedCheckboxes.includes(item.id) && (
                              <img src={Check} alt="Checked" />
                            )}
                          </label>
                        </div>
                      </div>
                      <label
                        htmlFor={item.buttonText}
                        className="hover:cursor-pointer"
                      >
                        {" "}
                        {item.buttonText}
                      </label>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="flex items-center justify-end bg-[#F9FAFB] p-3">
            <button
              className="w-[90px] bg-[#FFFFFF] px-[14px] py-[8px] mr-2 rounded-[8px] text-[#333333] flex items-center justify-center text-[14px] font-montserrat font-semibold"
              style={{ border: "1px solid #D0D5DD" }}
              type="submit"
              onClick={clearSelectedFilter}
            >
              Clear All
            </button>
            <button
              className="w-[88px] bg-[#329BFA] px-[14px] py-[8px] mr-1 rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
              type="submit"
              onClick={handleSubmit}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
