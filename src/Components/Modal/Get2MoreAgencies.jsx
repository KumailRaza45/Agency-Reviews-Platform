import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { Checkmark } from 'react-checkmark'

import Card from "../Card/Card";
import { ReactComponent as CrossBtnIcon } from "../../assets/Icons/x-btn.svg";
import { BeatLoader } from "react-spinners";
import { gql, useMutation } from "@apollo/client";
import { INCREMENT_AGENCY_VIEWS } from "../../Pages/AgencyList";
import { Checkbox } from "@mui/material";
import AgencyMobileCard from "../AgencyMobileCard/AgencyMobileCard";
import { Employees, stringToSlug } from "../../Utilities/utilities";
import RatingStars from "../RatingStars";

import { ReactComponent as Logo } from "../../assets/Icons/VerifiedLogo.svg";
import { ReactComponent as NotVerifiedLogo } from "../../assets/Icons/Notverified.svg";
import PlaceHolderLogo from "../../assets/Icons/logo-placeholder.jpg";
import ArrowRight from "../../assets/Icons/arrow-right-icon.svg";


import { FiUsers as Users } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const INCREMENT_AGENCY_VISITS = gql`
	mutation IncrementAgencyVisit($id: Float!) {
		incrementAgencyVisits(id: $id) {
			id
			name
			total_views
		}
	}
`;
const Get2MoreAgencies = ({ agencies, isOpen, onClose, onSubmit, loading, agencyName, btnTitle }) => {

    const [selectedAgencies, setselectedAgencies] = useState([])
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768 ? true : false)
    const [incrementAgencyViews] = useMutation(INCREMENT_AGENCY_VIEWS);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        if (!isOpen) {
            setselectedAgencies([])
        }
    }, [isOpen])

    useEffect(() => {
        if (selectedAgencies.length === 0) {
            setselectedAgencies(agencies)
        }
    }, [agencies])


    const debouncedHandleResize = () => {
        if (window.innerWidth < 768) {
            setIsMobile(true)
        }
        else {
            setIsMobile(false)
        }
        if (window.innerWidth > 850) {
            setaxDescriptionText(210)
        } else if (window.innerWidth > 600) {
            setaxDescriptionText(130)
        } else {
            setaxDescriptionText(60)
        }
    }

    useEffect(() => {

        window.addEventListener('resize', debouncedHandleResize)

        return () => {
            window.removeEventListener('resize', debouncedHandleResize)
        }
    }, [])

    const [incrementAgencyVisit] = useMutation(INCREMENT_AGENCY_VISITS);

	const handleIncrementVisits = async (id) => {
		try {
			const result = await incrementAgencyVisit({
				variables: { id: id },
			});
			console.log('Mutation Result:', result);
		} catch (error) {
			console.error('Mutation Error:', error);
		}
	};

    const handleIncrementViews = async (id, name, views) => {
        const tempId = parseFloat(id);
        try {
            const result = await incrementAgencyViews({
                variables: { id: tempId },
            });
            console.log("Mutation Result:", result);
        } catch (error) {
            console.error("Mutation Error:", error);
        }
    };

    const [maxDescriptionText, setaxDescriptionText] = useState(() => {
        if (window.innerWidth > 850) {
            return 210
        } else if (window.innerWidth > 550) {
            return 150;
        } else {
            return 60;
        }
    });


    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={isMobile ? mobileStyle : style} className="custom-scroll-bar">
                {
                    agencyName !== ""
                        ?
                        <>
                            <div className="flex py-[16px]" style={{ paddingTop: "24px", gap: isMobile ? "0px" : "18px", flexDirection: isMobile ? "column" : "row", alignItems: "center", width: isMobile ? "100%" : "max-content", alignSelf: "center" }}>
                                <Checkmark size={isMobile ? '56px' : '56px'} />
                                <p className={`text-gray-900 text-center font-inter font-semibold text-[${isMobile ? "18px" : "24px"}]`} style={{ paddingTop: `${isMobile ? "18px" : "25px"}`, paddingBottom: `${isMobile ? "12px" : "25px"}` }}>
                                    Your details have been sent to {agencyName}
                                </p>
                            </div>


                            <p className={`text-gray-700 text-center font-inter font-semibold text-[${isMobile ? "14px" : "18px"}]`} style={{ paddingTop: `${isMobile ? "12px" : "0px"}`, paddingBottom: `${isMobile ? "18px" : "0px"}` }}>
                                Add these {agencies?.length < 3 ? agencies?.length : agencies?.length - 1} similar {agencies?.length > 1 ? "agencies" : "agency"} to your search?
                            </p>
                        </>
                        :
                        <div className="flex" style={{ gap: isMobile ? "0px" : "18px", flexDirection: isMobile ? "column" : "row", alignItems: "center", width: isMobile ? "100%" : "max-content", alignSelf: "center" }}>
                            <p className={`text-gray-900 text-center font-inter font-semibold text-[${isMobile ? "18px" : "24px"}]`} >
                                Similar Agencies
                            </p>
                        </div>
                }


                <div
                    role="button"
                    onClick={onClose}
                    className="absolute right-[16px] top-[16px]"
                >
                    <CrossBtnIcon />
                </div>
                <div className="flex items-center justify-center" style={{ flexDirection: "column", width: "100%", gap: isMobile ? "0px" : "0px", marginTop: "24px" }}>
                    {
                        agencies && agencies.map((agency, i) => {
                            const isChecked = selectedAgencies.filter((agncy, _) => { return (agency?.id === agncy?.id) }).length > 0

                            return (
                                <>
                                    {
                                        isMobile
                                            ?
                                            <div className="w-full px-[16px]" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

                                                <AgencyMobileCard
                                                    disableOpenCardOnClick={true}
                                                    style={{ zIndex: 1 }}
                                                    agencyData={agency}
                                                    onVisitWebsite={() => {handleIncrementVisits(agency.id)}}
                                                    incrementAgencyViews={() => { handleIncrementViews(agency.id, agency.name, agency.total_views) }}
                                                />
                                            </div>
                                            :

                                            <div
                                                key={i}
                                                onClick={() => { handleIncrementViews(agency.id, agency.name, agency.total_views) }}
                                                className="mx-[5%] w-full xl:mx-auto bg-[#F9FAFB] rounded-[16px] border border-[#EAECF0] max-w-[1216px] my-[16px] hover:border-2 hover:border-[#3364f7] hover:bg-[#fff] !important hover:shadow-lg transition-all duration-100 ease-in-out  transform group"
                                            >
                                                <Link
                                                    target={"_blank"}
                                                    to={{
                                                        pathname: `/AgencyDetails/${agency?.id}/${stringToSlug(agency?.name)}`,
                                                        search: `?${new URLSearchParams(queryParams)}`,

                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mx-5 mt-5 lg:hidden">
                                                        <img
                                                            className="w-[80px] h-[80px] object-contain"
                                                            alt=""
                                                            src={agency?.logo}
                                                        />
                                                        {agency?.status === "verified" && (
                                                            <img
                                                                className="w-[80px] h-[80px] object-contain"
                                                                alt=""
                                                                src={require("../../assets/images/layer.png")}
                                                            />
                                                        )}
                                                        {agency?.status === "unverified" && (
                                                            <img
                                                                className="w-[80px] h-[80px] object-contain"
                                                                alt=""
                                                                src={require("../../assets/Icons/Notverified.png")}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex items-start justify-between gap-[24px] pt-5 pr-5 pb-5">
                                                        <div className="flex gap-[10px] lg:gap-[24px] -mt-[5%] lg:-mt-0">
                                                            <div className="pl-5 hidden lg:block">
                                                                <img
                                                                    className="w-[100px] h-[100px] maxwidth-auto object-contain"
                                                                    alt=""
                                                                    src={agency?.logo || PlaceHolderLogo}
                                                                />
                                                            </div>
                                                            <div className="p-5 lg:p-0 mx-[10%] lg:mx-0">
                                                                <h6 className="text-[22px] font-bold uppercase font-babas tracking-[0.44px] text-[#344054]">
                                                                    {agency?.name}
                                                                </h6>
                                                                <h6 className="text-[16px] font-bold uppercase font-babas tracking-[0.44px] mb-2 text-[#344054] group-hover:translate-y-1 duration-200 ease-in-out">
                                                                    {agency?.tagline}
                                                                </h6>
                                                                <p className="text-[12px] xl:text-[14px] font-normal font-montserrat leading-[20px] text-black mb-3">
                                                                    {
                                                                        agency?.bio ? (
                                                                            agency.bio
                                                                        ) : null
                                                                    }
                                                                </p>
                                                                <div className="flex items-center flex-wrap lg:flex-nowrap gap-[8px] mb-5">
                                                                    {agency?.services.map(
                                                                        (serviceItem, serviceIndex) => {
                                                                            return (
                                                                                <div
                                                                                    key={serviceIndex}
                                                                                    className="flex justify-center items-center gap-[8px] h-[26px] pr-[9px] max-w-fit relative"
                                                                                    style={{
                                                                                        backgroundColor: "#3364F7",
                                                                                        transform: "skewX(-12deg)",
                                                                                        borderRadius: "8px",
                                                                                    }}
                                                                                >
                                                                                    <p className="text-[18px] uppercase text-[#FFF] font-babas flex items-center justify-between pl-2 ">
                                                                                        {serviceItem.service.name}
                                                                                    </p>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="pl-4 hidden lg:block">
                                                            {agency?.status === "verified" ? <Logo /> : agency?.status === 'unverified' && <NotVerifiedLogo />}
                                                        </div>
                                                    </div>
                                                    <div className="border-t-[1px] border-[#EAECF0]">
                                                        <div className="grid grid-cols-10 justify-between">
                                                            <div className="flex items-center justify-center col-span-6 lg:col-span-2 px-3 py-3 h-[56px] border-b lg:border-b-0  border-r border-[#EAECF0] gap-2">
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
                                                            <div className="col-span-6 lg:col-span-2 flex justify-center items-center border-b lg:border-b-0 lg:border-r border-[#EAECF0] px-2 py-2 h-[56px]">
                                                                <p className="text-[12px] xl:text-[14px] font-bold font-montserrat flex justify-center items-center gap-1">
                                                                    <Users style={{ width: "24px", height: "24px" }} />
                                                                    {
                                                                        Employees.find((d) => d.value === agency?.employees)
                                                                            ?.name
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center justify-center col-span-6 lg:col-span-2 border-b lg:border-b-0 border-r border-[#EAECF0] px-2 py-2 h-[56px]"
                                                                style={{
                                                                    cursor: "pointer",
                                                                    maxWidth: "100%",
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                <img
                                                                    alt=""
                                                                    className="w-[24px] h-[24px]"
                                                                    src={
                                                                        require("../../assets/images/location.svg").default
                                                                    }
                                                                />
                                                                <span
                                                                    style={{
                                                                        display: "inline-block",
                                                                        maxWidth: "100%",
                                                                        whiteSpace: "nowrap",
                                                                        textOverflow: "ellipsis",
                                                                        overflow: "hidden",
                                                                        fontWeight: 600,
                                                                    }}
                                                                    className="font-montserrat text-[14px]"
                                                                    title={agency?.headquarter_address}
                                                                >
                                                                    {/* {agency?.headquarter_address} */}
                                                                    {agency?.abbreviatedLocation}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-center col-span-6 lg:col-span-2 border-b lg:border-b-0 border-r border-[#EAECF0] px-2 py-2 h-[56px]">
                                                                <p className="text-[12px] xl:text-[14px] font-bold font-montserrat">
                                                                    Total Reviews : {agency?.total_reviews}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center justify-center col-span-8 lg:col-span-2 border-b-0 border-r border-[#EAECF0] px-2 py-2 h-[56px]">
                                                                <RatingStars rating={agency?.total_ratings} />{" "}
                                                                <span className="text-[24px] font-bold font-montserrat">
                                                                    {/* {agency?.total_ratings.toFixed(1)} */}
                                                                    {
                                                                        (() => {
                                                                            let total_ratings = agency?.total_ratings || 0;
                                                                            let roundedValue = Math.floor(total_ratings * 10) / 10;
                                                                            let result = roundedValue.toFixed(1);
                                                                            return result;
                                                                        })()
                                                                    }
                                                                </span>
                                                            </div>
                                                            {/* <div className="flex items-center justify-center col-span-6 lg:col-span-2 px-2 py-2 h-[56px]">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[18px] xl:text-[20px] font-semibold" style={{ color: "#3364F7", cursor: 'pointer' }}>Learn more</span>
                                                                    <img src={ArrowRight} className="w-5 group-hover:translate-x-2 duration-200 ease-in-out" alt="Arrow Right" />
                                                                </div>
                                                            </div> */}

                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                    }
                                </>
                            )

                        })
                    }
                </div>
                <div className={`flex  ${isMobile ? "pt-[16px]" : "pt-[24px]"} ${isMobile ? "pb-[54px]" : "pt-[0px]"} justify-center`}>
                    {
                        loading
                            ?
                            <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
                            :
                            <button title={``} style={{ cursor: "pointer" }} className={`flex py-[10px] px-[18px] justify-center rounded-[8px] ${" bg-[#329BFA] "} text-whiteColor text-[16px] font-semibold leading-[24px]`} onClick={() => { onSubmit(selectedAgencies); }}>
                                {
                                    btnTitle
                                        ?
                                        btnTitle
                                        :
                                        "Add These 2"
                                }
                            </button>
                    }
                </div>
            </Box>
        </Modal>
    );
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100vw - 36px)",
    maxWidth: "1136px",
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    overflowY: "scroll",
    maxHeight: "870px",
    display: "flex",
    flexDirection: "column"
};

const mobileStyle = {
    position: "absolute",
    height: "100vh",
    width: "100vw",
    bgcolor: "background.paper",
    // borderRadius: "8px",
    boxShadow: 24,
    padding: "16px 0px 36px 0px",
    // padding: "16px",
    margin: 0,
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column"
}

export default Get2MoreAgencies;
