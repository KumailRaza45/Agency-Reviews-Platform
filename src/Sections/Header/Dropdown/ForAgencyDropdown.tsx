// import React, {useRef, useEffect} from 'react';
import Login from '../../../assets/Icons/Login.svg'
import ChkVarify from '../../../assets/Icons/CheckVarify.svg'
import ArrowDown from '../../../assets/Icons/ArrowDownWhite.svg'
import { ForAgencyProps } from '../../../Interface';
import {useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';


const ForAgencyDropdown:React.FC<ForAgencyProps> = ({ForAgency, setForAgency}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !isButtonClick(event)) {
        setForAgency(false);
    }
  };
  const isButtonClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    return !!target?.closest('.button');
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
        <>
            <div className="grid grid-cols-1">
                <button className="button px-3 py-[5px] sm:px-[16px] sm:py-[10px] bg-[#329BFA] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold" type="submit" onClick={()=>{
                    setForAgency(!ForAgency);
                }}>
                    <span>For Agencies</span>
                    <img src={ArrowDown} alt="ArrowDown" className={ForAgency ? "w-5 rotate-180" : "w-5" }/>
                </button>
                {ForAgency && (
                <div ref={dropdownRef} className="w-full absolute left-0 right-0 top-20 z-20 max-w-max ml-auto p-2 rounded-lg border border-gray200 bg-whiteColor" role="menu" aria-orientation="vertical">
                    <div className="grid grid-cols-1 gap-x-5 gap-y-2 justify-items-center md:justify-items-start">
                        <Link to="/AgencyDetails" onClick={() => {
                             setForAgency(false);
                        }} className="hover:bg-[#F9FAFB] gap-2 text-sm not-italic font-montserrat font-medium w-full flex items-center justify-start rounded-[6px] text-gray700 py-[9px] px-[10px]">
                            <img src={Login} alt='Login' className='w-4'/>
                            <span className='text-gray700 font-montserrat text-sm not-italic font-semibold'>For Agency Login</span>
                        </Link>
                        <Link to="/AgencyDetails" onClick={() => {
                             setForAgency(false);
                        }} className="hover:bg-[#F9FAFB] gap-2 text-sm not-italic font-montserrat font-medium w-full flex items-center justify-start rounded-[6px] text-gray700 py-[9px] px-[10px]">
                            <img src={ChkVarify} alt='Login' className='w-4'/>
                            <span className='text-gray700 font-montserrat text-sm not-italic font-semibold'>Verify my Agency</span>
                        </Link>
                    </div>
                </div>
            )}
            </div>
        </>
  )
}

export default ForAgencyDropdown;