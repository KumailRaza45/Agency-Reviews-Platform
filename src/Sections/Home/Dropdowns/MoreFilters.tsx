import React, { useEffect, useRef, useState } from "react";

import {
  CostData,
  ExpertiesData,
  HeadCountData,
  OwnershipData,
  RattingData,
  ServicesData,
} from "../../../Utilities/utilities";
import arrowDown from "../../../assets/Icons/ArrowDownWhite.svg";
import arrowUp from "../../../assets/Icons/ArrowUp.svg";

import Check from "../../../assets/Icons/Checked.svg";
import Filter from "../../../assets/Icons/filter.svg";
import Selected from "../../../assets/Icons/selected.svg";
import Star from "../../../assets/Icons/star.svg";
import StarOutline from "../../../assets/Icons/start_outline.svg";
import { useMediaQuery } from "@mui/material";

const MoreFilters = ({
  moreFilter,
  setServices,
  setMoreFilter,
  setSort,
  industryCheckboxes,
  IndustryExpertCheckboxChange,
  IndustryExpertReset,
  ownerShipCheckboxes,
  OwnershipExpertCheckboxChange,
  OwnerShipReset,
  handleCostSelected,
  Costselected,
  CostReset,
  HeadCountselected,
  handleHeadCountSelected,
  HeadCountReset,
  Rattingselected,
  handleRattingSelected,
  RattingReset,
  handleClearSelectedFilter,
  handleClearAllFilterSubmit,
  handleSubmit,
  handleServiceChange,
  selectedCheckboxes,
  resetServices,
}) => {
  const isMobile = useMediaQuery("(max-width:786px)");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !isButtonClick(event)
    ) {
      setMoreFilter(false);
    }
  };

  const isButtonClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    return !!target?.closest(".button");
  };

  const getFilterCount = () => {
    let count = 0;
    if (selectedCheckboxes.length && isMobile) {
      count = count + selectedCheckboxes.length;
    }
    if (industryCheckboxes?.length) {
      count = count + industryCheckboxes.length;
    }
    if (ownerShipCheckboxes.length) {
      count = count + ownerShipCheckboxes.length;
    }
    if (Rattingselected) {
      count = count + 1;
    }
    if (HeadCountselected) {
      count = count + 1;
    }
    if (Costselected) {
      count = count + 1;
    }

    return count;
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

  // Industry Expertise

  return (
    <>
      <div className="grid grid-cols-1">
        <button
          className={`button hidden md:grid grid-cols-[auto_auto] items-center px-4 py-[10px] gap-2 rounded-lg border border-grayBorder ${
            moreFilter ? "bg-[#3364F7]" : "bg-whiteColor"
          } `}
          style={{ maxHeight: "42px" }}
          onClick={() => {
            setMoreFilter(!moreFilter);
            setServices(false);
            setSort(false);
          }}
        >
          <span
            className={`${
              moreFilter ? "text-[#fff]" : "text-gray700"
            } font-montserrat text-sm not-italic font-semibold`}
          >
            More Filters
          </span>
          <img
            src={moreFilter ? arrowDown : arrowUp}
            alt="Arrow down"
            className="w-5"
          />
          {/** Badge */}
          <span
            className="absolute top-[-16px] right-[120px]  bg-[#3364F7] text-[#fff] font-montserrat text-xs w-6 h-6 flex items-center justify-center rounded-full"
            style={{}}
          >
            {getFilterCount()}
          </span>
        </button>
        <button
          className="button grid md:hidden grid-cols-1 items-center p-[10px] gap-2 rounded-lg border border-grayBorder bg-whiteColor"
          style={{ position: "relative" }}
          onClick={() => {
            setMoreFilter(!moreFilter);
            setServices(false);
            setSort(false);
          }}
        >
          <img src={Filter} alt="Filter" className="w-5" />
          {/** Badge */}
          <span className="absolute top-[-16px] right-[-10px] bg-[#3364F7] text-[#fff] font-montserrat text-xs w-6 h-6 flex items-center justify-center rounded-full">
            {getFilterCount()}
          </span>
        </button>
        {moreFilter && (
          <div
            ref={dropdownRef}
            className={`w-full absolute right-0 left-0 lg:right-32 top-12 z-20 ${
              screenWidth > 600 ? "max-w-[774px]" : "max-w-[774px] "
            }  ml-auto rounded-lg border border-gray200 bg-whiteColor`}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-2 h-[500px] overflow-y-scroll custom-scroll-bar">
              {
                isMobile ?
                  <div className="grid grid-cols-1 gap-x-5 gap-y-2 py-2">
                    <div className="p-4 pb-0 grid grid-cols-[auto_auto] justify-between">
                      <h2 className="font-montserrat text-gray700 text-sm not-italic font-semibold leading-[20px]">
                        Services
                      </h2>
                      <button
                        onClick={resetServices}
                        className="text-primaryColor font-montserrat text-sm not-italic font-semibold leading-[20px]"
                      >
                        Clear filter
                      </button>
                    </div>
                    <div className="grid gap-y-2 py-2 justify-items-center md:justify-items-start md:grid-cols-3 mobile:grid-cols-2">
                      {ServicesData.map((item) => {
                        return (
                          <>
                            <div className="sm:col-span-1   w-full">
                              <div className="hover:bg-[#F9FAFB] text-[14px] flex flex-row items-center justify-start p-1 font-montserrat font-medium w-full  px-[6px] rounded-[6px] text-[#344054] py-[9px] gap-[12px] ">
                                <div className=" hover:cursor-pointer">
                                  <input
                                    type="checkbox"
                                    id={item.buttonText}
                                    name={item.buttonText}
                                    value={item.id}
                                    className="hidden"
                                    onChange={() => handleServiceChange(item.id)}
                                  />
                                  <div className="inline-flex items-center cursor-pointer">
                                    <label
                                      htmlFor={item.buttonText}
                                      className={`cursor-pointer relative w-4 h-4 rounded border bg-whiteColor ${
                                        selectedCheckboxes.includes(item.id)
                                          ? "border-activeColorBreadCrum"
                                          : "border-grayBorder"
                                      }`}
                                    >
                                      {selectedCheckboxes.includes(
                                        item.id
                                      ) && <img src={Check} alt="Checked" />}
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
                  </div>
                : null
              }
              <div className="grid grid-cols-1 gap-x-5 gap-y-2 py-2">
                <div className="p-4 pb-0 grid grid-cols-[auto_auto] justify-between">
                  <h2 className="font-montserrat text-gray700 text-sm not-italic font-semibold leading-[20px]">
                    Industry Expertise
                  </h2>
                  <button
                    onClick={IndustryExpertReset}
                    className="text-primaryColor font-montserrat text-sm not-italic font-semibold leading-[20px]"
                  >
                    Clear filter
                  </button>
                </div>
                <div className="grid gap-y-2 py-2 justify-items-center md:justify-items-start md:grid-cols-3 mobile:grid-cols-2">
                  {ExpertiesData.map((item) => {
                    return (
                      <>
                        <div className="sm:col-span-1   w-full">
                          <div className="hover:bg-[#F9FAFB] text-[14px] flex flex-row items-center justify-start p-1 font-montserrat font-medium w-full  px-[6px] rounded-[6px] text-[#344054] py-[9px] gap-[12px] ">
                            <div className=" hover:cursor-pointer">
                              <input
                                type="checkbox"
                                id={item.buttonText}
                                name={item.buttonText}
                                value={item.buttonText}
                                className="hidden"
                                onChange={IndustryExpertCheckboxChange}
                              />
                              <div className="inline-flex items-center cursor-pointer">
                                <label
                                  htmlFor={item.buttonText}
                                  className={`cursor-pointer relative w-4 h-4 rounded border bg-whiteColor ${
                                    industryCheckboxes.includes(item.buttonText)
                                      ? "border-activeColorBreadCrum"
                                      : "border-grayBorder"
                                  }`}
                                >
                                  {industryCheckboxes.includes(
                                    item.buttonText
                                  ) && <img src={Check} alt="Checked" />}
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
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-2 py-2">
                <div className="p-4 pb-0 grid grid-cols-[auto_auto] justify-between">
                  <h2 className="font-montserrat text-gray700 text-sm not-italic font-semibold leading-[20px]">
                    Rating
                  </h2>
                  <button
                    onClick={RattingReset}
                    className="text-primaryColor font-montserrat text-sm not-italic font-semibold leading-[20px]"
                  >
                    Clear Filter
                  </button>
                </div>
                <div className="grid gap-x-5 gap-y-2 py-2  justify-items-center md:justify-items-start md:grid-cols-3 mobile:grid-cols-2">
                  {RattingData.map((item) => {
                    return (
                      <>
                        <div
                          key={item.buttonText}
                          className="col-span-1 w-full"
                        >
                          <div className="hover:bg-[#F9FAFB] text-[14px] grid auto-cols-auto grid-flow-col p-1 font-montserrat font-medium w-full px-[10px] rounded-[6px] text-[#344054] py-[9px]">
                            <div className="grid grid-cols-[auto] items-center justify-center hover:cursor-pointer">
                              <input
                                type="radio"
                                name="Ratting" // Use the same name for all radio buttons to group them
                                className="hidden"
                                value={item.value}
                                id={item.buttonText.toString()}
                                checked={Rattingselected === item.value}
                                onChange={handleRattingSelected} // Call the onChange function to update the state
                              />
                              <label
                                htmlFor={item.buttonText.toString()}
                                className={`cursor-pointer relative w-4 h-4 rounded-lg border bg-whiteColor ${
                                  Rattingselected === item.value
                                    ? "border-activeColorBreadCrum"
                                    : "border-grayBorder"
                                }`}
                              >
                                {Rattingselected === item.value && (
                                  <img src={Selected} alt="Selected" />
                                )}
                              </label>
                            </div>
                            <label
                              htmlFor={item.buttonText.toString()}
                              className="hover:cursor-pointer grid auto-cols-auto grid-flow-col self-start items-center"
                            >
                              <div className="grid auto-cols-auto grid-flow-col">
                                {[1, 2, 3, 4, 5].map((value, index) => (
                                  <React.Fragment key={index}>
                                    {value <= item.value ? (
                                      <img alt="" src={Star} className="w-6" />
                                    ) : (
                                      <img
                                        alt=""
                                        src={StarOutline}
                                        className="w-6"
                                      />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                              <p>& Up</p>
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-2 py-2">
                <div className="p-4 pb-0 grid grid-cols-[auto_auto] justify-between">
                  <h2 className="font-montserrat text-gray700 text-sm not-italic font-semibold leading-[20px]">
                    Cost
                  </h2>
                  <button
                    onClick={CostReset}
                    className="text-primaryColor font-montserrat text-sm not-italic font-semibold leading-[20px]"
                  >
                    Clear Filter
                  </button>
                </div>
                <div className="grid gap-x-5 gap-y-2 py-2 justify-items-center md:justify-items-start md:grid-cols-3 mobile:grid-cols-2">
                  {CostData.map((item) => (
                    <div key={item.buttonText} className="col-span-1 w-full">
                      <div className="hover:bg-[#F9FAFB] text-[14px] flex flex-row items-center justify-start p-1 font-montserrat font-medium w-full px-[10px] rounded-[6px] text-[#344054] py-[9px] gap-[12px]">
                        <div className="grid grid-cols-1 hover:cursor-pointer">
                          <input
                            type="radio"
                            name="cost"
                            className="hidden"
                            value={item.value}
                            id={item.buttonText}
                            checked={parseInt(Costselected) === item.value}
                            onChange={handleCostSelected}
                          />
                          <div className="inline-flex items-center cursor-pointer">
                            <label
                              htmlFor={item.buttonText}
                              className={`cursor-pointer relative w-4 h-4 rounded-lg border bg-whiteColor ${
                                parseInt(Costselected) === item.value
                                  ? "border-activeColorBreadCrum"
                                  : "border-grayBorder"
                              }`}
                            >
                              {parseInt(Costselected) === item.value && (
                                <img src={Selected} alt="Selected" />
                              )}
                            </label>
                          </div>
                        </div>
                        <label
                          htmlFor={item.buttonText}
                          className="hover:cursor-pointer"
                        >
                          {item.buttonText}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-2 py-2">
                <div className="p-4 pb-0 grid grid-cols-[auto_auto] justify-between">
                  <h2 className="font-montserrat text-gray700 text-sm not-italic font-semibold leading-[20px]">
                    Headcount
                  </h2>
                  <button
                    onClick={HeadCountReset}
                    className="text-primaryColor font-montserrat text-sm not-italic font-semibold leading-[20px]"
                  >
                    Clear Filter
                  </button>
                </div>
                <div className="grid gap-x-5 gap-y-2 py-2 justify-items-center md:justify-items-start md:grid-cols-3 mobile:grid-cols-2">
                  {HeadCountData.map((item) => (
                    <div key={item.buttonText} className="col-span-1 w-full">
                      <div className="hover:bg-[#F9FAFB] text-[14px] flex flex-row items-center justify-start p-1 font-montserrat font-medium w-full px-[10px] rounded-[6px] text-[#344054] py-[9px] gap-[12px]">
                        <div className="grid grid-cols-1 hover:cursor-pointer">
                          <input
                            type="radio"
                            name="HeadCount" // Use the same name for all radio buttons to group them
                            className="hidden"
                            value={item.value}
                            id={item.buttonText}
                            checked={parseInt(HeadCountselected) === item.value}
                            onChange={handleHeadCountSelected} // Call the onChange function to update the state
                          />
                          <div className="inline-flex items-center cursor-pointer">
                            <label
                              htmlFor={item.buttonText}
                              className={`cursor-pointer relative w-4 h-4 rounded-lg border bg-whiteColor ${
                                parseInt(HeadCountselected) === item.value
                                  ? "border-activeColorBreadCrum"
                                  : "border-grayBorder"
                              }`}
                            >
                              {parseInt(HeadCountselected) === item.value && (
                                <img src={Selected} alt="Selected" />
                              )}
                            </label>
                          </div>
                        </div>
                        <label
                          htmlFor={item.buttonText}
                          className="hover:cursor-pointer"
                        >
                          {item.buttonText}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-2 py-2">
                <div className="p-4 pb-0 grid grid-cols-[auto_auto] justify-between">
                  <h2 className="font-montserrat text-gray700 text-sm not-italic font-semibold leading-[20px]">
                    Diversity
                  </h2>
                  <button
                    onClick={OwnerShipReset}
                    className="text-primaryColor font-montserrat text-sm not-italic font-semibold leading-[20px]"
                  >
                    Clear Filter
                  </button>
                </div>
                <div className="grid gap-x-5 gap-y-2 py-2  justify-items-center md:justify-items-start md:grid-cols-3 mobile:grid-cols-2">
                  {OwnershipData.map((item) => {
                    return (
                      <>
                        <div className="col-span-1 w-full">
                          <div className="hover:bg-[#F9FAFB] text-[14px] flex flex-row items-center justify-start p-1 font-montserrat font-medium w-full  px-[10px] rounded-[6px] text-[#344054] py-[9px] gap-[12px] ">
                            <div className="grid grid-cols-1 hover:cursor-pointer">
                              <input
                                type="checkbox"
                                id={item.buttonText}
                                name={item.buttonText}
                                value={item.buttonText}
                                className="hidden"
                                onChange={OwnershipExpertCheckboxChange}
                              />
                              <div className="inline-flex items-center cursor-pointer">
                                <label
                                  htmlFor={item.buttonText}
                                  className={`cursor-pointer relative w-4 h-4 rounded border bg-whiteColor ${
                                    ownerShipCheckboxes.includes(
                                      item.buttonText
                                    )
                                      ? "border-activeColorBreadCrum"
                                      : "border-grayBorder"
                                  }`}
                                >
                                  {ownerShipCheckboxes.includes(
                                    item.buttonText
                                  ) && <img src={Check} alt="Checked" />}
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
              </div>
            </div>
            <div className="flex items-center justify-end bg-[#F9FAFB] p-3">
              <button
                className="w-[90px] bg-[#FFFFFF] px-[14px] py-[8px] mr-2 rounded-[8px] text-[#333333] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                style={{ border: "1px solid #D0D5DD" }}
                type="submit"
                onClick={() => {
                  handleClearSelectedFilter();
                  handleClearAllFilterSubmit();
                }}
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
    </>
  );
};

export default MoreFilters;
