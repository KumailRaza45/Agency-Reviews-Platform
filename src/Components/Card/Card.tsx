import { Checkbox } from "@mui/material";
import companyLogo from "../../assets/images/company-logo.png";
import verifiedAgency from "../../assets/images/verified-agency.png";
import employeesIcon from "../../assets/Icons/Employees.svg";
import locationIcon from "../../assets/Icons/Location.svg";
import starIcon from "../../assets/Icons/star.svg";
import rightArrowIcon from "../../assets/Icons/arrow-right-icon.svg";
import starOutline from "../../assets/Icons/start_outline.svg";
import React, { useEffect } from "react";

import { ReactComponent as Logo } from "../../assets/Icons/VerifiedLogo.svg";
import { ReactComponent as NotVerifiedLogo } from "../../assets/Icons/Notverified.svg";
import { Employees, stringToSlug } from "../../Utilities/utilities";
import { FiUsers as Users } from "react-icons/fi";
import RatingStars from "../RatingStars";
import { Link, useLocation } from "react-router-dom";

const Card = ({ agency, isChecked, onCheck, incrementAgencyViews, }: { agency: any, isChecked: boolean, onCheck: any, incrementAgencyViews: any }) => {


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  return (
    <div className=" flex justify-center items-center" >
      <div
        className="w-[328px] shadow rounded-[8px] flex"
        style={{
          background: "#f9fafb",
          border: "1px solid var(--gray-200, #EAECF0)",
          height: "695px",
          marginTop: "12px",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div className="m-4 " style={{ height: "calc(100% - 172px)" }}>
          <div className="flex justify-between">
            <div>
              <Checkbox checked={isChecked} onClick={() => { onCheck(agency) }} />
            </div>
            <div>
              <img src={agency?.logo_url.includes('agencyreviews-dev.s3.amazonaws.com') ? agency?.logo_url : companyLogo} alt="Logo here" style={{ height: "100px", width: "92px" }} />
            </div>
            <div>
              {agency?.status === "verified" ? <Logo style={{ height: "52px", width: "52px" }} /> : agency?.status === 'unverified' && <NotVerifiedLogo style={{ height: "52px", width: "52px" }} />}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 self-stretch" style={{ justifyContent: "space-between", height: "calc(100% - 100px)" }}>
            <span title={agency?.name} className="h-[67px] text-2-lines leading-normal tracking-tight text-[#344054] text-center font-bold not-italic font-inter leading-8 text-[22px] mt-2 uppercase font-Bebas Neue Pro">
              {agency?.name}
            </span>
            <div style={{ height: "130px" }}>
              <p title={agency?.bio} className=" text-6-lines text-[#344054] text-center font-medium font-montserrat text-[14px]">
                {agency.bio}
              </p>
            </div>

            <div
              className=" flex justify-start items-center gap-[8px] rounded hide-scrollbar"
              style={{
                transform: "skewX(-12deg)",
                width: "100%",
                minHeight: "26px",
                flexWrap: "wrap",
                height: "min-content"
              }}
              role="button"
            >
              {
                agency?.services && agency?.services?.map((serviceItem, _) => {
                  return (
                    <p key={_} className="pr-[9px] border rounded-lg bg-[#3364F7] text-[18px] uppercase text-[#FFF] font-babas flex items-center justify-between pl-2">
                      {serviceItem.service.name}
                    </p>
                  )
                })
              }
            </div>

            <div
              className=" flex justify-start items-center gap-[8px] rounded hide-scrollbar"
              style={{
                transform: "skewX(-12deg)",
                width: "100%",
                minHeight: "26px",
                flexWrap: "wrap",
                height: "min-content"
              }}
              role="button"
            >
              {
                agency?.industries && agency?.industries?.map((ind, _) => {
                  return (
                    <p key={_} className="pr-[9px] border rounded-lg bg-[#3364F7] text-[18px] uppercase text-[#FFF] font-babas flex items-center justify-between pl-2">
                      {ind?.name}
                    </p>
                  )
                })
              }
            </div>
          </div>

        </div>
        <div className="flex flex-wrap">



          <div className="flex w-full border border-[#EAECF0]">
            <div className="flex justify-center items-center gap-2 w-[174px] h-[56px] border-r border-[#EAECF0]">
              {[1, 2, 3, 4, 5].map((value, index) => (
                <React.Fragment key={index}>
                  {value <= agency?.retainer_size ? (
                    <span
                      className="font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 text-BlackColor"
                      style={{ color: "#3364F7" }}
                    >
                      $
                    </span>
                  ) : (
                    <span className="font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 text-grayBorder">
                      $
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-center items-center gap-[8px] w-[174px] h-[56px] border-[#344054]">
              <Users style={{ width: "24px", height: "24px" }} />

              <span className="text-[#344054] font-montserrat text-[16px] font-bold leading-5 ">
                {
                  Employees.find((d) => d.value === agency?.employees)
                    ?.name
                }
              </span>
            </div>
          </div>
          <div className="flex w-full border-b border-x border-[#EAECF0]">
            <div className="flex justify-center items-center w-[174px] h-[56px] border-r border-[#EAECF0]">
              <span className="text-[#344054] text-[16px] font-bold font-inter leading-8">
                Total Reviews: {agency?.total_reviews}
              </span>
            </div>

            <div className="flex justify-center items-center gap-2  w-[174px] h-[56px]" title={agency?.headquarter_address}>
              <img src={locationIcon} alt="Icon here" />
              <span
                style={{
                  display: "inline-block",
                  // width: "100px",
                  maxWidth: "100px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  fontWeight: 600,
                }}
                className="font-montserrat text-[16px] font-bold leading-5 text-[#344054]"

              >
                {agency?.headquarter_address}
              </span>
            </div>
          </div>
          <div className="flex w-full border-b border-x border-[#EAECF0]">
            <div className="flex justify-center items-center gap-1  w-[174px] h-[56px] border-r border-[#EAECF0]">
              <RatingStars rating={agency?.total_ratings} />{" "}
              <span className="text-[#344054] font-montserrat text-[16px] font-bold">
                {agency?.total_ratings.toFixed(1)}
              </span>
            </div>

            <Link
              // target={window.innerWidth > 767 ? "_blank" : ""}
              className="flex justify-center items-center w-[174px] h-[56px] cursor-pointer"
              target={"_blank"}
              onClick={incrementAgencyViews}
              to={{
                pathname: `/AgencyDetails/${agency?.id}/${stringToSlug(agency?.name)}`,
                search: `?${new URLSearchParams(queryParams)}`,

              }}
            >
              <span className="text-[#3364f7] font-semibold font-inter leading-8">
                Learn more
              </span>
              <img src={rightArrowIcon} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Card;
