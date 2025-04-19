import React, { useState } from "react";
import { Link } from "react-router-dom";
import ForAgencyDropdown from "./Dropdown/ForAgencyDropdown";
import { ReactComponent as Logo } from "../../assets/Icons/Logo.svg";

interface HeaderProps {
  isPortal?: boolean;
}
 
const Header: React.FC<HeaderProps> = () => {
  const [ForAgency, setForAgency] = useState<boolean>(false);
  return (
    <>
      <div className="grid grid-cols-[auto_auto] items-center justify-between gap-1 sm:gap-0 max-w-[1216px] h-[100px] mx-[5%] xl:mx-auto relative">
        <div className="grid grid-cols-1">
          <Link to={"/"}>
            <Logo />
          </Link>
        </div>
        <ForAgencyDropdown ForAgency={ForAgency} setForAgency={setForAgency} />
      </div>
      <div className="border-t mb-8 max-w-[1216px] border-[#EAECF0] mx-[5%] xl:mx-auto" style={{ marginBottom: "32px" }}></div>
    </>
  );
};

export default Header
