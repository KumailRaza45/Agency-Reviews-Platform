import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { AgencyDetailsType } from "../../Interface";
import arrowUp from "../../assets/Icons/ArrowUp.svg";
import Sort from "../../assets/Icons/Sort.svg";
import InfoCircle from "../../assets/Icons/InfoCircle.svg";
import GoogleAnalyticsContext from "../../Context/GoogleAnalyticsContext";

interface AgencyDetailsProps {
  pageContent: AgencyDetailsType;
  handleSort: (val: string) => void
}

const Section6: React.FC<AgencyDetailsProps> = ({ pageContent, handleSort }) => {
  const { id } = useParams();
  const tempId: any = id;

  const userAgency = localStorage.getItem('user_agency');
  const tempAgency: any = userAgency;
  if (tempAgency?.length && tempAgency !== undefined && tempAgency !== 'undefined') {
    var parseAgency = JSON.parse(tempAgency);
  }

  const { sendGoogleAnalytics } = useContext(GoogleAnalyticsContext);

  const [sort, setSort] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !isButtonClick(event)
    ) {
      setSort(false);
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



  const SortingData = [
    {
      buttonText: "Ranking",
      tooltip: "Sort by agency ranking",
    },
    {
      buttonText: "By Date",
      tooltip: "Sort by date of submission",
    },

  ];

  return (
    <>
      <div id="reviews" className="max-w-[1216px] xl:mx-auto mx-[5%] mt-10">
        <div className="grid grid-cols-[auto_auto] justify-between">
          <div className="grid grid-cols-1">
            <h6 className="text-[24px] font-semibold font-inter tracking-[0.44px] mb-2">
              Reviews
            </h6>
          </div>
          <div className="grid grid-cols-[auto_auto] gap-1 sm:gap-4 relative">
            <div className="grid grid-cols-1 content-center">
              <button
                className="button hidden md:grid grid-cols-[auto_auto] items-center px-4 py-[10px] gap-2 rounded-lg border border-grayBorder bg-whiteColor"
                onClick={() => {
                  setSort(!sort);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className="text-gray700 font-montserrat text-sm not-italic font-semibold">
                  Sort by
                </span>
                <img
                  src={arrowUp}
                  alt="Arrow up"
                  className={sort ? "w-5 rotate-180" : "w-5"}
                />
              </button>
              {sort && (
                <div
                  ref={dropdownRef}
                  className="w-full absolute left-0 right-[137px] sm:right-[230px] top-12 z-20 max-w-max ml-auto border p-2 rounded-lg  bg-whiteColor border-gray200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="grid grid-cols-1 gap-x-5 gap-y-2 justify-items-center md:justify-items-start">
                    {SortingData?.map((item) => {
                      return (
                        <div key={item.buttonText} className="relative">

                          <div className="flex flex-row p-3"
                            onClick={() => {
                              setSort(false);
                              handleSort(item.buttonText)
                            }}>
                            <label
                              htmlFor="Value"
                              className="cursor-pointer font-montserrat text-sm font-medium text-textColor not-italic leading-5 whitespace-nowrap"

                            >
                              {item.buttonText}
                            </label>
                            <div className="group relative flex justify-center items-center h-full">
                              <button type="button" className="text-textColor">
                                <img
                                  src={InfoCircle}
                                  alt="Info"
                                  className="ml-1 mt-1 w-4 h-4 cursor-pointer"
                                />
                              </button>
                              <div className=" font-inter md:w-max absolute bg-BlackColor text-whiteColor bottom-5 scale-0 transition-[50ms] rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white group-hover:scale-100">
                                {item.tooltip}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>
            {parseInt(tempId) !== parseAgency?.agency?.id &&
              <div className="grid grid-cols-1">
                <Link
                  to={{
                    pathname: `/review/${id}`,
                    search: `?${new URLSearchParams(queryParams)}`,
                  }}

                  onClick={() => { sendGoogleAnalytics({ capturedAction: "submit_anonymous_review" }) }}
                >
                  <button
                    className="bg-[#329BFA] px-2 sm:px-4 py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                    type="submit"
                  >
                    Submit Anonymous Review
                  </button>
                </Link>
              </div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Section6;
