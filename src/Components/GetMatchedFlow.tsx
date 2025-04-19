import React, { useContext, useEffect, useState } from 'react'
import GetMatched from './GetMatchedModal/GetMatchedModal'
import PerfectMatchModal from './Modal/PerfectMatchModal/Modal'

import { ReactComponent as Check } from "../assets/Icons/check-square.svg";
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { BeatLoader } from 'react-spinners'
import ResultentModal from './Modal/ResultentModal'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'


export const GET_PERFECT_MATCHED = gql`
    query getTopMatchedAgencies($services: [Int!]!, $count: Int!, $agency: Int!) {
        getTopMatchedAgencies(services: $services, count: $count, agency: $agency) {
            agencies{
                id
                name
                tagline
                email
                logo_url
                bio
                website
                retainer_size
                headquarter_address
                address
                address2
                logo
                total_ratings
                total_views
                total_visits
                total_reviews
                employees
                status
                is_verified
                portfolio {
                title
                image_url_1
                image_url_2
                }
                services {
                service {
                    name
                }
                }
                agencyReview {
                id
                value_rating
                communication_rating
                domain_rating
                recommend_rating
                location
                created_at
                pros
                cons
                }
                industries {
                id
                name
                }
                minorities {
                id
                name
                }
                updated_at
            }
        }
    }
`

export const SEND_BULK_LEADS = gql`
    mutation CreateManyLead($data: [CreateLeadInput!]!){
        createManyLead(data: $data){
            status
        }
    }
`
// [{ email: "abc@xyz.com", contact: "0123456789", website: "abc.com", description: "ad", agency_id: 1.0, status: "received" }]

export default function GetMatchedFlow({ isInMenuBar, onClick, selectedIndex }: { isInMenuBar?: any, onClick?: any, selectedIndex?: any }) {


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [screenSize] = useState(() => {
        if (window.innerWidth < 514) {
            return 'MOBILE';
        }
        if (window.innerWidth < 768) {
            return 'TAB';
        }
        return 'LARGE';
    });
    const [isOpenGetMatchedModal, setIsOpenGetMatchedModal] = useState(false)
    const [isOpenPerfectMatchedModal, setisOpenPerfectMatchedModal] = useState(false)
    const [getMatchQuizzData, setGetMatchQuizzData] = useState<any>(null)
    const [sendingLeadsLoading, setSendingLeadsLoading] = useState(false)
    const [isResultModalOpen, setIsResultModalOpen] = useState(false)
    const [isFailedResultModalOpen, setIsFailedResultModalOpen] = useState(false)
    const navigate = useNavigate();

    const { setIsGetMatchedBtnClicked, isGetMatchedBtnClicked } = useContext(UserContext);

    const [getPerfectMatched, { loading: getMatchedAgenciesLoading, data: perfectMactchedAgencies, error },] = useLazyQuery(GET_PERFECT_MATCHED);
    const [sendBulkLeads] = useMutation(SEND_BULK_LEADS);


    // useEffect(() => {
    //     if (location.pathname === "/" && !isInMenuBar && !sessionStorage.getItem("getMatchedItration")) {
    //         setIsOpenGetMatchedModal(true)
    //     }
    // }, [location.pathname, isInMenuBar])

    const onsubmitQuizz = async (data) => {
        console.log(data, "data");
        try {
            const res = await getPerfectMatched({
                variables: {
                    services: [data.services],
                    count: 3,
                    agency: 0
                },
            });
            console.log(res, "res");

            if (res.error || !res.data || res?.data?.getTopMatchedAgencies?.agencies.length === 0) {
                setIsOpenGetMatchedModal(false)
                setIsFailedResultModalOpen(true)
            }
            else {
                setGetMatchQuizzData(data)
                setIsOpenGetMatchedModal(false)
                setisOpenPerfectMatchedModal(true)
            }


        } catch (error) {
            setIsOpenGetMatchedModal(false)
            setIsFailedResultModalOpen(true)
        }


    }

    const sendLeads = async (agencies: []) => {

        console.log(agencies, "agencies");

        let _data = agencies.map((_agency: any) => {
            return { email: getMatchQuizzData?.email, contact: "", website: getMatchQuizzData?.website, description: getMatchQuizzData?.description, agency_id: _agency.id, status: "received" }
        })
        setSendingLeadsLoading(true)
        try {
            await sendBulkLeads({
                variables: {
                    data: [..._data]
                },
            });
            setSendingLeadsLoading(false)
            setisOpenPerfectMatchedModal(false)
            setIsResultModalOpen(true)
        } catch {

        }

    }


    return (
        <div>
            <GetMatched
                isOpen={isOpenGetMatchedModal}
                onClose={() => { setIsOpenGetMatchedModal(false); if (onClick) { onClick(); }; sessionStorage.setItem("getMatchedItration", "1") }}
                onSubmitQuizz={(data) => { onsubmitQuizz(data); sessionStorage.setItem("getMatchedItration", "1") }}
                loading={getMatchedAgenciesLoading}
            />

            <PerfectMatchModal
                agencies={perfectMactchedAgencies?.getTopMatchedAgencies?.agencies || []}
                isOpen={isOpenPerfectMatchedModal}
                onClose={() => { setisOpenPerfectMatchedModal(false); if (onClick) { onClick(); } }}
                onSubmit={(agencies) => {
                    sendLeads(agencies)
                }}
                loading={sendingLeadsLoading}
            />

            <ResultentModal
                isOpen={isResultModalOpen}
                onClose={() => { setIsResultModalOpen(false) }}
                onSubmit={(data) => { navigate(`/listing/?services=${getMatchQuizzData?.services}`); setIsResultModalOpen(false); if (onClick) { onClick(); }; window.location.reload() }}
                loading={false}
                verrient="default"
                status={"success"}
                message="Your details have been shared successfully. You should hear back soon."
                disableBtn={true}
            />

            <ResultentModal
                isOpen={isFailedResultModalOpen}
                verrient="default"
                onClose={() => { setIsFailedResultModalOpen(false) }}
                onSubmit={(data) => {
                    navigate(`/listing/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`); setIsFailedResultModalOpen(false); if (onClick) { onClick(); }
                }}
                loading={false}
                status={"fail"}
                message="We don't have enough top-rated agencies that meet your needs, yet."
                disableBtn={true}
            />

            {
                isInMenuBar
                    ?
                    <div className='w-full flex' onClick={() => { setIsOpenGetMatchedModal(true); }}>
                        <Check
                            height={24}
                            width={24}
                            style={{ marginRight: "12px", stroke: selectedIndex ? "#17B26A" : "#344054" }}
                        // className="hover:stroke-[#17B26A]"
                        />
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontSize: "16px",
                                fontWeight: "500",
                                color:
                                    selectedIndex ? "#17B26A" : "#344054",
                            }}

                        >
                            Get Matched
                        </span>
                    </div>
                    :
                    <button
                        className="button bg-[#20c678] px-[16px] py-[10px] rounded-[8px]  text-[#FFFFFF] flex items-center justify-between text-[14px] font-montserrat font-bold" style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
                        type="submit"
                        onClick={() => { setIsOpenGetMatchedModal(true) }}
                    >
                        Get Matched
                    </button>
            }



        </div>
    )
}
