import React, { useState, useEffect } from 'react';
import { SearchBox } from '../Components/SearchBox';
import { useNavigate } from 'react-router-dom';
import AgencyNotFoundModal from '../Components/Modal/AgencyNotFoundModal';
import ResultentModal from '../Components/Modal/ResultentModal';

const WriteAReview = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isAgencyNotFoundModalOpen, setIsAgencyNotFoundModalOpen] = useState(false)
    const [isResultModalOpen, setIsResultModalOpen] = useState(false)
    const [agencyName, setagencyName] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className='flex items-center justify-start mt-[32px] gap-[32px]' style={{ flexDirection: "column", height: "calc(100vh - 248px)" }}>

            <AgencyNotFoundModal
                isOpen={isAgencyNotFoundModalOpen}
                onClose={() => { setIsAgencyNotFoundModalOpen(false) }}
                onSubmit={(data) => { setIsResultModalOpen(true); setIsAgencyNotFoundModalOpen(false) }}
                loading={false}
                agency_name={agencyName}
            />

            <ResultentModal
                isOpen={isResultModalOpen}
                onClose={() => { setIsResultModalOpen(false) }}
                onSubmit={(data) => { }}
                loading={false}
                verrient="for-review"
                status={"success"}
                message="Agency submitted successfully"
                disableBtn={true}
            />

            <span className=' text-[#344054] flex items-center  text-[24px] font-montserrat font-bold' style={{ lineHeight: "30px" }}>Find an agency to write a review</span>
            <SearchBox
                placeholder={'Search for an agency'}
                deactiveMobileResponsive={true}
                onSelectAgency={(agency) => {


                    if (typeof agency === "string") {
                        setagencyName(agency)
                        setIsAgencyNotFoundModalOpen(true)
                    } else {
                        navigate(`/review/${agency.id}`)
                    }

                }}
                agencieyNotListied={true}
            // onSearchTextChange={(value: string) => {
            //     onSearchTextChange(value);
            // }}
            // onSearchConfirm={}
            />
        </div>


    );

}

export default WriteAReview;

