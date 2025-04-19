import { gql, useLazyQuery } from "@apollo/client";
import React, { ChangeEvent, useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useLocation, useFetcher } from "react-router-dom";
import Pagination from "../Components/Pagination/Pagination";
import { usePagination } from "../Context/PaginationContext";
import Loading from "../Loading";
import Section2 from "../Sections/Home/Section2";
import Sections3 from "../Sections/Home/Sections3";
import { useMutation } from "@apollo/client";
import MiscContext from "../Context/MiscContext";
import { cleanObject } from "../Utilities/utilities";
import { BeatLoader } from 'react-spinners';
import GoogleAnalyticsContext from "../Context/GoogleAnalyticsContext";

const GET_FILTERED_AGENCIES = gql`
  query GetAgenciesByStatusAndFilters(
    $status: String
    $review_rating: Int
    $services: [Int!]
    $industries: [String!]
    $ownership: [String!]
    $employee: Int
    $search_text: String
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
      search_text: $search_text
      retainer_size: $retainer_size
      skip: $skip
      take: $take
      sort: $sort
    ) {
      totalCount
      filteredCount
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
`;

export const INCREMENT_AGENCY_VIEWS = gql`
  mutation IncrementAgencyViews($id: Float!) {
    incrementAgencyViews(id: $id) {
      id
      name
      total_views
    }
  }
`;

const MAX_PAGE_SIZE = 10;

const AgencyList: React.FC = () => {
  // const { currentPage, itemsPerPage } = usePagination();
  const [pageOffset, setPageOffset] = useState<number>(0);

  const [isListShouldUpdated, setIsListShouldUpdated] = useState<boolean>(false);
  const [incrementAgencyViews] = useMutation(INCREMENT_AGENCY_VIEWS);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const agencyHash = useRef({});

  const [agenciesData, setAgenciesData] = useState<{ agencies: [key: string][], filteredCount: number, totalCount: number }>({
    agencies: [],
    filteredCount: 0,
    totalCount: 0
  });

  const [
    agenciesSortAndFilter,
    { loading: filtersLoading, data: filteredData, error },
  ] = useLazyQuery(GET_FILTERED_AGENCIES, { fetchPolicy: 'no-cache', refetchWritePolicy: 'overwrite' });

  const [services, setServices] = useState<boolean>(false);
  const [sort, setSort] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>("ranking");
  const [moreFilter, setMoreFilter] = useState<boolean>(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<any[]>([]);
  const [industryCheckboxes, setindustryCheckboxes] = useState<string[]>([]);
  const [ownerShipCheckboxes, setOwnershipCheckboxes] = useState<string[]>([]);
  const [Costselected, setCostSelected] = useState<number | null>(null);
  const [HeadCountselected, setHeadCountSelected] = useState<number | null>(
    null
  );
  const [maxLimitReached, setMaxLimitReached] = useState(false)
  const [Rattingselected, setRattingSelected] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const { agencyFilters, setAgencyFilters } = useContext(MiscContext);
  const { sendGoogleAnalytics } = useContext(GoogleAnalyticsContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setSelectedCheckboxes((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
    setIsListShouldUpdated(true)
  };
  const handleServiceChange = (index) => {
    setSelectedCheckboxes((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((item) => item !== index);
      } else {
        return [...prevSelected, index];
      }
    });
    setIsListShouldUpdated(true)
  };

  const resetServices = () => {
    setSelectedCheckboxes([]);
    setAgencyFilters({ ...agencyFilters, selectedCheckboxes: [] });
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
  
  const IndustryExpertCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setindustryCheckboxes((prevSelected) => {
      if (prevSelected.includes(value)) {
        setAgencyFilters({
          ...agencyFilters,
          industryCheckboxes: prevSelected.filter((item) => item !== value),
        });
        return prevSelected.filter((item) => item !== value);
      } else {
        setAgencyFilters({
          ...agencyFilters,
          industryCheckboxes: [...prevSelected, value],
        });
        return [...prevSelected, value];
      }
    });
  };
  const IndustryExpertReset = () => {
    setindustryCheckboxes([]);
    setAgencyFilters({ ...agencyFilters, industryCheckboxes: [] });
  };
  // Ownership
  const OwnershipExpertCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setOwnershipCheckboxes((prevSelected) => {
      if (prevSelected.includes(value)) {
        setAgencyFilters({
          ...agencyFilters,
          ownerShipCheckboxes: prevSelected.filter((item) => item !== value),
        });
        return prevSelected.filter((item) => item !== value);
      } else {
        setAgencyFilters({
          ...agencyFilters,
          ownerShipCheckboxes: [...prevSelected, value],
        });
        return [...prevSelected, value];
      }
    });
  };
  const OwnerShipReset = () => {
    setOwnershipCheckboxes([]);
    setAgencyFilters({ ...agencyFilters, ownerShipCheckboxes: [] });
  };

  // Cost
  const handleCostSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCostSelected(parseInt(event.target.value));
    setAgencyFilters({
      ...agencyFilters,
      Costselected: parseInt(event.target.value),
    });
  };
  const CostReset = () => {
    setCostSelected(null);
    setAgencyFilters({ ...agencyFilters, Costselected: null });
  };

  // Cost

  const handleHeadCountSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeadCountSelected(parseInt(event.target.value));
    setAgencyFilters({
      ...agencyFilters,
      HeadCountselected: parseInt(event.target.value),
    });
  };
  const HeadCountReset = () => {
    setHeadCountSelected(null);
    setAgencyFilters({ ...agencyFilters, HeadCountselected: null });
  };

  // Cost
  const handleRattingSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRattingSelected(parseInt(event.target.value));
    setAgencyFilters({
      ...agencyFilters,
      Rattingselected: parseInt(event.target.value),
    });
  };
  const RattingReset = () => {
    setRattingSelected(null);
    setAgencyFilters({ ...agencyFilters, Rattingselected: null });
  };

  const handleClearSelectedFilter = () => {
    setRattingSelected(null);
    setHeadCountSelected(null);
    setCostSelected(null);
    setOwnershipCheckboxes([]);
    setindustryCheckboxes([]);
    setSelectedCheckboxes([]);
    setAgencyFilters({
      ...agencyFilters,
      industryCheckboxes: [],
      ownerShipCheckboxes: [],
      selectedCheckboxes: [],
      Costselected: null,
      HeadCountselected: null,
      Rattingselected: null,
    });
  };

  useEffect(() => {
    setindustryCheckboxes(agencyFilters.industryCheckboxes);
    setOwnershipCheckboxes(agencyFilters.ownerShipCheckboxes);
    setCostSelected(agencyFilters.Costselected);
    setHeadCountSelected(agencyFilters.HeadCountselected);
    setRattingSelected(agencyFilters.Rattingselected);
  }, []);

  const handleSort = (value: any) => {
    setSortValue(value);
    const data = {
      services: selectedCheckboxes,
      industries: industryCheckboxes,
      ownership: ownerShipCheckboxes,
      review_rating: Rattingselected,
      employee: HeadCountselected,
      retainer_size: Costselected,
      sort: value,
      search_text: searchText
    };
    setAgenciesData({ agencies: [], filteredCount: 0, totalCount: 0 })
    agencyHash.current = {}
    agenciesSortAndFilter({
      variables: {
        ...data,
        skip: 0,
        take: MAX_PAGE_SIZE,
      },
    });
    setPageOffset(0)
    setMoreFilter(false);
    setServices(false);
    setSort(false);

    const queryParams: any = cleanObject(data);

    navigate(`?${new URLSearchParams(queryParams)}`);
  };

  const handleRemoveClick = (valueToRemove: number) => {
    setSelectedCheckboxes((prevSelected) =>
      prevSelected.filter((item) => item !== valueToRemove)
    );
    setIsListShouldUpdated(false)

    const updatedSelectedCheckboxes = selectedCheckboxes.filter(
      (item) => item !== valueToRemove
    );

    let data = {
      services: updatedSelectedCheckboxes,
      industries: industryCheckboxes,
      ownership: ownerShipCheckboxes,
      review_rating: Rattingselected,
      employee: HeadCountselected,
      retainer_size: Costselected,
      search_text: searchText
    };
    setAgenciesData({ agencies: [], filteredCount: 0, totalCount: 0 });
    agencyHash.current = {};
    agenciesSortAndFilter({
      variables: {
        ...data,
        skip: 0,
        take: MAX_PAGE_SIZE,
        sort: sortValue,
      },
    });
    setPageOffset(0)
    const queryParams: any = cleanObject(data);
    navigate(`?${new URLSearchParams(queryParams)}`);
  };

  const handleClearServicesSelectedFilter = () => {
    setSelectedCheckboxes([]);
    setIsListShouldUpdated(true)
  };

  const handleSubmit = () => {
    const data = {
      services: selectedCheckboxes,
      industries: industryCheckboxes,
      ownership: ownerShipCheckboxes,
      review_rating: Rattingselected,
      employee: HeadCountselected,
      sort: sortValue,
      retainer_size: Costselected,
      search_text: searchText
    };
    setAgenciesData({ agencies: [], filteredCount: 0, totalCount: 0 });
    agencyHash.current = {};
    agenciesSortAndFilter({
      variables: {
        ...data,
        skip: 0,
        take: MAX_PAGE_SIZE,
      },
    });
    setPageOffset(0)
    setMoreFilter(false);
    setServices(false);
    setSort(false);

    const queryParams: any = cleanObject(data);

    navigate(`?${new URLSearchParams(queryParams)}`);
  };

  const handleClearAllFilterSubmit = () => {
    const data = {
      services: [],
      sort: sortValue,
      industries: [],
      ownership: [],
      review_rating: null,
      employee: null,
      retainer_size: null,
      search_text: null
    };
    setAgenciesData({ agencies: [], filteredCount: 0, totalCount: 0 });
    agencyHash.current = {};
    agenciesSortAndFilter({
      variables: {
        ...data,
        skip: 0,
        take: MAX_PAGE_SIZE,
        sort: sortValue,
      },
    });
    setPageOffset(0)
    setMoreFilter(false);
    setServices(false);
    setSort(false);

    const queryParams: any = cleanObject(data);

    navigate(`?${new URLSearchParams(queryParams)}`);
  };

  useEffect(() => {

    if (window.innerWidth > 786 && isListShouldUpdated) {
      // console.log(selectedCheckboxes, "selectedCheckboxes");

      handleSubmit()
      setIsListShouldUpdated(false)
    }

  }, [selectedCheckboxes, isListShouldUpdated]);

  useEffect(() => {


    const queryParams = new URLSearchParams(location.search);

    let services: Array<number> | [] = [];
    let industries: Array<string> | [] = [];
    let ownership: Array<string> | [] = [];
    let review_rating: number | null = null;
    let employee: number | null = null;
    let retainer_size: number | null = null;
    let sort_value = sortValue;

    if (queryParams.get("services")) {
      const params: string | null = queryParams.get("services");
      if (params) {
        services = params.split(",").map((str) => parseInt(str));
      }
      setSelectedCheckboxes(services);
      setIsListShouldUpdated(false)
    }

    if (queryParams.get("sort")) {
      const params: string | null = queryParams.get("sort");
      if (params) {
        sort_value = params;
      }
      setSortValue(sort_value);
    }

    if (queryParams.get("industries")) {
      const params: string | null = queryParams.get("industries");
      if (params) {
        industries = params.split(",");
      }
      setindustryCheckboxes(industries);
    }
    if (queryParams.get("ownership")) {
      const params: string | null = queryParams.get("ownership");
      if (params) {
        ownership = params.split(",");
      }
      setOwnershipCheckboxes(ownership);
    }
    if (queryParams.get("review_rating")) {
      const params: string | null = queryParams.get("review_rating");
      if (params) {
        review_rating = parseInt(params);
      }
      setRattingSelected(review_rating);
    }
    if (queryParams.get("employee")) {
      const params: string | null = queryParams.get("employee");
      if (params) {
        employee = parseInt(params);
      }
      setHeadCountSelected(employee);
    }
    if (queryParams.get("retainer_size")) {
      const params: string | null = queryParams.get("retainer_size");
      if (params) {
        retainer_size = parseInt(params);
      }
      setCostSelected(retainer_size);
    }

    agenciesSortAndFilter({
      variables: {
        skip: pageOffset,
        take: MAX_PAGE_SIZE,
        services: services.length ? services : selectedCheckboxes,
        industries: industries.length ? industries : industryCheckboxes,
        ownership: ownership.length ? ownership : ownerShipCheckboxes,
        review_rating: review_rating ? review_rating : Rattingselected,
        employee: employee ? employee : HeadCountselected,
        retainer_size: retainer_size ? retainer_size : Costselected,
        sort: sort_value,
        search_text: searchText
      },
    });

  }, [pageOffset]);

  useEffect(() => {
    if (filteredData?.agenciesSortAndFilter?.agencies) {

      const uniqueNewAgencies = filteredData?.agenciesSortAndFilter?.agencies?.filter((agency) => {
        if (!agencyHash.current[agency.id]) {
          agencyHash.current[agency.id] = true
          return true;
        }
        return false;
      });


      setAgenciesData((prevData) => ({
        ...prevData,
        ...filteredData?.agenciesSortAndFilter,
        agencies: [...prevData.agencies, ...uniqueNewAgencies],
      }));

      // console.log(filteredData?.agenciesSortAndFilter?.agencies.length, "filteredData?.agenciesSortAndFilter?.agencies.length");

      if (filteredData?.agenciesSortAndFilter?.agencies.length < 10) {
        setMaxLimitReached(true)
      }
      else {
        setMaxLimitReached(false)
      }
      // setAgenciesData([...agenciesData, ...filteredData?.agenciesSortAndFilter?.agencies]);
    }

  }, [filteredData]);

  // Add an event listener to detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Calculate the scroll position and page height
      const scrollPosition = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Check if the scroll position is near the bottom
      const isBottom = scrollPosition >= pageHeight - 100; // Adjust the threshold as needed

      if (!filtersLoading) {
        setInitialLoad(false);
        setIsAtBottom(isBottom);
      }

    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {

    console.log(isAtBottom, pageOffset, "isAtBottom");

    if (!isAtBottom) {
      return;
    }

    console.log(filtersLoading, maxLimitReached, "!filtersLoading && !maxLimitReached");

    if (!filtersLoading) {
      // if (pageOffset >= agenciesData.totalCount) return;
      // const nextPage = agenciesData.totalCount / MAX_PAGE_SIZE >= MAX_PAGE_SIZE ? MAX_PAGE_SIZE : agenciesData.totalCount;
      // console.log({ nextPage });
      if (!maxLimitReached) {
        setPageOffset(pageOffset + 10)
      }

      // setPageLimit(() => pageLimit + nextPage);
    }

    // setIsAtBottom(false)

  }, [isAtBottom]);

  // useEffect(() => {

  //   handleSubmit();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchText]);

  useEffect(() => {
    sendGoogleAnalytics({ capturedAction: "home_page" })
  }, [])


  useEffect(() => {
    console.log(agenciesData, "agenciesData");

  }, [agenciesData])



  if (error) return <p>Error: {error.message}</p>;
  if (filtersLoading && initialLoad) return <Loading />;

  return (
    <>
      <Section2
        services={services}
        setServices={setServices}
        setMoreFilter={setMoreFilter}
        setSort={setSort}
        selectedCheckboxes={selectedCheckboxes}
        handleCheckboxChange={handleCheckboxChange}
        handleServiceChange={handleServiceChange}
        resetServices={resetServices}
        handleClearServicesSelectedFilter={handleClearServicesSelectedFilter}
        handleSubmit={handleSubmit}
        moreFilter={moreFilter}
        industryCheckboxes={industryCheckboxes}
        IndustryExpertCheckboxChange={IndustryExpertCheckboxChange}
        IndustryExpertReset={IndustryExpertReset}
        OwnershipExpertCheckboxChange={OwnershipExpertCheckboxChange}
        OwnerShipReset={OwnerShipReset}
        handleCostSelected={handleCostSelected}
        ownerShipCheckboxes={ownerShipCheckboxes}
        Costselected={Costselected}
        CostReset={CostReset}
        HeadCountselected={HeadCountselected}
        handleHeadCountSelected={handleHeadCountSelected}
        HeadCountReset={HeadCountReset}
        Rattingselected={Rattingselected}
        handleRattingSelected={handleRattingSelected}
        RattingReset={RattingReset}
        handleClearSelectedFilter={handleClearSelectedFilter}
        handleClearAllFilterSubmit={handleClearAllFilterSubmit}
        handleRemoveClick={handleRemoveClick}
        sort={sort}
        handleSort={handleSort}
        dataCount={[filteredData?.agenciesSortAndFilter.filteredCount]}
        totalCount={[filteredData?.agenciesSortAndFilter.totalCount]}
        onSearchTextChange={(value:string) => setSearchText(value)}
        onSearch={() => {
          handleSubmit();
        }}
      />
      {agenciesData &&
        agenciesData?.agencies?.length > 0 ? (
        // {filteredData &&
        //   filteredData?.agenciesSortAndFilter &&
        //   filteredData?.agenciesSortAndFilter?.agencies &&
        //   filteredData?.agenciesSortAndFilter?.agencies?.length > 0 ? (
        <>
          <Sections3
            agencyData={agenciesData}
            incrementAgencyViews={handleIncrementViews}
          />

          {/* {filteredData?.agenciesSortAndFilter.totalCount > 10 && (
            <Pagination
              type={""}
              dataCount={[filteredData?.agenciesSortAndFilter.totalCount]}
            />
          )} */}
        </>
      ) : (
        <div className="w-[100%] flex" style={{ justifyContent: "center" }}>
          <span
            className="text-gray700 font-montserrat"
            style={{ fontWeight: "500", fontSize: "24px" }}
          >
            {!filtersLoading && "No results found"}
          </span>
        </div>
      )}

      {
        filtersLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: "50px" }}>
            <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
          </div>
        ) : null
      }
    </>
  );
};
export default AgencyList;
