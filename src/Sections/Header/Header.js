import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LoginIcon from "../../assets/Icons/Login.svg"; // Assuming the path is correctlog-out.svg
import { ReactComponent as LogoutIcon } from "../../assets/Icons/log-out.svg";
import { ReactComponent as EditIcon } from "../../assets/Icons/edit-04.svg";
import { ReactComponent as BuildingIcon } from "../../assets/Icons/building.svg";
import { ReactComponent as ContactusIcon } from "../../assets/Icons/message-text-square-02.svg";
import BellIcon from "../../assets/Icons/bell.svg";
import { UserContext } from "../../Context/UserContext";
import { useFocusWithin } from "@react-aria/interactions";
import CustomModal from "../../Components/Modal/CustomModal";
import { gql, useMutation } from "@apollo/client";
import ToastContext from "../../Context/ToastContext";
import PerfectMatchModal from "../../Components/Modal/PerfectMatchModal/Modal"
import GetMatchedFlow from "../../Components/GetMatchedFlow"

import { stringToSlug } from '../../Utilities/utilities';

//APP LOGO
import { ReactComponent as Logo } from "../../assets/Icons/Logo.svg";

const SEND_EMAIL = gql`
  mutation ContactUs($data: ContactUsInput!) {
    ContactUs(data: $data) {
      status
    }
  }
`;

const Header = ({isPortal}) => {
  const { id } = useParams();
  const { token, user, updateSession } = useContext(UserContext);
  const [isComponentInIFrame, setIsComponentInIFrame] = useState(false);
  const { agency } = useContext(UserContext);
  const [openLogoutMenu, setOpenLogoutMenu] = useState(false);
  const [userAgency, setUserAgency] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isContactUsModalOpen, setisContactUsModalOpen] = useState(false);
  const [sendMail] = useMutation(SEND_EMAIL);
  const { showToast, hideToast } = useContext(ToastContext);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      buttonRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setDropdown(false);
    }
  };

  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: (e) => {
      // setOpenLogoutMenu(openLogoutMenu ? false : true);
    },
    onBlurWithin: (e) => {
      setOpenLogoutMenu(false);
    },
  });

  useEffect(() => {
    if (window.self !== window.top) {
      // Component is inside an iframe
      setIsComponentInIFrame(true);
    } else {
      // Component is not in an iframe
      setIsComponentInIFrame(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sendContactUsMail = async (ticketType, description) => {
    const data = {
      agencyId: parseInt(userAgency?.id),
      ticketType: ticketType,
      details: description,
    };
    try {
      const result = await sendMail({
        variables: { data: data },
      });
      setisContactUsModalOpen(false);
      showToast("Email sent successfully!", "success");
      setTimeout(() => {
        hideToast();
      }, 3000);
    } catch (error) {
      setisContactUsModalOpen(false);
      showToast("Unable to send email. Please try again!", "warn");
      setTimeout(() => {
        hideToast();
      }, 3000);
    }
  };

  const userAgencyData = localStorage.getItem("user_agency");

  useEffect(() => {
    if (
      userAgencyData !== undefined &&
      userAgencyData !== "undefined" &&
      JSON.parse(userAgencyData)
    ) {
      let agency = JSON.parse(userAgencyData);
      setUserAgency(agency?.agency || null);
    }
  }, [userAgencyData]);

  const logOutMemo = useMemo(() => {
    return (
      <div
        tabIndex={-1}
        {...focusWithinProps}
        onClick={() => {
          if (openLogoutMenu === false) {
            setOpenLogoutMenu(true);
          }
        }}
        className="w-[45px] h-[45px] flex"
        style={{
          backgroundColor: "#DFDFDF",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          position: "relative",
          cursor: "pointer",
        }}
      >

        <img
          className="w-[35px] h-[35px]"
          style={{ objectFit: "contain" }}
          src={
            userAgency?.logo_url
              ? userAgency?.logo_url
              : require("../../assets/images/Logomark.svg").default
          }
          alt=""
        />

        {openLogoutMenu && (
          <div
            className={`w-[240px]  `}
            style={{
              position: "absolute",
              height: "min-context",
              borderRadius: "8px",
              border: "1px solid var(--gray-200, #EAECF0)",
              zIndex: 999,
              background: "white",
              boxShadow:
                "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
              top: "60px",
              right: "0px",
              display: openLogoutMenu ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            <div
              className="h-[64px] w-[100%] flex"
              style={{
                padding: "9.5px 16px",
                borderBottom: "1px solid var(--gray-200, #EAECF0)",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                className="w-[45px] h-[45px] flex"
                style={{
                  backgroundColor: "#DFDFDF",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  position: "relative",
                }}
              >
                <img
                  className="w-[35px] h-[35px]"
                  style={{ objectFit: "contain" }}
                  src={
                    userAgency?.logo_url
                      ? userAgency?.logo_url
                      : require("../../assets/images/Logomark.svg").default
                  }
                  alt=""
                />
              </div>

              <Link
                to={`/AgencyDetails/${userAgency?.id}/${stringToSlug(userAgency.name)}`}
                onClick={() => {
                  setOpenLogoutMenu(false);
                }}
              >
                {" "}
                <span
                  className="font-inter"
                  style={{
                    color: "#344054",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {`${userAgency?.name == undefined ? "" : userAgency?.name}`}
                </span>
              </Link>
            </div>
            {userAgency?.email === user?.email && (
              <>
                <div
                  className="h-[50px] w-[100%] flex justify-start hover:bg-[#DFDFDF]"
                  style={{
                    padding: "9.5px 16px",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenLogoutMenu(false);
                    navigate(`/agency-listing/${userAgency?.id}`);
                  }}
                >
                  <BuildingIcon />
                  <span
                    className="font-inter"
                    style={{
                      color: "#344054",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    My Agency Portal
                  </span>
                </div>
                <div
                  className="h-[50px] w-[100%] flex justify-start hover:bg-[#DFDFDF]"
                  style={{
                    padding: "9.5px 16px",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenLogoutMenu(false);
                    navigate(`/edit-agency/${userAgency?.id}`);
                  }}
                >
                  <EditIcon />
                  <span
                    className="font-inter"
                    style={{
                      color: "#344054",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Edit listing
                  </span>
                </div>
                <div
                  className="h-[50px] w-[100%] flex justify-start hover:bg-[#DFDFDF]"
                  style={{
                    padding: "9.5px 16px",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenLogoutMenu(false);
                    setisContactUsModalOpen(true);
                  }}
                >
                  <ContactusIcon />
                  <span
                    className="font-inter"
                    style={{
                      color: "#344054",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Contact us
                  </span>
                </div>
              </>
            )}
            <div
              className="h-[50px] w-[100%] flex justify-start hover:bg-[#DFDFDF]"
              style={{
                padding: "9.5px 16px",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                borderTop: "1px solid var(--gray-200, #EAECF0)",
              }}
              onClick={() => {
                showToast("You have been successfully log out", "success");
                setTimeout(() => {
                  hideToast();
                }, 1000);
                setOpenLogoutMenu(false);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.clear();
                updateSession(null, null);
                navigate("/");
              }}
            >
              <LogoutIcon />
              <span
                className="font-inter"
                style={{
                  color: "#344054",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Log out
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }, [userAgency, agency, openLogoutMenu, location, user, setOpenLogoutMenu]);

  return (
    <div className="w-full px-6 flex items-center  mb-[32px]" style={{ backgroundColor: "#F9Fafb", borderBottom: "1px solid #EAECF0", justifyContent: "center" }}>


      {isContactUsModalOpen && (
        <CustomModal
          isOpen={isContactUsModalOpen}
          onClose={() => {
            setisContactUsModalOpen(false);
          }}
          onSubmit={(type, description) => {
            sendContactUsMail(type, description);
          }}
        />
      )}


      <div className="grid  grid-cols-[auto_auto] items-center justify-between gap-1 sm:gap-0 w-full  h-[100px] xl:mx-auto relative"

      >
        <div className="grid grid-cols-1">
          {isComponentInIFrame ? (
            <Logo />
          ) : (
            // <img src={require("../../assets/images/logo.png")} alt="Logo" />
            <>
              {token === null || token === "" ? (
                <Link to={"/"}>
                  <Logo />
                </Link>
              ) : (
                <Link to={"/"}>
                  <Logo />
                </Link>
              )}
            </>
          )}
        </div>
        {isComponentInIFrame === false ? (

          <div className="flex gap-[16px]">



            {token === null || token === "" ? (
              <div className="flex items-center justify-end relative">

                <button
                  ref={buttonRef}
                  className="button w-[92px]  py-[10px] rounded-[8px]  text-[#475467] flex items-center justify-between text-[14px] font-montserrat font-semibold"
                  type="submit"
                  onClick={() => {
                    setDropdown(!dropdown);
                  }}
                >
                  Agencies
                  <svg
                    sidebar-toggle-item
                    className={dropdown ? "w-6 h-6 rotate-180" : "w-6 h-6"}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {dropdown && (
                  <>
                    <div
                      className="absolute mx-auto top-14 right-0 w-52 p-2 origin-top-right rounded-[8px] bg-white border border-whiteColor py-1 card-shadow ring-black ring-opacity-5 bg-whiteColor"
                      role="menu"
                      aria-orientation="vertical"
                      ref={dropdownRef}
                      style={{ zIndex: "999" }}
                    >
                      <Link to={"/agency-login"}>
                        <button
                          className="hover:bg-[#F9FAFB] text-[14px] font-montserrat font-medium w-full flex items-center justify-start gap-x-2 p-1 rounded-[6px] text-[#344054] mb-1 py-1"
                          onClick={() => setDropdown(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M10 2H10.8C11.9201 2 12.4802 2 12.908 2.21799C13.2843 2.40973 13.5903 2.71569 13.782 3.09202C14 3.51984 14 4.0799 14 5.2V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H10M6.66667 4.66667L10 8M10 8L6.66667 11.3333M10 8L2 8"
                              stroke="#344054"
                              stroke-width="1.6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          Agency Login
                        </button>
                      </Link>

                      <Link
                        to={
                          "https://calendly.com/diego-agency-reviews/30min?utm_source=site_header&utm_medium=site_header&utm_campaign=site_header"
                        }
                        target="_blank"
                      >
                        <button
                          className="hover:bg-[#F9FAFB] text-[14px] font-montserrat font-medium w-full flex items-center justify-start gap-x-2 p-1 rounded-[6px] text-[#344054] mb-1 py-1"
                          onClick={() => setDropdown(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_2117_65619)">
                              <path
                                d="M6.00004 7.99967L7.33337 9.33301L10.3334 6.33301M11.9342 3.33201C12.0714 3.66403 12.3349 3.92794 12.6667 4.06572L13.8302 4.54766C14.1622 4.6852 14.426 4.949 14.5636 5.28105C14.7011 5.61309 14.7011 5.98617 14.5636 6.31821L14.082 7.48088C13.9444 7.81307 13.9442 8.18652 14.0824 8.51855L14.5632 9.68087C14.6313 9.84533 14.6664 10.0216 14.6665 10.1996C14.6665 10.3777 14.6315 10.554 14.5633 10.7184C14.4952 10.8829 14.3953 11.0324 14.2694 11.1582C14.1435 11.2841 13.9941 11.3839 13.8296 11.452L12.6669 11.9336C12.3349 12.0709 12.071 12.3344 11.9333 12.6662L11.4513 13.8297C11.3138 14.1617 11.05 14.4255 10.718 14.5631C10.3859 14.7006 10.0129 14.7006 9.68085 14.5631L8.51823 14.0815C8.18619 13.9443 7.81326 13.9446 7.48142 14.0823L6.31797 14.5635C5.98612 14.7007 5.61338 14.7006 5.28162 14.5632C4.94986 14.4258 4.68621 14.1623 4.54858 13.8306L4.06652 12.6667C3.92924 12.3347 3.66574 12.0708 3.33394 11.933L2.17048 11.4511C1.8386 11.3136 1.57488 11.05 1.4373 10.7181C1.29971 10.3863 1.29953 10.0134 1.43678 9.68137L1.91835 8.51871C2.05554 8.18666 2.05526 7.81371 1.91757 7.48186L1.43669 6.31753C1.36851 6.15307 1.3334 5.97679 1.33337 5.79876C1.33335 5.62073 1.3684 5.44444 1.43652 5.27996C1.50465 5.11548 1.60452 4.96604 1.73042 4.84018C1.85632 4.71431 2.00579 4.61449 2.17028 4.54641L3.33291 4.06482C3.66462 3.92766 3.92836 3.66447 4.06624 3.33305L4.54816 2.16955C4.68569 1.8375 4.94949 1.5737 5.28152 1.43616C5.61355 1.29862 5.98662 1.29862 6.31865 1.43616L7.48127 1.91775C7.81331 2.05495 8.18624 2.05467 8.51808 1.91697L9.68202 1.43691C10.014 1.29945 10.387 1.29948 10.719 1.43699C11.0509 1.5745 11.3147 1.83823 11.4522 2.17018L11.9343 3.33403L11.9342 3.33201Z"
                                stroke="#344054"
                                stroke-width="1.6"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_2117_65619">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          Verify my Agency
                        </button>
                      </Link>
                    </div>
                  </>
                )}


              </div>
            ) : (
              <div className="flex items-center gap-5 cursor-pointer">
                {isPortal && <img src={BellIcon} alt='Notifications' />}
              {logOutMemo}
              </div>
            )}
            {!isPortal && <>
              <button
                className="button bg-[#FFFFFF] px-[16px] py-[10px] rounded-[8px]  text-[#344054] flex items-center justify-between text-[14px] font-montserrat font-bold" style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)", border: "1px solid #D0D5DD", borderRadius: "8px" }}
                type="submit"
                onClick={() => { navigate("/write-a-review") }}
              >
                Write a Review
              </button>

              <GetMatchedFlow />
            </>}
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* <div className="border-t mb-8 max-w-[1216px] border-[#EAECF0] mx-[5%] xl:mx-auto "></div> */}
    </div>
  );
};

export default Header;
