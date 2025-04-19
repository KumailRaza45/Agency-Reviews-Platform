import React, { useContext, useEffect, useMemo, useState } from 'react';
import Section2 from '../Sections/AgencyDetails/Section2';
import Section3 from '../Sections/AgencyDetails/Section3';
import Section4 from '../Sections/AgencyDetails/Section4';
import Section5 from '../Sections/AgencyDetails/Section5';
import Section6 from '../Sections/AgencyDetails/Section6';
import Section7 from '../Sections/AgencyDetails/Section7';
// import Pagination from '../Components/Pagination/Pagination';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import SpinnerContext from '../Context/SpinnerContext';
// import { AgencyDetailsInterface } from '../Interface';
import Section1 from '../Sections/AgencyDetails/Section1';
import Section8 from '../Sections/AgencyDetails/Section8';
import Slider from '../Sections/AgencyDetails/Slider';
import { calculateRating } from '../Utilities/utilities';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

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
			total_review_rating
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
				employees
				status
				is_verified
				sales_email
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

const GET_FILTERED_AGENCIES = gql`
	query GetAgenciesByStatusAndFilters(
		$status: String
		$review_rating: Int
		$services: [Int!]
		$industries: [String!]
		$ownership: [String!]
		$employee: Int
		$retainer_size: Int
		$skip: Int
		$take: Int
		$sort: String
	) {
		agenciesSortAndFilter(
			status: $status
			review_rating: $review_rating
			services: $services
			industries: $industries
			ownership: $ownership
			employee: $employee
			retainer_size: $retainer_size
			skip: $skip
			take: $take
			sort: $sort
		) {
			totalCount
			agencies {
				total_review_rating
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
`;

const INCREMENT_AGENCY_VISITS = gql`
  mutation IncrementAgencyVisit($id: Int!) {
    incrementAgencyVisits(id: $id) {
      id
      name
      total_views
    }
  }
`;

const ADD_WARM_LEAD = gql`
 mutation CreateAgencyWarmLead($data: CreateWarmLeadsInput!) {
    createAgencyWarmLead(data: $data) {
      id
    }
  }
`;

const AgencyDetails = () => {
	const { id } = useParams();
	const [incrementAgencyVisit] = useMutation(INCREMENT_AGENCY_VISITS);
	const [addWarmLead] = useMutation(ADD_WARM_LEAD);

	const handleIncrementViews = async (id) => {
		const tempId = parseFloat(id)
		try {
			const result = await incrementAgencyVisit({
				variables: { id: tempId },
			});
			console.log('Mutation Result:', result);
		} catch (error) {
			console.error('Mutation Error:', error);
		}
	};
	const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);
	const tempId = id;
	const [
		agenciesSortAndFilter,
		{ loading: filtersLoading, data: filteredData, error },
	] = useLazyQuery(GET_FILTERED_AGENCIES);
	const { data, loading } = useQuery(GET_AGENCY, {
		variables: { id: parseFloat(tempId) },
	});


	const [agencyDetailsData, setAgencyDetailsData] = useState(data?.getAgency);
	const [verifiedReviews, setVerifiedReviews] = useState(data?.getAgency?.agencyReview)
	const [verifiedAgencyDetailsData, setverifiedAgencyDetailsData] = useState(data?.getAgency);
	const [isWarmLeadAdded, setIsWarmLeadAdded] = useState(false)

	useEffect(() => {
		setAgencyDetailsData(data?.getAgency);
		const verifiedAgency = filteredData?.agenciesSortAndFilter.agencies.filter(
			(agencies) => agencies.status == "verified",
		);
		setverifiedAgencyDetailsData(verifiedAgency);
		console.log('verifiedAgency', verifiedAgency);
		sessionStorage.setItem('agencyDetails', JSON.stringify(data));
		agenciesSortAndFilter({
			variables: {
				services: [],
				industries: [],
				ownership: [],
				review_rating: 0,
				employee: 0,
				retainer_size: 0,
				skip: 0,
				take: 1000,
			},
		});
	}, [data, filteredData]);


	useEffect(() => {
		setVerifiedReviews((prev) => (data?.getAgency.agency.agencyReview));
	}, [data])

	function compareByRating(a, b) {
		const ratingA = calculateRating(a);
		const ratingB = calculateRating(b);
		return ratingB - ratingA;
	}
	const handleSort = (value) => {
		let dataFilter;
		if (value === 'By Date') {
			dataFilter = verifiedReviews?.filter((review) => review.status === 'verified').sort((a, b) => new Date(a.created_at).setHours(0, 0, 0, 0) - new Date(b.created_at).setHours(0, 0, 0, 0));
		} else if (value === 'Ranking') {
			dataFilter = verifiedReviews?.filter((review) => review.status === 'verified').sort(compareByRating)
		}
		setVerifiedReviews(dataFilter)
	}


	const addLead = async (company) => {
		let rapidResponse
		try {
			if (company?.domain) {
				rapidResponse = await axios.request({
					method: 'GET',
					url: 'https://companies3.p.rapidapi.com/v2/company',
					params: { query: `${company?.domain}` },
					headers: {
						'X-RapidAPI-Key': '62e4b657bbmsh3047fe7f78a1ff2p19308cjsn136415284edb',
						'X-RapidAPI-Host': 'companies3.p.rapidapi.com'
					}
				});
			}
		} catch (error) {

		}

		console.log(rapidResponse?.data, "rapidResponse");

		await addWarmLead({
			variables: {
				data: {
					AgencyId: parseInt(`${id}`),
					name: company?.name || rapidResponse?.data?.name || "",
					website: "",
					domain: company?.domain || rapidResponse?.data?.domain || "",
					description: company?.description || rapidResponse?.data?.description || "",
					industries: company?.industry ? [company?.industry] : rapidResponse?.data?.industries ? rapidResponse?.data?.industries : [],
					employee_range: company?.employee_range || rapidResponse?.data?.staff_range || "",
					founded_year: `${company?.founded_year}` || `${rapidResponse?.data?.founded}` || "",
					location: company?.location ? company?.location : rapidResponse?.data?.location ? JSON.stringify(rapidResponse?.data?.location) : "",
					geo: company?.geo ? JSON.stringify(company?.geo) : "",
					profiles: company?.profiles ? JSON.stringify(company?.profiles) : rapidResponse?.data?.social_networks ? JSON.stringify(rapidResponse?.data?.social_networks) : "",
					emails: company?.emails || [],
					phones: company?.phones ? company?.phones : rapidResponse?.data?.phone_number ? [`${rapidResponse?.data?.phone_number}`] : [],
					revenue: rapidResponse?.data?.revenue || "",
					technologies: rapidResponse?.data?.technologies || [],
					technology_categories: rapidResponse?.data?.technology_categories || [],
					monthly_visitors: rapidResponse?.data?.monthly_visitors || "",
					business_type: rapidResponse?.data?.business_type || "",
					extra: ""
				}
			},
		});
		setIsWarmLeadAdded(true)
	}

	useEffect(() => {
		console.log("Hello World");
		if (window.reactCallback && agencyDetailsData?.agency?.status === 'verified' && !isWarmLeadAdded) {
			console.log(window.reactCallback(), "123");
			let company = window.reactCallback()
			if (company) {
				addLead(company)
			}

		}

	}, [window.reactCallback, agencyDetailsData?.agency?.status, isWarmLeadAdded])


	return (
		<>
			<Helmet>
				<meta property="og:title" content={`${agencyDetailsData?.agency?.name}- Agency Reviews`} />
			</Helmet>

			{/* {
				snidCall
			} */}
			{loading ? (
				showSpinner()
			) : (
				<>
					{/* {agencyDetailsData?.agency?.status === 'unverified' && <Section1 />} */}
					<Section2 pageContent={agencyDetailsData?.agency}
					/>
					<Section3 pageContent={agencyDetailsData?.agency} />
					<Section5 pageContent={agencyDetailsData} />
					{agencyDetailsData?.agency?.status === 'verified' ? (
						<Section4 pageContent={agencyDetailsData?.agency} />
					) : (
						<Section8 pageContent={verifiedAgencyDetailsData} />
					)}
					<Section6 pageContent={agencyDetailsData?.agency} handleSort={handleSort} />
					<Section7 pageContent={verifiedReviews} />
					{hideSpinner()}
				</>
			)}
			{/* <Pagination /> */}

		</>

	);
};

export default AgencyDetails;
