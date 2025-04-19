import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { usePagination } from "../../Context/PaginationContext";
import Table from "../../Components/Table/Table";
import Pagination from "../../Components/Pagination/Pagination";
import { useParams } from "react-router-dom";

const GET_LEADS = gql`
  mutation getLeads($data: LeadsListInput!) {
    getLeads(data: $data) {
      total
      data {
        id
        email
        contact
        website
        description
        created_at
        agency_id
        status
      }
    }
  }
`;
interface LeadsProps {
  pageContent?: any;
}

const Leads: React.FC<LeadsProps> = ({ pageContent }) => {
  const { currentPage, itemsPerPage, setItemPerPage } = usePagination();
  const params = useParams();
  const [leads, setLeads] = useState([]);
  const [leadsCount, setleadsCount] = useState(-1);
  const table_header = [
    { name: "created_at", title: "Date", width: "130px" },
    { name: "email", title: "Email", width: "230px" },
    { name: "contact", title: "Phone no", width: "180px" },
    { name: "website", title: "Website", width: "200px" },
    { name: "description", title: "Description", width: 130 + 230 + 180 + 200 },
  ];

  const [getLeads] = useMutation(GET_LEADS);

  const getLeadsFunc = async (page) => {
    const result = await getLeads({
      variables: {
        data: {
          page: page,
          pageSize: 5,
          agency_id: parseInt(`${params.id}`),
        },
      },
    });
    console.log(result?.data?.getLeads?.total, "result?.data?.getLeads?.total");

    setLeads(result?.data?.getLeads?.data || []);
    setleadsCount(result?.data?.getLeads?.total);
  };

  useEffect(() => {
    getLeadsFunc(currentPage);
  }, [currentPage]);

  return (
    <>
      {leads.length > 0 ? (
        <div
          id="snapshot"
          style={{ display: "flex", flexDirection: "column", width:'100%', paddingTop:'12px' }}
          className="mx-[5%] xl:mx-auto"
        >
          <h6
            className="text-[24px] font-semibold  font-inter tracking-[0.44px] mb-2"
            style={{ marginBottom: "24px" }}
          >
            Hot Leads
          </h6>
          <>
            <Table header={table_header} rows={leads} />
            {leadsCount > 5 && (
              <Pagination dataCount={leadsCount} type={"for-leads"} />
            )}
          </>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Leads;
