import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MiscContext from '../../Context/MiscContext';

const Footer = () => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { setSelectedBaronHomePage } = useContext(MiscContext);
  const { pathname } = useLocation()


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFooterLinkClick = () => {
    window.scrollTo(0, 0);
  }
  const mobileLayout = (
    <>

      {!pathname?.includes("/create-agency") && !pathname?.includes("/edit-agency") ? <div className="flex flex-wrap justify-center ml-[-110px]">
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
          onClick={() => { handleFooterLinkClick(); setSelectedBaronHomePage("blogs"); navigate('/blogs'); }}
        >
          Blogs
        </span>
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
          onClick={() => { handleFooterLinkClick(); navigate('/terms') }}
        >
          Terms
        </span>
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
        // onClick={() => { handleFooterLinkClick(); navigate('/privacy') }}
        >
          Privacy
        </span>
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
          onClick={() => { handleFooterLinkClick(); navigate('/cookies') }}
        >
          Cookies
        </span>
      </div> : null}
      <p className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] mt-2">
        Copyright © 2023 Agencyreviews. All Rights Reserved.
      </p>
    </>
  );

  const desktopLayout = (
    <>
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <p className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656]">
          Copyright © 2023 Agencyreviews. All Rights Reserved.
        </p>
      </div>
      {!pathname?.includes("/create-agency") && !pathname?.includes("/edit-agency") ? <div className="flex flex-col md:flex-row justify-center md:justify-end mt-2 md:mt-0">
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
          onClick={() => { handleFooterLinkClick(); setSelectedBaronHomePage("blogs"); navigate('/blogs'); }}
        >
          Blogs
        </span>
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
          onClick={() => { handleFooterLinkClick(); navigate('/terms') }}
        >
          Terms
        </span>
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
        // onClick={() => { handleFooterLinkClick(); navigate('/privacy') }}
        >
          <a href='https://www.growthdaily.com/privacy/' target='_blank' rel="noreferrer">
            Privacy
          </a>
        </span>
        <span
          className="text-[14px] font-normal leading-[18px] font-montserrat text-[#565656] cursor-pointer hover:underline mx-2"
          onClick={() => { handleFooterLinkClick(); navigate('/cookies') }}
        >
          Cookies
        </span>
      </div> : null
      }
    </>
  );

  return (
    <footer className="border-t my-4 md:my-10 max-w-[1216px] border-[#EAECF0] mx-[5%] xl:mx-auto w-100">
      <div className="pt-2 md:pt-4 flex flex-col md:flex-row items-center justify-between">
        {isMobile ? mobileLayout : desktopLayout}
      </div>
    </footer>
  );
};

export default Footer;
