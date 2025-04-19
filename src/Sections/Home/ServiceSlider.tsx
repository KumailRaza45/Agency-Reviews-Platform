import React, { useMemo, useRef } from "react";
import arrowLeft from "../../assets/Icons/ArrowLeft.svg";
import { ServicesData } from "../../Utilities/utilities";

const Services = ({ handleCheckboxChange, selectedCheckboxes, handleRemoveClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      });
    }
  };

  useMemo(() => {

    return ServicesData.sort((a, b) => {
      if (selectedCheckboxes.includes(a.id)) {
        return -1
      } else if (!selectedCheckboxes.includes(b.id)) {
        return 1;
      }
      return 0;
    })

  }, [selectedCheckboxes]);
  
  return (
    <div className="flex gap-2 pt-2 items-center justify-center mt-5">
      <div style={{ width: "150px" }}>
        <span>I need help with: </span>
      </div>
      <div className="flex" style={{ width: "calc(100% - 150px)", justifyContent: "space-between" }}>
        <div className="flex w-11 justify-center items-center cursor-pointer"
        >
          <img
            style={{ border: "1px solid #EAECF0", background: "#F9FAFB", height: "20px", width: "20px" }}
            src={arrowLeft}
            alt=""
            className=" rounded-full"
            onClick={scrollLeft}
          />
        </div>
        <div style={{ width: "calc(100% - 110px)" }} className="flex overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex items-center overflow-hidden gap-2 p-2 "
          >
            {ServicesData?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={`group flex justify-center items-center w-auto h-[26px] p-2 cursor-pointer border border-grayBorder ${selectedCheckboxes.includes(item.id) ? "" : "hover:bg-[#EAECF0]"} ${selectedCheckboxes.includes(item.id) ? `bg-[#3364F7]` : ``}`} style={{
                    transform: "skewX(-12deg)",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    className={`text-[18px] uppercase text-gray700 font-babas whitespace-nowrap p-2 ${selectedCheckboxes.includes(item.id) ? `text-whiteColor` : ``}`}

                    onClick={(e) => {
                      handleCheckboxChange(item.id);
                    }}
                  >
                    {item.buttonText}
                  </span>

                  {
                    selectedCheckboxes.includes(item.id) &&
                    <span
                      className='bg-[#FFF] rounded-full flex items-center justify-center   text-black hover:cursor-pointer'
                      onClick={() => handleRemoveClick(item.id)}
                      style={{ height: "12px", width: "12px" }}
                    >
                      {' '}
                      <img
                        alt=''
                        // style={{ height: "6px", width: "6px" }}
                        src={
                          require('../../assets/Icons/x.svg')
                            .default
                        }
                      />{' '}
                    </span>
                  }

                </div>
              );
            })}
          </div>
        </div>
        <div className="flex  w-11 justify-center items-center cursor-pointer"
        >
          <img
            src={arrowLeft}
            alt=""
            className=" rounded-full transform rotate-180"
            onClick={scrollRight}
            style={{ border: "1px solid #EAECF0", background: "#F9FAFB", height: "20px", width: "20px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
