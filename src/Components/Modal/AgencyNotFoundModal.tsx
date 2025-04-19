import { Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Info } from "../../assets/Icons/info-bg.svg"

export default function AgencyNotFoundModal({ isOpen, onClose, onSubmit, loading, agency_name }) {


    const [isMobile, setIsMobile] = useState(window.innerWidth < 768 ? true : false)
    const [agencyName, setagencyName] = useState(agency_name)
    const navigate = useNavigate()

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

    useEffect(() => {
        setagencyName(agency_name)
    }, [agency_name])


    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="custom-modal"
            >
                <>
                    <div className="result-box-modal px-[24px] py-[24px] flex flex-col  bg-whiteColor" style={{ maxWidth: "480px", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", borderRadius: "12px", position: "relative" }}>
                        <Info />
                        <span className='text-[18px] font-montserrat font-semibold dark:text-white text-left' style={{ marginTop: "16px", color: "#101828" }}>Agency not listed!</span>
                        <span className='text-[14px] font-montserrat dark:text-white text-left' style={{ marginTop: "6px", color: "#475467" }}>Please confirm the agency name and submit it here.</span>
                        <span className='text-[14px] font-montserrat dark:text-white text-left' style={{ marginTop: "24px", color: "#344054", fontWeight: "500" }}> Agency name </span>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            value={agencyName}
                            onChange={(e) => { setagencyName(e.target.value) }}
                            style={{
                                outline: "none",
                                marginTop: "5px",
                                borderColor:
                                    // validationErrors.website
                                    //     ? "#F04438"
                                    //     :
                                    "#D0D5DD",
                            }}
                            className={`block w-full p-2 text-gray-900 border rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus-ring-blue-500 dark-focus-border-blue-500`}
                        />
                        <div className='w-full flex align-center justify-center gap-[16px] mt-[32px]'>
                            <button
                                className="w-[144px] bg-[#FFFFFF] px-[16px] py-[10px] rounded-[8px] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                                type="submit"
                                onClick={onClose}
                                disabled={loading}
                                style={{
                                    cursor: "pointer",
                                    border: "1px solid #D0D5DD"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                                type="submit"
                                onClick={onSubmit}
                                disabled={loading || !agencyName}
                                style={{
                                    opacity:
                                        loading || !agencyName
                                            ? 0.5
                                            : 1,
                                    cursor: "pointer",
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </>
            </Modal>


        </>
    )
}
