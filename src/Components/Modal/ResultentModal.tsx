import { Modal } from '@mui/material'
import { Checkmark } from 'react-checkmark'
import { ReactComponent as CrossBtnIcon } from "../../assets/Icons/x-btn.svg";

import { ReactComponent as WarningIcon } from "../../assets/Icons/warning.svg";
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import GetMatchedFlow from '../GetMatchedFlow';

export default function ResultentModal({ isOpen, onClose, onSubmit, loading, status, message, disableBtn, verrient }) {


    const [isMobile, setIsMobile] = useState(window.innerWidth < 768 ? true : false)
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
                    <div className="result-box-modal px-[24px] py-[24px] flex  bg-whiteColor" style={{ height: "400px", maxWidth: "520px", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "12px", position: "relative" }}>
                        <div
                            role="button"
                            onClick={onClose}
                            className="absolute right-[10px] top-[10px]"
                        >
                            <CrossBtnIcon />
                        </div>

                        <div className='flex' style={{ flexDirection: "column", gap: "24px" }}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                {
                                    status === "success"
                                        ?
                                        <Checkmark size={isMobile ? '64px' : '120px'} />
                                        :
                                        <WarningIcon height={isMobile ? 64 : 120} width={isMobile ? 64 : 120} />
                                }
                            </div>
                            <span className='font-inter text-[18px] ' style={{ maxWidth: "376px", textAlign: "center", lineHeight: "28px", color: "#344054", fontWeight: "600", alignSelf: "center" }}>{message}</span>
                            {
                                verrient === "for-review"
                                    ?
                                    <div className='p-[24px] pb-[0px] flex justify-center flex-col gap-[24px]' style={{ borderTop: "1px solid #D0D5DD" }}>
                                        <span style={{ textAlign: "center" }}>Would you like to?</span>
                                        <div className='flex gap-[16px]'>
                                            <GetMatchedFlow onClick={() => { onClose() }} />
                                            <button
                                                className="button h-[44px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px]  text-[#FFFFFF] flex items-center justify-between text-[14px] font-montserrat font-semibold"
                                                style={{ width: "max-content", alignSelf: "center" }}
                                                type="submit"
                                                onClick={() => { onClose(); navigate("/write-a-review") }}
                                            >
                                                Review another agency
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <button
                                        className="button h-[44px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px]  text-[#FFFFFF] flex items-center justify-between text-[14px] font-montserrat font-semibold"
                                        style={{ width: "max-content", alignSelf: "center" }}
                                        type="submit"
                                        onClick={() => { onSubmit() }}
                                    >
                                        Browse more agencies
                                    </button>
                            }
                        </div>
                    </div>
                </>
            </Modal>


        </>
    )
}
