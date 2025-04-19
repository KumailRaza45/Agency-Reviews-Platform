import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpinnerContext from "../Context/SpinnerContext";
import { UpdatedFormData } from "../Interface";
import Section2 from "../Sections/CreateAgency/Section2";
import Section4 from "../Sections/CreateAgency/Section4";
import Step1 from "../Sections/CreateAgency/Steps/Step1";
import Step2 from "../Sections/CreateAgency/Steps/Step2";
import Step3 from "../Sections/CreateAgency/Steps/Step3";
import { Employees, Retainer } from "../Utilities/utilities";
import EditListingDetails from "../Sections/CreateAgency/EditListingDetails";
import EditCompanyDetails from "../Sections/CreateAgency/EditCompanyDetails";
import ToastContext from "../Context/ToastContext";

export const UPDATE_AGENCY = gql`
  mutation UpdateAgency($id: Float!, $data: UpdateAgencyInput!) {
    updateAgency(id: $id, data: $data) {
      id
      name
      tagline
      status
      is_verified
    }
  }
`;

export const UPDATE_INDUSTRY = gql`
  mutation UpdateAgencyIndustries(
    $agencyId: Int!
    $data: [CreateAgencyIndustryInput!]!
  ) {
    updateAgencyIndustries(agencyId: $agencyId, data: $data) {
      id
      name
      created_at
      agency_id
    }
  }
`;

export const UPDATE_MINORITY = gql`
  mutation UpdateAgencyMinorities(
    $agencyId: Int!
    $data: [CreateAgencyMinoritiesInput!]!
  ) {
    updateAgencyMinorities(agencyId: $agencyId, data: $data) {
      id
      name
      created_at
      agency_id
    }
  }
`;

const GET_AGENCY = gql`
  query GetAgencyWithAnalytics($id: Float!) {
    getAgency(id: $id) {
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
            id
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
        minorities {
          id
          name
        }
        updated_at
      }
    }
  }
`;

const EditAgency: React.FC = () => {
  // Create instance of auth0 to manage webAuth

  const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);
  const { id } = useParams();
  const tempId: any = id;
  const navigate = useNavigate();

  const [updateAgency, { data }] = useMutation(UPDATE_AGENCY);

  const { data: getAgencyData, loading } = useQuery(GET_AGENCY, {
    variables: { id: parseFloat(tempId) },
  });

  console.log(getAgencyData, "agencyData1234");
  const [updateAgencyIndustry] = useMutation(UPDATE_INDUSTRY);
  const [updateAgencyMinority] = useMutation(UPDATE_MINORITY);

  const [isWebsiteValid, setIsWebsiteValid] = useState(true);

  const [disabled, setDisabled] = useState(false);
  const [step, setStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isFirstDisabled, setIsFirstDisabled] = useState(false);
  const [validateExamplesWorkFields, setValidateExamplesWorkFields] =
    useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(Array(3).fill(""));
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>(
    Array(3).fill("")
  );
  const [isContactEmailValid, setIsContactEmailValid] = useState(true);

  const [formData, setFormData] = useState<UpdatedFormData>({
    companyName: '',
    companyWebsite: '',
    numEmployees: '',
    tagline: '',
    bio: '',
    logo_url: '',
    salesEmail: '',
    typicalRetainerSize: '',
    address: '',
    examplesOfWork: [
      { title: "", image_url_1: null, image_url_2: null },
      { title: "", image_url_1: null, image_url_2: null },
      { title: "", image_url_1: null, image_url_2: null },
    ],
    email: '',
    password: '',
    is_verified: true,
    status: '',
    confirmPassword: '',
    selectedServices: [],
    selectedIndustries: [],
    selectedMinorities: [],
  });
  const [baseForm, setBaseForm] = useState<UpdatedFormData>({
    companyName: "",
    companyWebsite: "",
    numEmployees: "",
    tagline: "",
    bio: "",
    logo_url: "",
    salesEmail: "",
    typicalRetainerSize: "",
    address: "",
    examplesOfWork: [
      { title: "", image_url_1: null, image_url_2: null },
      { title: "", image_url_1: null, image_url_2: null },
      { title: "", image_url_1: null, image_url_2: null },
    ],
    email: "",
    password: "",
    is_verified: true,
    status: "",
    confirmPassword: "",
    selectedServices: [],
    selectedIndustries: [],
    selectedMinorities: [],
  });

  useEffect(() => {
    if (
      !getAgencyData ||
      !getAgencyData.getAgency ||
      !getAgencyData.getAgency.agency
    ) {
      return;
    }

    const agency = getAgencyData.getAgency.agency;

    const retainer_size = Retainer.find(
      (item) => item.value === agency.retainer_size
    );
    const employees = Employees.find((item) => item.value === agency.employees);
    const serviceIds = agency?.services.map((item) => item.service.id);
    const newArray = agency?.portfolio.map((obj) => {
      const { __typename, ...rest } = obj;
      return rest;
    });
    const industries = agency?.industries?.map((obj) => {
      const { __typename, id, ...rest } = obj;
      return rest?.name;
    });
    const minorities = agency?.minorities?.map((obj) => {
      const { __typename, id, ...rest } = obj;
      return rest?.name;
    });

    console.log(newArray, "newArray123");

    setFormData((prevFormData) => ({
      ...prevFormData,
      companyName: agency.name,
      companyWebsite: agency.website,
      numEmployees: employees,
      tagline: agency.tagline,
      bio: agency.bio,
      logo_url: agency.logo_url,
      typicalRetainerSize: retainer_size,
      address: agency?.headquarter_address,
      examplesOfWork: newArray.length ? newArray : [
        { title: "", image_url_1: "", image_url_2: "" },
        { title: "", image_url_1: "", image_url_2: "" },
        { title: "", image_url_1: "", image_url_2: "" },
      ],
      email: agency?.email,
      selectedServices: serviceIds,
      selectedIndustries: industries,
      selectedMinorities: minorities,
      is_verified: agency.is_verified,
      status: agency.status,
      salesEmail: agency.sales_email
    }));
    setBaseForm((prevFormData) => ({
      ...prevFormData,
      companyName: agency.name,
      companyWebsite: agency.website,
      numEmployees: employees,
      tagline: agency.tagline,
      bio: agency.bio,
      logo_url: agency.logo_url,
      typicalRetainerSize: retainer_size,
      address: agency?.headquarter_address,
      examplesOfWork: newArray.length
        ? newArray
        : [
          { title: "", image_url_1: "", image_url_2: "" },
          { title: "", image_url_1: "", image_url_2: "" },
          { title: "", image_url_1: "", image_url_2: "" },
        ],
      email: agency?.email,
      selectedServices: serviceIds,
      selectedIndustries: industries,
      selectedMinorities: minorities,
      is_verified: agency.is_verified,
      status: agency.status,
      salesEmail: agency.sales_email,
    }));
  }, [getAgencyData]);

  // Handle form data changes for Sections 2, 3, 4, and 5
  const handleFormDataChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleLogoUpload = (file, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [file]: value,
    }));
  };

  // Handle file uploads for Section 4
  const handleFileUpload = (itemIndex, fileType, file) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      examplesOfWork: prevFormData.examplesOfWork.map((item, index) =>
        index === itemIndex
          ? {
            ...item,
            [fileType]: file,
          }
          : item
      ),
    }));
  };

  // Handle selected services, industries, and minorities for Section 3
  const handleSelectedItems = (category: any, selectedItems: any) => {
    switch (category) {
      case "Services":
        setFormData((prevFormData) => ({
          ...prevFormData,
          selectedServices: selectedItems,
        }));
        break;
      case "Industries":
        setFormData((prevFormData) => ({
          ...prevFormData,
          selectedIndustries: selectedItems,
        }));
        break;
      case "Minority Owned (Optional)":
        setFormData((prevFormData) => ({
          ...prevFormData,
          selectedMinorities: selectedItems,
        }));
        break;
      default:
        break;
    }
  };

  const servicesArr = formData?.selectedServices?.map((item) => ({
    service_id: item,
  }));

  const { showToast, hideToast } = useContext(ToastContext);

  const onSubmit = async (isSkipWorkSpotlightAndSubmit) => {
    if (step === 3) {
      try {
        setDisabled(true);
        setTimeout(() => {
          setDisabled(false);
        }, 3000);
        showSpinner();
        const { data: agencyData } = await updateAgency({
          variables: {
            id: parseFloat(tempId),
            data: {
              name: formData?.companyName,
              website:
                !formData?.companyWebsite.includes("https://") &&
                  !formData?.companyWebsite.includes("http://")
                  ? "https://" + formData?.companyWebsite
                  : formData?.companyWebsite,
              retainer_size: parseInt(formData?.typicalRetainerSize?.value),
              email: formData?.email,
              logo_url: formData?.logo_url,
              headquarter_address: formData?.address,
              logo: formData?.logo_url,
              tagline: formData?.tagline,
              employees: parseInt(formData?.numEmployees?.value),
              bio: formData?.bio,
              status: formData?.status,
              is_verified: formData?.is_verified,
              total_ratings: 0,
              total_views: 0,
              total_reviews: 0,
              services: servicesArr,
              portfolio: isSkipWorkSpotlightAndSubmit
                ? getAgencyData?.getAgency?.agency?.portfolio.map((item, _) => {
                  return {
                    title: item.title,
                    image_url_1: item.image_url_1,
                    image_url_2: item.image_url_2,
                  };
                }) || []
                : formData?.examplesOfWork,
              sales_email: formData?.salesEmail,
            },
          },
        });

        const agencyId = agencyData?.updateAgency?.id;

        await handleIndustryAndMinorityMutations(agencyId);
        navigate(`/agency-listing/${agencyId}`);
        hideSpinner();
        showToast(`Agency updated successfully`, "success");
        setTimeout(() => {
          hideToast();
        }, 3000);
      } catch (error) {
        hideSpinner();
        showToast(`Error while updating agency`, "warn");
        setTimeout(() => {
          hideToast();
        }, 3000);
        // navigate('/');
        // Handle errors
      }
    }
    setStep((state) => state + 1);
  };
  const handleIndustryAndMinorityMutations = async (agencyId) => {
    const industryData = formData?.selectedIndustries?.map((industry) => {
      return {
        agency_id: agencyId,
        name: industry,
      };
    });

    const minorityData = formData?.selectedMinorities?.map((minority) => {
      return {
        agency_id: agencyId,
        name: minority,
      };
    });

    console.log(industryData, "industryData123", minorityData);

    if (industryData.length > 0) {
      await updateAgencyIndustry({
        variables: {
          agencyId: agencyId,
          data: industryData,
        },
      });
    }

    if (minorityData.length > 0) {
      await updateAgencyMinority({
        variables: {
          agencyId: agencyId,
          data: minorityData,
        },
      });
    }
  };

  const validateArrayObjects = (dataArray) => {
    for (const item of dataArray) {
      if (!item.title || !item.image_url_1 || !item.image_url_2) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const isServicesSelected = formData.selectedServices.length >= 1;
    const isIndustriesSelected = formData.selectedIndustries.length >= 1;
    setIsNextDisabled(!isServicesSelected || !isIndustriesSelected);
  }, [formData.selectedServices, formData.selectedIndustries]);

  useEffect(() => {
    if (
      formData?.companyName !== "" &&
      formData?.companyWebsite !== "" &&
      isWebsiteValid &&
      formData?.salesEmail !== "" &&
      isContactEmailValid
    ) {
      setIsFirstDisabled(false);
    } else {
      setIsFirstDisabled(true);
    }
  }, [
    formData?.companyName,
    formData?.companyWebsite,
    isWebsiteValid,
    formData?.salesEmail,
    isContactEmailValid,
  ]);

  useEffect(() => {
    const isExamplesOfWorkStepDisabled = validateArrayObjects(
      formData.examplesOfWork
    );
    setValidateExamplesWorkFields(isExamplesOfWorkStepDisabled);
  }, [formData.examplesOfWork]);

  const isPortfolioTouched = useMemo(() => {
    const existingAgencyPortfolio =
      getAgencyData?.getAgency?.agency?.portfolio.map((item, _) => {
        return {
          title: item.title,
          image_url_1: item.image_url_1,
          image_url_2: item.image_url_2,
        };
      }) || [];
    return (
      JSON.stringify(existingAgencyPortfolio) !==
      JSON.stringify(formData.examplesOfWork)
    );
  }, [getAgencyData?.getAgency, formData]);
  useEffect(() => {
    if (
      JSON.stringify(baseForm.examplesOfWork) ===
      JSON.stringify(formData.examplesOfWork)
    ) {
      setValidateExamplesWorkFields(true);
    } else {
      const isExamplesOfWorkStepDisabled = validateArrayObjects(
        formData.examplesOfWork
      );
      setValidateExamplesWorkFields(isExamplesOfWorkStepDisabled);
    }
  }, [formData.examplesOfWork]);

  return (
    <>
      {isLoading ? (
        showSpinner()
      ) : (
        <>
          <div className="mx-[5%] xl:mx-auto " style={{ width: '100%' }}>
            <div className="grid grid-cols-12">
              <h4 className="text-[24px] font-montserrat font-semibold mb-5 min-w-[400px] col-span-12 flex justify-start">
                Update your Agency Listing
              </h4>
            </div>
          </div>
          {step === 1 && (
            <>
              <Step1 update={true} />
              <EditCompanyDetails
                update={true}
                formData={formData}
                handleFormDataChange={handleFormDataChange}
                handleLogoUpload={handleLogoUpload}
                isWebsiteValid={isWebsiteValid}
                setIsWebsiteValid={setIsWebsiteValid}
                checkIsContactEmailValid={setIsContactEmailValid}
              />
            </>
          )}
          {step === 2 && (
            <>
              <Step2 update={true} />
              <EditListingDetails
                formData={formData}
                handleSelectedItems={handleSelectedItems}
              />
            </>
          )}
          {step === 3 && (
            <>
              <Step3 update={true} />
              <Section4
                formData={formData}
                handleFileUpload={handleFileUpload}
                imageUrls={imageUrls}
                setImageUrls={setImageUrls}
                thumbnailUrls={thumbnailUrls}
                setThumbnailUrls={setThumbnailUrls}
                showLabels={true}
                edit={true}
              />
            </>
          )}

          {/* <div className="border-t my-10 max-w-[1216px] border-[#EAECF0] mx-[5%] xl:mx-auto "></div> */}
          <div style={{ width: '100%' }} className="my-10 sm:mx-[5%] xl:mx-auto min-w-[400px] col-span-12 flex justify-center items-center gap-20 sm:justify-between">
            {step <= 1 ? (
              <>
                {/* <button
									className='w-[144px]  px-[16px] py-[10px] rounded-[8px] border border-[#EAECF0] flex items-center justify-center text-[14px] font-montserrat font-semibold'
									onClick={() => navigate(-1)}
								>
									Cancel
								</button> */}
              </>
            ) : (
              <>
                <button
                  className="w-[144px]  px-[16px] py-[10px] rounded-[8px] border border-[#EAECF0] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                  onClick={() => setStep((state) => state - 1)}
                >
                  Back
                </button>
              </>
            )}
            {step >= 3 ? (
              <>
                <div className="flex  " style={{ gap: "16px" }}>
                  {isPortfolioTouched && (
                    <button
                      className="w-[144px] bg-[#F1F8FF] px-[16px] py-[10px] rounded-[8px] text-[#329BFA] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                      onClick={() => {
                        onSubmit(true);
                      }}
                      style={{ border: "1px solid #329BFA" }}
                    >
                      Skip & Save
                    </button>
                  )}
                  <button
                    className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                    onClick={() => {
                      onSubmit(false);
                    }}
                    disabled={!validateExamplesWorkFields}
                    style={{
                      opacity: !validateExamplesWorkFields ? 0.5 : 1,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : step === 2 ? (
              <>
                <button
                  className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                  onClick={() => setStep((state) => state + 1)}
                  disabled={isNextDisabled}
                  style={{ opacity: isNextDisabled ? 0.5 : 1 }}
                >
                  Next
                </button>
              </>
            ) : step === 3 ? (
              <button
                className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                onClick={() => setStep((state) => state + 1)}
                disabled={!validateExamplesWorkFields}
                style={{ opacity: !validateExamplesWorkFields ? 0.5 : 1 }}
              >
                Next
              </button>
            ) : (
              <div className="flex justify-center sm:justify-between w-[100%]">
                <button
                  className="w-[144px] bg-[#FFFFFF] px-[16px] py-[10px] rounded-[8px] text-[#000000] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                  onClick={() => window.location.reload()}
                  disabled={isFirstDisabled}
                  style={{ opacity: isFirstDisabled ? 0.5 : 1, border: '1px solid #D0D5DD' }}
                >
                  Cancel
                </button>
                <button
                  className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
                  onClick={() => setStep((state) => state + 1)}
                  disabled={isFirstDisabled}
                  style={{ opacity: isFirstDisabled ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default EditAgency;
