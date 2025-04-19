import React, { useContext, useMemo } from 'react';
import Header from '../../Sections/Header/Header';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../Sections/Footer/Footer';
import "./style.css";
// import MiscContext from '../../Context/MiscContext';

const LayoutWithHeaderAndFooter = () => {
  // const { selectedBaronHomePage, setSelectedBaronHomePage } = useContext(MiscContext);
  const location = useLocation();
  // const navigate = useNavigate();

  // const isBlogPage = location.pathname.startsWith("/blogs");

  // const handleTabClick = (tabName) => {
  //   setSelectedBaronHomePage(tabName);
  //   // Update the URL when a tab is clicked
  //   navigate(tabName === "agency" ? "/" : "/blogs");
  // };

  // const selectionBar = useMemo(() => {
  //   return (
  //     <>
  //       {/* Display tabs */}
  //       {isBlogPage && (
  //         <div className='tabs-container grid grid-cols-1 mx-[5%] xl:mx-auto max-w-[1216px]'>
  //           <div className='tabs-container'>
  //             <span
  //               className={`font-inter ${selectedBaronHomePage === "agency" ? " selected-tab " : ""}`}
  //               onClick={() => handleTabClick("agency")}
  //             >
  //               Agency
  //             </span>
  //             <span
  //               className={`font-inter ${selectedBaronHomePage === "blogs" ? " selected-tab " : ""}`}
  //               onClick={() => handleTabClick("blogs")}
  //             >
  //               Blogs
  //             </span>
  //           </div>
  //         </div>
  //       )}
  //     </>
  //   );
  // }, [selectedBaronHomePage, isBlogPage]);

  return (
    <>
      <Header />
      {/* Render the Agency listing on the homepage */}
      {location.pathname === "/" && <Outlet />}
      {/* Render the selectionBar */}
      {/* {selectionBar} */}
      {/* Render the Outlet for other pages */}
      {location.pathname !== "/" && <Outlet />}
      <Footer />
    </>
  );
}

export default LayoutWithHeaderAndFooter;
