import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ServicesData } from "../Utilities/utilities";
import { SearchBoxForMoblie } from "../Components/SearchBoxForMobile";
import { ReactComponent as RightIcon } from '../assets/Icons/arrow-right.svg'


const AgencyListMobileView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [isSearchResultOpened, setIsSearchResultOpened] = useState(false)
  const updateURL = (serviceId) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('services', serviceId);
    queryParams.set('sort', 'ranking');
    navigate(`/listing?${queryParams.toString()}`);
  }




  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "scroll" }}>
      <span className="block text-center mb-[16px] text-slate-700 text-base font-semibold font-montserrat font-semibold">I need the most help with: </span>
      <div className="flex flex-wrap mb-[24px] mx-[16px] justify-center">
        {ServicesData.map((item, index) => {
          return (
            <>
              <div
                key={item.id}
                style={{
                  transform: "skewX(-12deg)",
                  borderRadius: "8px",
                }}
              >
                <div className="hover:bg-[#F9FAFB] text-[12px] flex flex-row items-center justify-start p-1 font-montserrat font-medium rounded-[6px] text-[#344054] py-[9px]  ">
                  <div className="grid grid-cols-1 hover:cursor-pointer">
                    <input
                      type="checkbox"
                      id={item.buttonText}
                      name={item.buttonText}
                      value={item.id}
                      className="hidden"

                    />
                  </div>
                  <label
                    htmlFor={item.buttonText}
                    className="hover:cursor-pointer text-[16px] text-[#ffff] p-2 bg-[#3364F7] rounded-2xl  font-bold font-['Bebas Neue Pro'] uppercase tracking-tight"
                    onClick={() => updateURL(item.id)}
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
      <div className="flex items-center justify-center gap-x-2 mb-[24px]">
        <div className="bg-[#D0D5DD] w-[58px] h-[1px]"> </div>
        <span className="w-[18px] h-[18px] text-slate-700 text-base font-semibold font-montserrat font-semibold">or</span>
        <div className="bg-[#D0D5DD] w-[58px] h-[1px]"> </div>
      </div>
      <span className="block text-center mb-[16px] text-slate-700 text-base font-semibold font-montserrat">Search for an agency here</span>
      <div className="flex items-center justify-center md:mx-[24px]">
        <SearchBoxForMoblie placeholder={'Search for an agency'} isSearchResultOpened={(status) => { setIsSearchResultOpened(status) }} agencieyNotListied={false} />
      </div>
      <div>
        <a href="/listing" className="flex font-semibold font-montserrat justify-center items-center gap-1 mb-[32px] group text-[#3364F7]" style={{ marginTop: isSearchResultOpened ? "310px" : "20px" }}>Skip to Homepage
          <RightIcon stroke="#3364F7" className="group-hover:translate-x-2 duration-200 ease-in-out" />
        </a>
      </div>
    </div>
  );
};
export default AgencyListMobileView;
