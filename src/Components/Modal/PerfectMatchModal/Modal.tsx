import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import Card from "../../Card/Card";
import { ReactComponent as CrossBtnIcon } from "../../../assets/Icons/x-btn.svg";
import { BeatLoader } from "react-spinners";
import AgencyMobileCard from "../../AgencyMobileCard/AgencyMobileCard";
import { gql, useMutation } from "@apollo/client";
import { INCREMENT_AGENCY_VIEWS } from "../../../Pages/AgencyList";
import { Checkbox } from "@mui/material";

const INCREMENT_AGENCY_VISITS = gql`
	mutation IncrementAgencyVisit($id: Float!) {
		incrementAgencyVisits(id: $id) {
			id
			name
			total_views
		}
	}
`;
const PerfectMatchModal = ({ agencies, isOpen, onClose, onSubmit, loading }) => {

  const [selectedAgencies, setselectedAgencies] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768 ? true : false)
  const [incrementAgencyViews] = useMutation(INCREMENT_AGENCY_VIEWS);

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
  }

  useEffect(() => {

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [])

  const [incrementAgencyVisit] = useMutation(INCREMENT_AGENCY_VISITS);

	const handleIncrementVisits = async (id: any) => {
		try {
			const result = await incrementAgencyVisit({
				variables: { id: id },
			});
			console.log('Mutation Result:', result);
		} catch (error) {
			console.error('Mutation Error:', error);
		}
	};

  const handleIncrementViews = async (id: any, name: string, views: number) => {
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


  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={isMobile ? mobileStyle : style} className="custom-scroll-bar">
        <p className={`text-gray-900 text-center font-inter font-semibold text-[${isMobile ? "18px" : "24px"}]`}>
          Your perfect matches
        </p>
        <div
          role="button"
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        >
          <CrossBtnIcon />
        </div>
        <div className="flex items-center justify-center" style={{ flexDirection: isMobile ? "column" : "row", width: "100%", gap: isMobile ? "0px" : "1.25rem", marginTop: "24px" }}>
          {
            agencies && agencies.map((agency: any, i) => {
              const isChecked = selectedAgencies.filter((agncy: any, _) => { return (agency?.id === agncy?.id) }).length > 0
              return (
                <>
                  {
                    isMobile
                      ?
                      <div className="w-full px-[16px]" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Checkbox
                          className="left-[21px] top-[6px]"
                          style={{ position: "absolute", zIndex: "9", width: "24px", height: "24px", backgroundColor: "white" }}
                          checked={isChecked ? true : false}
                          onClick={() => {
                            if (isChecked) {
                              setselectedAgencies([...selectedAgencies.filter((agncy: any, _) => { return (agency?.id !== agncy?.id) })])
                            } else {
                              let temp_agencies = selectedAgencies
                              temp_agencies.push(agency as never)
                              setselectedAgencies([...temp_agencies])
                            }
                          }}
                        />
                        <AgencyMobileCard
                          disableOpenCardOnClick={true}
                          style={{ zIndex: 1 }}
                          agencyData={agency}
                          onVisitWebsite={() => {
                            handleIncrementVisits(agency.id)
                          }}
                          incrementAgencyViews={() => { handleIncrementViews(agency.id, agency.name, agency.total_views) }}
                        />
                      </div>
                      :
                      <Card
                        incrementAgencyViews={() => { handleIncrementViews(agency.id, agency.name, agency.total_views) }}
                        agency={agency}
                        isChecked={isChecked ? true : false}
                        onCheck={() => {
                          if (isChecked) {
                            setselectedAgencies([...selectedAgencies.filter((agncy: any, _) => { return (agency?.id !== agncy?.id) })])
                          } else {
                            let temp_agencies = selectedAgencies
                            temp_agencies.push(agency as never)
                            setselectedAgencies([...temp_agencies])
                          }
                        }}
                      />
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
              <button title={selectedAgencies.length === 0 ? `To start convos please select atleast one agency!` : ""} disabled={selectedAgencies.length === 0} style={{ cursor: "pointer" }} className={`flex py-[10px] px-[18px] justify-center rounded-[8px] ${selectedAgencies.length === 0 ? " bg-[#dadfe4] " : " bg-[#329BFA] "} text-whiteColor text-[16px] font-semibold leading-[24px]`} onClick={() => { onSubmit(selectedAgencies); }}>
                Start Convos!
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
  width: 1136,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  overflowY: "scroll",
  maxHeight: "870px",
  margin: 0
};

const mobileStyle = {
  position: "absolute",
  height: "100vh",
  width: "100vw",
  bgcolor: "background.paper",
  // borderRadius: "8px",
  boxShadow: 24,
  padding: "24px 0px 36px 0px",
  overflowY: "scroll",
  margin: 0
}

export default PerfectMatchModal;
