import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import InfoCircle from "../assets/Icons/InfoCircleGray.svg";
import dropDownIcon from "../assets/Icons/expand_arrow.svg";
import line from "../assets/Icons/line.svg";
import star from "../assets/Icons/star.svg";
import outlineStar from "../assets/Icons/start_outline.svg";
import fileUpload from "../assets/Icons/upload_to_cloud.svg";
// import HomeLine from '../assets/Icons/home-line.svg';
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import SpinnerContext from "../Context/SpinnerContext";
import ToastContext from "../Context/ToastContext";
import { Option } from "../Interface";
import ArrowLeft from "../assets/Icons/ArrowLeft.svg";
import ErrorIcon from "../assets/Icons/ErrorIcon.svg";
import { handleFileUploadCommon } from "../common/common";
import { UserContext } from "../Context/UserContext";
import { getAbbreviatedLocationUsingGeocoder, stringToSlug } from "../Utilities/utilities";
import GoogleAnalyticsContext from "../Context/GoogleAnalyticsContext";
import ResultentModal from "../Components/Modal/ResultentModal";
import GetMatchedFlow from "../Components/GetMatchedFlow";


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

export const CREATE_REVIEW = gql`
  mutation createReview($data: CreateAgencyReviewInput!) {
    createReview(data: $data) {
      id
      agency_id
      email
      pros
      cons
      value_rating
      communication_rating
      domain_rating
      recommend_rating
      receipt_url
      location
      duration_client
    }
  }
`;

const UserReview: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA1Efom7xZ9wBPtQO4505DLguEcQ3i20xs",
  });
  const { id, slug } = useParams();
  const tempId: any = id;
  const navigate = useNavigate();
  const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);

  const { sendGoogleAnalytics } = useContext(GoogleAnalyticsContext);

  useEffect(() => window.scrollTo(0, 0), []);

  // useEffect(() => {
  // 	showSpinner();
  // 	// Simulating an asynchronous API call
  // 	setTimeout(() => {
  // 	  hideSpinner();
  // 	}, 3000); // Change this delay to simulate the loading time

  // 	return () => {
  // 	  // Clean up if needed
  // 	};
  // }, []);
  const { toastMessage, showToast, hideToast } = useContext(ToastContext);
  const categories = [
    {
      value: "value_rating",
      label: "Value",
      tooltip: "They were well worth the investment.",
    },
    {
      value: "domain_rating",
      label: "Domain knowledge",
      tooltip: "They understood the marketing discipline.",
    },
    {
      value: "communication_rating",
      label: "Communication",
      tooltip: "They responded quickly and were always honest.",
    },
    {
      value: "recommend_rating",
      label: "World recommendation",
      tooltip: "I would recommend them to a close friend.",
    },
  ];
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [location, setLocation] = useState("");
  const [locationValid, setLocationValid] = useState(true);
  const [locationError, setLocationError] = useState("");
  const initialOptions: Option[] = [
    { value: "1", label: "Less than 6 months" },
    { value: "2", label: "More than 6 months" },
  ];
  const [selectedOption, setSelectedOption] = useState("1");
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [selectedOptionValid, setSelectedOptionValid] = useState(true);
  const [selectedOptionError, setSelectedOptionError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileValid, setFileValid] = useState(true);
  const [fileError, setFileError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pros, setPros] = useState("");
  const [prosValid, setProsValid] = useState(true);
  const [prosError, setProsError] = useState("");
  const [cons, setCons] = useState("");
  const [consValid, setConsValid] = useState(true);
  const [consError, setConsError] = useState("");
  const [ratings, setRatings] = useState<{ [category: string]: number }>({});
  const [ratingsValid, setRatingsValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isLocationValid = () => location.trim() !== "" && locationValid;
  const isLocationValid1 = () => email.trim() !== "";
  const isLocationValid2 = () => selectedOption.trim() !== "";

  const maxWordCount = 2000;

  const areRatingsValid =
    ratings["value_rating"] >= 1 &&
    ratings["value_rating"] <= 5 &&
    ratings["communication_rating"] >= 1 &&
    ratings["communication_rating"] <= 5 &&
    ratings["domain_rating"] >= 1 &&
    ratings["domain_rating"] <= 5 &&
    ratings["recommend_rating"] >= 1 &&
    ratings["recommend_rating"] <= 5;

  const routeLocation = useLocation();
  const queryParams = new URLSearchParams(routeLocation.search);

  const [createReview, { data, loading }] = useMutation(CREATE_REVIEW);
  const [getAgencyDetails, { data: agencyData }] = useLazyQuery(GET_AGENCY, {
    variables: { id: parseFloat(tempId) },
  });

  const { user } = useContext(UserContext);
  const agencyDetails = JSON.parse(
    sessionStorage.getItem("agencyDetails") || "{}"
  );

  //google geo location api
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [isGeoLocationValid, setIsGeoLocationValid] = useState(false);

  const onLocationLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const selectedPlace = autocomplete.getPlace();
      const formattedAddress = getAbbreviatedLocationUsingGeocoder(
        selectedPlace!
      );
      // const formattedAddress = selectedPlace.formatted_address
      setLocation(`${formattedAddress}`);
      setIsGeoLocationValid(true);
      setLocationValid(true);
    }
  };

  const isValidFile = (file: File | null): boolean => {
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      return allowedTypes.includes(file.type);
    }
    return false;
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showSpinner();
    setFormSubmitted(true);

    if (
      isLocationValid() &&
      isLocationValid1() &&
      isLocationValid2() &&
      isValidFile(file) &&
      areRatingsValid &&
      pros.length <= maxWordCount &&
      pros.length >= 150 &&
      cons.length <= maxWordCount &&
      cons.length >= 150
    ) {
      console.log("formsubmit12345");
      try {
        await createReview({
          variables: {
            data: {
              agency_id: parseFloat(tempId),
              email,
              location,
              duration_client: parseFloat(selectedOption),
              pros,
              cons,
              value_rating: ratings["value_rating"] || 0,
              communication_rating: ratings["communication_rating"] || 0,
              domain_rating: ratings["domain_rating"] || 0,
              recommend_rating: ratings["recommend_rating"] || 0,
              receipt_url: imageUrl,
              status: "pending",
            },
          },
        });
        if (isValidFile(file)) {
          // Perform your form submission logic here
          hideSpinner();
          // showToast("Review submitted successfully!", "success");
          // setTimeout(() => {
          //   hideToast();
          // }, 3000);
          setIsResultModalOpen(true)
        } else {
          console.error("Please upload invoice/receipt");
          setTimeout(() => {
            hideSpinner();
            showToast("Please upload invoice/receipt!", "warn");
          }, 2000);
          setTimeout(() => {
            hideToast();
          }, 3000);
        }
        sendGoogleAnalytics({ capturedAction: "submit_review" })

      } catch (error) {
        console.error("Form submission error:", error);
      }
    } else {
      hideSpinner();
      // Set error states and messages for each field
      if (!isLocationValid()) {
        setLocationValid(false);
        setLocationError(" Please enter your valid location");
      }
      if (!isLocationValid1()) {
        setEmailValid(false);
        setEmailError("Please enter your email address");
      }
      if (!isLocationValid2()) {
        setSelectedOptionValid(false);
        setSelectedOptionError("Select duration");
      }
      if (!isValidFile(file)) {
        setFileValid(false);
        setFileError("Please upload a valid file");
      }
      if (!areRatingsValid) {
        setRatingsValid(false);
        // You can  set a general error message or specific messages for each rating
      }
      if (pros.length === 0) {
        setProsValid(false);
        setProsError("Please enter Pros");
      }
      if (pros.length < 150 && pros.length > 0) {
        setProsValid(false);
        setProsError("Minimum character count should be 150");
      }
      if (pros.length > 2000) {
        setProsValid(false);
        setProsError("Maximum character count should be 2000");
      }

      if (cons.length === 0) {
        setConsValid(false);
        setConsError("Please enter Cons");
      }

      if (cons.length < 150 && cons.length > 0) {
        setConsValid(false);
        setConsError("Minimum character count should be 150");
      }
      if (cons.length > 2000) {
        setConsValid(false);
        setConsError("Maximum character count should be 2000");
      }

      setTimeout(() => {
        hideToast();
      }, 3000);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      showSpinner();
      const TempFile = event.target.files && event.target.files[0];
      const data = await handleFileUploadCommon(TempFile);
      setImageUrl(data.Location);
      setFile(TempFile);
      hideSpinner();
    } catch (error) {
      console.error("An error occurred while handling the file:", error);
    }
  };

  const filledStarIcon = <img src={outlineStar} alt="Star" className="w-4" />;
  const outlineStarIcon = <img src={star} alt="Star" className="w-4" />;

  const handleRatingChange = (category: string, rating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: rating,
    }));
  };

  useEffect(() => {

    const getAgency = async () => {
      showSpinner()
      await getAgencyDetails()
      hideSpinner()
    }

    getAgency()
  }, [])


  if (!isLoaded) return <div></div>;
  return (
    <>
      <ResultentModal
        isOpen={isResultModalOpen}
        onClose={() => { setIsResultModalOpen(false); navigate(`/AgencyDetails/${id}/${stringToSlug(agencyData?.getAgency?.agency?.name || "")}`); }}
        onSubmit={(data) => { }}
        loading={false}
        verrient="for-review"
        status={"success"}
        message="Review received!"
        disableBtn={true}
      />
      {(isLoading) ? (
        showSpinner()
      ) : (
        <>
          <div className="mx-[10%] grid grid-cols-1 py-[32px]">
            <div
              className="grid grid-cols-1 max-w-[680px]"
              style={{ width: "100%", margin: "0px auto" }}
            >
              <div
                className="grid grid-cols-[2rem_auto] items-center pb-4 sm:pb-8"
                style={{ width: "100%" }}
              >
                <Link
                  to={{
                    pathname: `/AgencyDetails/${id}/${stringToSlug(agencyData?.getAgency?.agency?.name || "")}`,
                    search: `?${new URLSearchParams(queryParams)}`,
                  }}
                >
                  <img src={ArrowLeft} alt="Arrow left" width={40} />
                </Link>
                <div className="grid grid-cols-[auto_auto] justify-center items-center gap-4">
                  <img
                    src={agencyData?.getAgency?.agency?.logo}
                    alt="Logo"
                    className="w-11 sm:w-14 mr-auto"
                  />
                  <h3 className="uppercase font-babas font-bold text-2xl sm:text-[32px] leading-normal tracking-[0.64px]">
                    {agencyData?.getAgency?.agency?.name}
                  </h3>
                </div>
              </div>
              <h1 className="font-montserrat not-italic font-semibold text-lg sm:text-2xl leading-[30px] text-center mb-6">
                Leave an anonymous review
              </h1>
            </div>
            <div className="mx-auto max-w-[680px] sm:px-0 grid grid-cols-1">
              <div className="bg-whiteColor grid grid-cols-1">
                <form
                  className="grid grid-cols-1 gap-6 font-montserrat"
                  onSubmit={handleFormSubmit}
                >
                  <div className="grid grid-cols-1 gap-[4px] items-center">
                    <div className="grid grid-cols-2 gap-[19px]">
                      <div className="flex flex-col">
                        <label
                          htmlFor="email"
                          className="font-montserrat text-gray700 text-sm font-medium leading-5 not-italic"
                        >
                          Email address{" "}
                          <span className="text-redHighlightedColor">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          placeholder="Enter your email address"
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailValid(true);
                            setEmailError("");
                          }}
                          onBlur={() => {
                            if (!isLocationValid1()) {
                              setEmailValid(false);
                              setEmailError(" Please enter your email address");
                            }
                          }}
                          style={{
                            borderColor: !emailValid ? "#F04438" : "#CBD5E0", // Set the border color conditionally
                          }}
                        />
                        {formSubmitted && !emailValid && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <div style={{ position: "relative" }}>
                              <img
                                alt="Error"
                                src={ErrorIcon}
                                style={{
                                  position: "relative",
                                  right: 15,
                                  top: -27,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {formSubmitted && !emailValid && (
                          <p
                            style={{ color: "#F04438" }}
                            className="text-xs mt-1"
                          >
                            {emailError}
                          </p>
                        )}
                        <p
                          className="font-montserrat text-gray700 text-ss  not-italic"
                          style={{
                            wordSpacing: "1px",
                            marginTop: "8px",
                            fontSize: "small",
                            // width: "500px",
                          }}
                        >
                          Your email is only used for verification, ensuring
                          your anonymity.
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="location"
                          className="font-montserrat text-gray700 text-sm font-medium leading-5 not-italic"
                        >
                          Location{" "}
                          <span className="text-redHighlightedColor">*</span>
                        </label>
                        <Autocomplete
                          onLoad={onLocationLoad}
                          onPlaceChanged={onPlaceChanged}
                          className="flex flex-col"
                        >
                          <input
                            type="text"
                            id="location"
                            className={`border-[1px] border-grayBorder text-inputColor rounded-lg px-2 py-3 shadow-shadowXs h-10 self-stretch ${!locationValid ? "border-red-500" : ""
                              }`}
                            value={location}
                            onChange={(e) => {
                              if (!isGeoLocationValid) {
                                setLocationValid(false);
                              } else {
                                setIsGeoLocationValid(false);
                                setLocationValid(false);
                              }
                              setLocation(e.target.value);
                              // setLocationValid(true);
                              setLocationError("");
                            }}
                            onBlur={() => {
                              if (!isLocationValid()) {
                                setLocationValid(false);
                                setLocationError(
                                  "Please enter your valid location"
                                );
                              }
                            }}
                            style={{
                              borderColor: !locationValid
                                ? "#F04438"
                                : "#CBD5E0", // Set the border color conditionally
                            }}
                          />
                        </Autocomplete>
                        {!locationValid && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <div style={{ position: "relative" }}>
                              <img
                                alt="Error"
                                src={ErrorIcon}
                                style={{
                                  position: "relative",
                                  right: 15,
                                  top: -27,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {/* {!locationValid && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <div style={{ position: "relative" }}>
                              <img
                                alt="Error"
                                src={ErrorIcon}
                                style={{
                                  position: "relative",
                                  right: 7,
                                  top: -27,
                                }}
                              />
                            </div>
                          </div>
                        )} */}
                        {!locationValid && (
                          <p
                            style={{ color: "#F04438" }}
                            className="text-xs mt-1"
                          >
                            Please enter your valid location
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-[4px] items-center">
                    <label
                      htmlFor="dropdown"
                      className="font-montserrat text-gray700 text-sm font-medium leading-5 not-italic"
                    >
                      How long have you been a client?
                    </label>
                    <div className="grid grid-cols-1 relative">
                      <select
                        id="dropdown"
                        className={`font-montserrat text-sm not-italic font-medium appearance-none border-[1px] border-grayBorder text-inputColor rounded-lg pl-2 py-3 leading-5 relative shadow-shadowXs ${!isLocationValid2() ? "border-red-500" : ""
                          }`}
                        value={selectedOption}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);
                        }}
                        required
                      >
                        {initialOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="pr-2"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {!isLocationValid2() && (
                        <p
                          style={{ color: "#F04438" }}
                          className="text-xs mt-1"
                        >
                          Select duration
                        </p>
                      )}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-700 px-[10px] py-4">
                        <img
                          src={dropDownIcon}
                          alt="Arrow down icon"
                          className="w-[20px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-3 md:gap-x-6 gap-y-6 px-0 md:px-3">
                    {categories.map((category, index) => (
                      <div key={index} className="grid grid-cols-[auto_auto]">
                        <div className="flex flex-row ">
                          <label
                            htmlFor="Value"
                            className="font-montserrat text-sm font-medium text-textColor not-italic leading-5 whitespace-nowrap"
                          >
                            {category.label}{" "}
                            <span className="text-redHighlightedColor">*</span>
                          </label>
                          <div className="group relative flex justify-center items-center h-full">
                            <button type="button" className="text-textColor">
                              <img
                                src={InfoCircle}
                                alt="Info"
                                className="ml-1 w-4 h-4 cursor-pointer"
                              />
                            </button>
                            <div className="font-inter md:w-max absolute bg-BlackColor text-whiteColor bottom-5 scale-0 transition-[50ms] rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white group-hover:scale-100">
                              {category.tooltip}
                            </div>
                          </div>
                        </div>
                        <div
                          id="Value"
                          className="grid auto-cols-auto grid-flow-col justify-self-end gap-1 sm:gap-2"
                        >
                          {[1, 2, 3, 4, 5].map((innerIndex) => (
                            <span
                              key={innerIndex}
                              onClick={() =>
                                handleRatingChange(category.value, innerIndex)
                              }
                              className="cursor-pointer"
                            >
                              {innerIndex <= (ratings[category.value] || 0)
                                ? outlineStarIcon
                                : filledStarIcon}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {formSubmitted && !areRatingsValid && (
                      <p style={{ color: "#F04438" }} className="text-xs mt-1">
                        Please fill star rating.
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-[4px] items-start self-stretch">
                    <label
                      htmlFor="pros"
                      className="font-montserrat text-gray700 text-sm font-medium leading-5 not-italic"
                    >
                      Pros <span className="text-redHighlightedColor">*</span>
                    </label>
                    <textarea
                      id="pros"
                      style={{
                        resize: "none",
                        borderColor:
                          formSubmitted && pros.length === 0
                            ? "#F04438"
                            : pros.length > 0 && pros.length < 150
                              ? "#F04438"
                              : pros.length > 2000
                                ? "#F04438"
                                : "#CBD5E0",
                      }}
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      placeholder="Pros ..."
                    />
                    <div className="flex justify-end text-xs text-gray-500 relative bottom-0 right-3 z-10">
                      {pros.length} / 2000 {/* Assuming maxWordCount is 2000 */}
                    </div>
                    {formSubmitted && pros.length === 0 && (
                      <p style={{ color: "#F04438" }} className="text-xs mt-1">
                        Please enter Pros
                      </p>
                    )}
                    {pros.length > 0 && pros.length < 150 && (
                      <p style={{ color: "#F04438" }} className="text-xs mt-1">
                        Minimum character count should be 150
                      </p>
                    )}
                    {pros.length > 2000 && (
                      <p style={{ color: "#F04438" }} className="text-xs mt-1">
                        Maximum character count should be 2000
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-[4px] items-start self-stretch">
                    <label
                      htmlFor="cons"
                      className="font-montserrat text-gray700 text-sm font-medium leading-5 not-italic"
                    >
                      Cons <span className="text-redHighlightedColor">*</span>
                    </label>
                    <textarea
                      id="cons"
                      style={{
                        resize: "none",
                        borderColor:
                          formSubmitted && cons.length === 0
                            ? "#F04438"
                            : cons.length > 0 && cons.length < 150
                              ? "#F04438"
                              : cons.length > 2000
                                ? "#F04438"
                                : "#CBD5E0",
                      }}
                      value={cons}
                      onChange={(e) => setCons(e.target.value)}
                      placeholder="Cons ..."
                    />
                    <div className="flex justify-end text-xs text-gray-500 relative bottom-0 right-3">
                      {cons.length} / 2000 {/* Assuming maxWordCount is 2000 */}
                    </div>
                    {formSubmitted && cons.length === 0 && (
                      <p style={{ color: "#F04438" }} className="text-xs mt-1">
                        Please enter Cons
                      </p>
                    )}
                    {cons.length > 0 && cons.length < 150 && (
                      <p style={{ color: "#F04438" }} className="text-xs mt-1">
                        Minimum character count should be 150
                      </p>
                    )}
                    {cons.length > 2000 && (
                      <p style={{ color: "#F04438" }} className="text-xs mt-1">
                        Maximum character count should be 2000
                      </p>
                    )}
                    {/*<div className="flex justify-end">
                      <label className="font-montserrat text-gray700 text-sm">
                        Minimum character count should be 150
                      </label>
                    </div>*/}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <p className="text-center text-sm font-normal">
                      In order to validate the authenticity of all reviews on
                      agencyreviews.io, we require an image or PDF of an invoice
                      or contract from the agency. It will not be shared with
                      anyone, strictly for verification purpose only.
                      <span className="text-redHighlightedColor">*</span>
                    </p>

                    <div className="grid grid-cols-1">
                      <label
                        htmlFor="file-input"
                        className="font-montserrat not-italic font-semibold leading-5 text-sm rounded-lg border-[1px] border-grayBorder px-4 py-[10px] text-gray700 grid grid-cols-[auto_auto] justify-center justify-self-center items-center gap-2 shadow-shadowXs"
                      >
                        <img
                          src={fileUpload}
                          alt="File upload"
                          className="w-5"
                        />
                        <span className="capitalize">
                          upload{" "}
                          {file && isValidFile(file) && (
                            <span>| {file.name}</span>
                          )}
                        </span>
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        className="hidden bg-primaryColor py-2 px-3 rounded-lg text-whiteColor grid-cols-1 justify-self-center"
                        accept=".jpg, .jpeg, .png, .pdf, .doc"
                        onChange={handleFileChange}
                      />
                      {formSubmitted && !file && (
                        <p
                          style={{ color: "#F04438" }}
                          className="text-xs mt-1"
                        >
                          Please upload a file PDF or Image
                        </p>
                      )}
                      {file && !isValidFile(file) && (
                        <p
                          style={{ color: "#F04438" }}
                          className="text-xs mt-1"
                        >
                          Please upload a valid file PDF or Image
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 py-2">
                    <img src={line} alt="hori line" className="w-full" />
                  </div>
                  <div className="grid grid-cols-[90px_90px] sm:grid-cols-[144px_144px] justify-between gap-2 font-montserrat font-semibold text-xs sm:text-sm">
                    <Link
                      to={{
                        pathname: `/AgencyDetails/${id}/${stringToSlug(agencyData?.getAgency?.agency?.name || "")}`,
                        search: `?${new URLSearchParams(queryParams)}`,
                      }}
                      className="leading-5 not-italic px-2 py-2 sm:px-4 sm:py-[10px] text-center border-2 border-grayBorder text-gray700 rounded-lg shadow-shadowXs"
                    >
                      Back
                    </Link>
                    <button
                      type="submit"
                      className="border border-red-900 leading-5 not-italic px-2 py-2 sm:px-4 sm:py-[10px] bg-primaryColor text-whiteColor rounded-lg shadow-shadowXs"
                      disabled={loading}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserReview;
