import { useEffect, useRef, useState } from "react";
import { SortingProps } from "../../../Interface";
import arrowUp from "../../../assets/Icons/ArrowUp.svg";
import arrowDown from "../../../assets/Icons/ArrowDownWhite.svg";
import Sort from "../../../assets/Icons/Sort.svg";
import { ReactComponent as InfoCircle } from "../../../assets/Icons/InfoCircle.svg";
import { useLocation } from "react-router-dom";

const Sorting: React.FC<SortingProps> = ({
  sort,
  setMoreFilter,
  setServices,
  setSort,
  handleSort
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sortValue, setSortValue] = useState<string>("ranking");

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
      value: 'ranking'
    },
    {
      buttonText: "Trending",
      tooltip: "Based on the Most Number of Visit in the last 30 Days",
      value: 'trending'
    },
    {
      buttonText: "Review count",
      value: 'review_count'
    },
    {
      buttonText: "Popularity",
      tooltip: "Based on the Most Number of Visits all time",
      value: 'popularity'
    },
  ];
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const location = useLocation();

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("sort")) {
      const params: string | null = queryParams.get("sort");
      if (params) {
        setSortValue(params);
      }

    }
  }, [location])




  return (
    <div className="grid grid-cols-1 relative">
      <button
        className={`button hidden md:grid grid-cols-[auto_auto] items-center px-4 py-[10px] gap-2 rounded-lg border border-grayBorder ${sort ? 'bg-[#3364F7]' : 'bg-whiteColor'} `}
        style={{ maxHeight: "42px" }}
        onClick={() => {
          setMoreFilter(false);
          setServices(false);
          setSort(!sort);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className={`${sort ? 'text-[#fff]' : 'text-gray700'} font-montserrat text-sm not-italic font-semibold`}>
          Sort by
        </span>
        <img
          src={sort ? arrowDown : arrowUp}
          alt="Arrow up"
          className='w-5'
        />
      </button>

      <button
        className="button grid md:hidden grid-cols-1 items-center p-[10px] gap-2 rounded-lg border border-grayBorder bg-[#329BFA]"
        onClick={() => {
          setMoreFilter(false);
          setServices(false);
          setSort(!sort);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >

        <img
          src={Sort}
          alt="Arrow up"
          className={sort ? "w-5 rotate-180" : "w-5"}

        />
      </button>
      {sort && (
        <div
          ref={dropdownRef}
          className="w-full absolute right-0 top-12 z-20 min-w-[140px] ml-auto py-2 rounded-lg border border-gray200 bg-whiteColor"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-2 px-2 justify-items-center md:justify-items-start" style={screenWidth > 600 ? {} : { justifyItems: "flex-start" }}
          >
            {SortingData.map((item) => (
              <div key={item.buttonText} className="relative w-full">
                <button
                  onClick={() => {
                    setSort(false);
                    handleSort(item.value)
                  }}
                  className={`${sortValue === item.value ? " bg-[#3364F7] text-white font-semibold" : " hover:bg-[#F9FAFB] text-gray700 "}  text-sm not-italic font-montserrat font-medium w-full flex items-center justify-start p-1 rounded-[6px]  py-[9px] px-[10px]`}
                  style={{ color: sortValue === item.value ? "white" : "" }}
                >
                  {item.buttonText}
                  {screenWidth > 600 ?
                    <div>
                      {item.tooltip && (
                        <InfoCircle
                          stroke={sortValue === item.value ? "white" : "#344054"}
                          className="ml-2 w-4 h-4 cursor-pointer"
                          title={item.tooltip}
                        />
                      )}</div> : ""}

                </button>
                {item.tooltip && (
                  <div className="dark:text-white absolute left-full top-0 ml-2 p-2 bg-white border border-gray200 rounded-lg shadow-md hidden group-hover:block">
                    {item.tooltip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sorting;
