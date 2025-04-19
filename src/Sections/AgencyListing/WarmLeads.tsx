import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { usePagination } from '../../Context/PaginationContext';
import Table from '../../Components/Table/Table';
import Pagination from '../../Components/Pagination/Pagination';
import { useParams } from 'react-router-dom';

const GET_LEADS = gql`
mutation getWarmLeads($data: WarmLeadsListInput!) {
    getWarmLeads(data: $data) {
      total
    	data {
            id
            AgencyId
            name
            website
            domain
            description
            industries
            employee_range
            founded_year
            location
            geo
            profiles
            emails
            phones
            created_at
            extra
            revenue
            technologies
            technology_categories
            monthly_visitors
            business_type
      }
    }
  }
`

function isJSON(str) {
    try {
        JSON.stringify(JSON.parse(str));
        return true;
    } catch (e) {
        return false;
    }
}

const WarmLeads = ({ pageContent }) => {


    const { currentPage, itemsPerPage, setItemPerPage } = usePagination();
    const params = useParams()
    const [leads, setLeads] = useState([])
    const [leadsCount, setleadsCount] = useState(-1)
    const table_header = [
        { name: "created_at", title: "Date", width: "130px" },
        { name: "name", title: "Company Name", width: "150px" },
        { name: "domain", title: "Company URL", width: "150px", type: "link", },
        { name: "location", title: "Location", width: "200px", type: "textarea" },
        { name: "phones", title: "Phone", width: "180px" },
        { name: "emails", title: "Emails", width: "180px" },
        // { name: "profiles", title: "Profiles", width: "180px" },
        { name: "description", title: "Description", width: 'auto', maxHeight: "120px" },
    ]


    const [getLeads] = useMutation(GET_LEADS);

    const getLeadsFunc = async (page) => {
        const result = await getLeads({
            variables: {
                data: {
                    page: page,
                    pageSize: 5,
                    agency_id: parseInt(`${params.id}`)
                }
            }
        })
        console.log(result?.data?.getWarmLeads?.total, 'result?.data?.getWarmLeads?.total');

        setLeads(result?.data?.getWarmLeads?.data?.map((lead, _) => {
            const _location = isJSON(lead.location) ? JSON.parse(lead.location) : {}
            let templocation = isJSON(lead.location) === false ? lead.location : `Address: ${_location.address || " - "}\nCity: ${_location.city || " - "}\nCountry: ${_location.country || " - "}\nPostcode: ${_location?.postcode || "-"}`
            return ({
                ...lead,
                phones: lead.phones.length > 0 && lead.phones.map((phone, p) => { if (phone && phone !== "undefined") { return (`${p > 0 ? ", " : ""}${phone}`) } }),
                emails: lead.emails.length > 0 && lead.emails.map((email, p) => { return (`${p > 0 ? ", " : ""}${email}`) }),
                location: templocation,
                created_at: parseInt(`${lead.created_at}`)
            })
        }) || [{ domain: "powerhouse.so", description: "123 321" }])
        setleadsCount(result?.data?.getWarmLeads?.total)
    }

    useEffect(() => {
        getLeadsFunc(currentPage)
    }, [currentPage])



    return (
        <>
            {
                leads.length > 0
                    ?
                    <div id='snapshot' style={{ display: "flex", flexDirection: "column", width:'100%', paddingTop:'12px' }} className='mx-[5%] xl:mx-auto'>
                        <h6 className='text-[24px] font-semibold  font-inter tracking-[0.44px] mb-2' style={{ marginBottom: "24px" }}>
                            Warm Leads
                        </h6>
                        <>
                            <Table header={table_header} rows={leads} />
                            {(leadsCount) > 5 && (
                                <Pagination
                                    dataCount={leadsCount} type={"for-leads"}
                                />
                            )}
                        </>

                    </div>
                    :
                    <></>
            }
        </>
    );
};

export default WarmLeads;
