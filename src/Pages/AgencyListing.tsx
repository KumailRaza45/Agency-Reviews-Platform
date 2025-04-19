import { gql, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import SpinnerContext from "../Context/SpinnerContext";
import { AgencyDetailsInterface } from "../Interface";
import Section1 from "../Sections/AgencyListing/Section1";
import Section2 from "../Sections/AgencyListing/Section2";
import Section3 from "../Sections/AgencyListing/Section3";
import Section4 from "../Sections/AgencyListing/Section4";
import Section5 from "../Sections/AgencyListing/Section5";
import Section6 from "../Sections/AgencyListing/Section6";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import Leads from "../Sections/AgencyListing/Leads";
import { json } from "stream/consumers";
import WarmLeads from "../Sections/AgencyListing/WarmLeads";

const GET_AGENCY = gql`
  query GetAgencyWithAnalytics($id: Float!) {
    getAgency(id: $id) {
      totalLeads
      totalVerifiedReviews
      totalReviews
      averageRating
      totalValueRating
      totalDomainRating
      totalRecommendRating
      totalCommunicationRating
      totalViews
      totalVisits
      agency {
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
          status
          ReviewsResponse {
            id
            agency_id
            comment
            user_id
            review_id
            created_on
          }
        }
        industries {
          id
          name
        }
        updated_at
      }
    }
  }
`;

const AgencyListing: React.FC = () => {
  const { showSpinner, hideSpinner } = useContext(SpinnerContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const tempId: any = id;

  const { token, user, updateSession } = useContext(UserContext);

  const { setAgency } = useContext(UserContext);
  // const agencyId = sessionStorage.getItem("agencyDataId");
  // const tempId: any = agencyId;

  const { data, loading } = useQuery(GET_AGENCY, {
    variables: { id: parseFloat(tempId) },
  });

  const [agencyData, setAgencyData] = useState<AgencyDetailsInterface>(
    data?.getAgency
  );

  useEffect(() => {
    setAgencyData(data?.getAgency);
    setAgency(data?.getAgency)
    if (data?.getAgency && !loading && data?.getAgency?.agency?.email === user?.email) {
      localStorage.setItem("user_agency", JSON.stringify(data?.getAgency))
    }

  }, [data]);

  useEffect(() => {
    const userAgency = localStorage.getItem('user_agency');
    const tempAgency: any = userAgency;


    if (tempAgency?.length > 0 && tempAgency !== 'undefined' && tempAgency !== undefined) {

      const parseAgency = JSON.parse(tempAgency);

      if (parseInt(tempId) !== parseAgency?.agency?.id) {
        navigate("/");
      }
    }

    return () => {
      hideSpinner();
    }
  }, [id])


  return (
    <>
      {loading ? (
        showSpinner()
      ) : (
        <>
          {/* {agencyData?.agency?.status === "verified" ? <Section1 message="Approved & Live" verified="true" /> : <Section1 message="Waiting for Approval - Approval can take upto 48 hours" verified="false" />} */}
          <Section2 pageContent={agencyData} />
          <Section3 pageContent={agencyData?.agency} />
          <Section4 pageContent={agencyData} />
          <WarmLeads pageContent={agencyData} />
          <Leads pageContent={agencyData} />
          <Section5 pageContent={agencyData?.agency} />
          <Section6 pageContent={agencyData?.agency} />
          {hideSpinner()}
        </>
      )}
    </>
  );
};

export default AgencyListing;
