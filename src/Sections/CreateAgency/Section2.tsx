import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import Alert from '@mui/material/Alert';
import WarningToast from "../../Components/Toast/WarningToast";
import {
  Employees,
  Retainer,
  getAbbreviatedLocationUsingGeocoder,
} from "../../Utilities/utilities";
import { ReactComponent as RemoveIcon } from "../../assets/Icons/x.svg";
import { handleFileUploadCommon } from "../../common/common";
import { FileUploader } from "react-drag-drop-files";
import InfoCircle from "../../assets/Icons/InfoCircle.svg";
import ToastContext from "../../Context/ToastContext";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const Section2 = ({
  formData,
  handleFormDataChange,
  handleLogoUpload,
  update,
  isWebsiteValid,
  setIsWebsiteValid,
  checkIsContactEmailValid,
}) => {
  interface FileUploadState {
    selectedFile: File | null;
  }
  const {
    companyName,
    companyWebsite,
    tagline,
    bio,
    salesEmail,
    address,
    logo_url,
    numEmployees,
    typicalRetainerSize,
  } = formData;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA1Efom7xZ9wBPtQO4505DLguEcQ3i20xs",
  });

  console.log(numEmployees, typicalRetainerSize, "typicalRetainerSize");
  const [selectedFile, setSelectedFile] = useState<FileUploadState>({
    selectedFile: null,
  });

  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({});
  const libraries: ["places"] = ["places"];

  const urlRegex =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})+([/?].*)?$/;
  const [isSalesEmailValid, setIsSalesEmailValid] = useState(true);
  const [companyNameError, setCompanyNameError] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [employee, setEmployee] = useState(false);
  const [retainer, setRetainer] = useState(false);
  const [showToastForImageUrl, setShowToastForImageUrl] = useState(false);
  const [errorForImageUrl, setErrorForImageUrl] = useState("");
  const [tooltip, setTooltip] = useState(false)
  const [employeesdropdown, setEmployeesdropdown] = useState(
    "Select number of employees"
  );
  const [retainerdropdown, setRetainerdropdown] = useState(
    " Select retainer size"
  );
  const setEmployees = (item: any) => {
    setEmployeesdropdown(item.name);
    setEmployee(false);
    handleFormDataChange("numEmployees", item.value);
  };
  const handleWebsiteChange = (e) => {
    const website = e.target.value;
    const isValid = urlRegex.test(website);
    setIsWebsiteValid(isValid);
    handleFormDataChange("companyWebsite", website);
  };

  const handleTaglineChange = (e) => {
    const tagline = e.target.value;
    // Perform client-side validation to restrict the length
    if (tagline.length <= 40) {
      setTaglineCounter(tagline.length);
      handleFormDataChange("tagline", tagline);
    }

  };
  const handleCompanyNameChange = (e) => {
    const companyName = e.target.value;
    const name = /\S+/;
    setCompanyNameError(name.test(companyName));
    handleFormDataChange("companyName", companyName);
  };
  const [regularEmail, setRegularEmail] = useState([]);
  const [isContactEmailValid, setIsContactEmailValid] = useState(true);
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRegularEmail = (email) => {
    const inputEmails = email.map((email) => email.trim());
    const isValid = inputEmails.every((email) =>
      emailRegex.test(email)
    );
    setRegularEmail(inputEmails);
    handleFormDataChange("salesEmail", inputEmails.join(","));
    setIsContactEmailValid(isValid);
    checkIsContactEmailValid(isValid);
  };

  const handleSalesEmailChange = (e) => {
    const email = e.target.value;

    setIsSalesEmailValid(emailRegex.test(email));
    handleFormDataChange("salesEmail", email);
  };

  const [taglineCounter, setTaglineCounter] = useState(0);
  const getText = (text) => {
    setEmployeesdropdown(text.target.innerText);
    setEmployee(false);
  };
  const getRetainerText = (text: any) => {
    setRetainerdropdown(text.name);
    setRetainer(false);
    handleFormDataChange("typicalRetainerSize", text.value);
  };

  const validateImageDimensions = (file) => {
    return new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        const maxWidth = 800;
        const maxHeight = 800;

        if (image.width <= maxWidth && image.height <= maxHeight) {
          resolve(); // No value is returned
        } else {
          setShowToastForImageUrl(true);
          setErrorForImageUrl(
            `Image dimensions must be less than or equal to 800px x 800px`
          );
          setIsImageUploading(false);
        }
      };

      image.onerror = () => {
        reject("Failed to load the image.");
        setIsImageUploading(false);
        setErrorForImageUrl(`Failed to load the image.`);
      };
    });
  };

  const handleFileChange = async (
    file: File | null,
  ) => {
    try {
      setIsImageUploading(true);
      const TempFile = file

      if (!TempFile) {
        setShowToastForImageUrl(true);
        setErrorForImageUrl("Please select a file.");
        setIsImageUploading(false);
        return;
      }

      if (!TempFile.type.startsWith('image/')) {
        setShowToastForImageUrl(true);
        setErrorForImageUrl("Invalid file type. Please select an image.");
        setIsImageUploading(false);
        return;
      }

      await validateImageDimensions(TempFile);

      const data = await handleFileUploadCommon(TempFile);
      console.log("URL: " + data.Location);
      setImageUrl(data.Location);
      sessionStorage.setItem("rempurl", data.Location);
      handleLogoUpload("logo_url", data.Location);
      console.log("Img url: " + imageUrl);
      setIsImageUploading(false);
    } catch (error) {
      console.error("An error occurred while handling the file:", error);
    }
  };

  //google geo location api
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [isGeoLocationValid, setIsGeoLocationValid] = useState<boolean>(false);
  const [locationValid, setLocationValid] = useState<boolean>(true);

  const onLocationLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const selectedPlace = autocomplete.getPlace();
      // const formattedAddress = selectedPlace.formatted_address;
      const formattedAddress = getAbbreviatedLocationUsingGeocoder(
        selectedPlace!
      );
      handleFormDataChange("address", formattedAddress);
      setIsGeoLocationValid(true);
      setLocationValid(true);
    }
  };

  useEffect(() => {
    if (showToastForImageUrl) {
      const timeout = setTimeout(() => {
        setShowToastForImageUrl(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showToastForImageUrl]);



  const { showToast, hideToast } = useContext(ToastContext);

  if (!isLoaded) return <div></div>;
  return (
    <>
      {showToastForImageUrl && <WarningToast toastMessage={errorForImageUrl} />}
      <div className="mx-[5%] xl:mx-auto  lg:max-w-[1216px] mt-10">
        <div className="grid grid-cols-12 gap-x-10">
          <div className="col-span-12 md:col-span-6">
            <div className="w-[300px] md:w-full mx-auto">
              <label
                htmlFor="name"
                className="block mb-1 text-[14px] font-normal text-black dark:text-white font-montserrat"
              >
                Company Name <span className="text-[#F04438]">*</span>
              </label>
              <input
                id="name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  border: `1px solid ${companyNameError ? "#D0D5DD" : "#F04438"
                    }`,
                  outline: "none",
                }}
                className="block w-full px-2 py-3 text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={companyName}
                onChange={handleCompanyNameChange}
              />
              {!companyNameError && (
                <p className="text-xs mt-1" style={{ color: "#F04438" }}>
                  Please enter company name
                </p>
              )}
            </div>
            <div className="w-[300px] md:w-full mx-auto mt-5">
              <label
                htmlFor="website"
                className="block mb-1 text-[14px] font-normal text-black dark:text-white font-montserrat"
              >
                Company Website <span className="text-[#F04438]">*</span>
              </label>
              <input
                type="text"
                id="website"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  border: `1px solid ${isWebsiteValid ? "#D0D5DD" : "#F04438"}`,
                  outline: "none",
                }}
                value={companyWebsite}
                onChange={handleWebsiteChange}
              />
              {!isWebsiteValid && (
                <p className="text-xs mt-1" style={{ color: "#F04438" }}>
                  Invalid website URL
                </p>
              )}
            </div>
            <div className="w-[300px] md:w-full mx-auto mt-5">
              <label
                htmlFor="employees"
                className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"
              >
                Number of Employees
              </label>
              <button
                type="button"
                className="relative flex items-center justify-between bg-gray-50 border border-[#D0D5DD] text-[#667085] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onClick={() => {
                  setEmployee(!employee);
                  setRetainer(false);
                }}
              >
                {employeesdropdown}
                <svg
                  sidebar-toggle-item
                  className={employee ? "w-6 h-6 rotate-180" : "w-6 h-6"}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {employee && (
                <div>
                  <div className="flex flex-col rounded-lg  mt-2 bg-whiteColor">
                    <ul>
                      {Employees?.map((item, index) => {
                        return (
                          <>
                            <li
                              key={index}
                              onClick={() => setEmployees(item)}
                              className="block px-4 py-2 hover:bg-[#F9FAFB]text-[14px] text-gray-700 rounded-t-lg hover:cursor-pointer hover:text-blue-500 focus:outline-none focus:text-blue-500 transition duration-150 ease-in-out font-montseorrat w-full"
                            >
                              {item?.name}
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="w-[300px] md:w-full mx-auto mt-5">
              <label
                htmlFor="tagline"
                className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"
              >
                Tagline
              </label>
              <div className="relative">
                <input
                  id="tagline"
                  className={`block px-2 py-3 w-full pe-16 text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  onChange={handleTaglineChange}
                  value={tagline}
                // maxLength={40}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 sm:text-xs">
                  {taglineCounter}/40
                </span>
              </div>
            </div>
            <div className="w-[300px] md:w-full mx-auto mt-5">
              <label
                htmlFor="bio"
                className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"
              >
                Company Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                style={{ resize: "none" }}
                onChange={(e) => handleFormDataChange("bio", e.target.value)}
                className="block px-2 py-3 w-full min-h-[130px]  text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="w-[300px] md:w-full mx-auto ">
              <label
                htmlFor="website"
                className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"
                style={logo_url ? { marginBottom: "-13px" } : {}}
              >
                Company Logo
              </label>
              <div className="flex items-center justify-flex-start" style={{ position: "relative" }}>
                {(logo_url && !isImageUploading) && <RemoveIcon style={{ cursor: "pointer", position: "absolute", zIndex: "5", width: "25px", height: "25px", left: "120px", top: "5px", border: "1px solid #D0D5DD", borderRadius: "50%" }}
                  onClick={() => {
                    handleLogoUpload("logo_url", "");
                  }} />}

                {
                  !logo_url &&
                  <div
                    className="w-[100%] h-[100%]"
                    style={{ position: "absolute", opacity: 0, cursor: "pointer", top: 0 }}
                  >
                    <FileUploader
                      id="imageslist"
                      multiple={false}
                      handleChange={handleFileChange}
                      types={["JPEG", "PNG", "JPG", "SVG"]}
                      onTypeError={(err) => {
                        showToast(`${err}`, "warn");
                        setTimeout(() => {
                          hideToast();
                        }, 3000);
                      }}
                    />
                  </div>
                }

                <label
                  role='button'
                  htmlFor='imageslist'
                  className={logo_url ? 'h-[130px] w-[200px]  border-[#D0D5DD] rounded-[8px] pt-4 flex justify-flex-start' : "h-[130px] w-full border border-[#D0D5DD] rounded-[8px] pt-5 flex justify-center"}
                >
                  {isImageUploading ? (
                    <div
                      className="h-[100%] w-[100%] flex justify-center"
                      style={{ alignItems: "center" }}
                    >
                      <BeatLoader
                        color="#3364F7"
                        cssOverride={{}}
                        loading
                        speedMultiplier={0.5}
                      />
                    </div>
                  ) : (
                    <>
                      {logo_url ?
                        <div >
                          <div className='flex justify-flex-start'>
                            <span className='shadow-md border border-[#D0D5DD] rounded-[8px] h-[130px] w-[130px] flex justify-center items-center' >
                              <img
                                alt=''
                                className='w-[80px] h-[80px]'
                                src={
                                  logo_url ? logo_url : require('../../assets/images/upload-icon.svg').default
                                }
                              />
                            </span>
                          </div>
                        </div> :

                        <div>
                          <div className='flex justify-center'>
                            <span className='shadow-md border border-[#D0D5DD]  rounded-[8px] h-[40px] w-[40px] flex justify-center items-center'>
                              <img
                                alt=''
                                className='w-[20px] h-[20px]'
                                src={
                                  require('../../assets/images/upload-icon.svg').default
                                }
                              />
                            </span>
                          </div>
                          <div className='flex justify-center'>
                            <p className='text-[14px] font-semibod font-montserrat mt-3 ml-5'>
                              <span className='text-[14px] font-semibod text-[#329BFA] font-montserrat'>
                                Click to upload
                              </span>{' '}
                              or drag and drop <br />
                              SVG, PNG, or JPG (max. 800x800px){' '}
                            </p>
                          </div>
                        </div>
                      }

                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="w-[300px] md:w-full mx-auto mt-5" style={{ marginTop: logo_url && '37px' }}>
              <label
                htmlFor="email"
                className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"

              >
                Contact Email <span className="text-[#F04438]">*</span>
              </label>

              <TagsInput
                value={regularEmail}
                onChange={(email) => handleRegularEmail(email)}
                inputProps={{
                  placeholder: ""
                }}
                tagProps={{
                  className: "react-tagsinput-tag text-white rounded ",
                  name: "tags",
                  style: {
                    border: `1px solid ${isContactEmailValid ? "#D0D5DD" : "#F04438"}`,
                  }
                }}
              />
              <div className="flex  " style={{ flexDirection: "row-reverse" }}>
                <label
                  htmlFor="Value"
                  className="font-montserrat text-sm font-medium text-textColor not-italic leading-5 whitespace-nowrap"
                >

                </label>
                <div className="group relative flex justify-center items-center h-full">
                  <button type="button" className="text-textColor">
                    <img
                      src={InfoCircle}
                      style={{
                        position: "relative",
                        left: -8,
                        top: -30,
                      }}
                      alt="Info"
                      className="ml-1 w-4 h-4 cursor-pointer"
                    />
                  </button>
                  <div className="font-inter md:w-max absolute bg-BlackColor text-whiteColor bottom-12 scale-0 transition-[50ms] rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white group-hover:scale-100" style={{ marginLeft: "-330px" }}>
                    {`Notifications for leads and reviews will be received on ${regularEmail.length > 1 ? 'these' : 'this'} email`}
                  </div>
                </div>

              </div>


              {!isContactEmailValid && (
                <p className="text-xs mt-1" style={{ color: '#F04438' }}>
                  Invalid contact email address
                </p>
              )}
              <Alert severity="info">Press enter after each email address to submit!</Alert>
            </div>

            <div className="w-[300px] md:w-full mx-auto mt-5">
              <label
                htmlFor="size"
                className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"
              >
                Typical Retainer Size
              </label>
              <button
                type="button"
                className="relative flex items-center justify-between bg-gray-50 border border-[#D0D5DD] text-[#667085] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onClick={() => {
                  setRetainer(!retainer);
                  setEmployee(false);
                }}
              >
                {retainerdropdown}

                <svg
                  sidebar-toggle-item
                  className={retainer ? "w-6 h-6 rotate-180" : "w-6 h-6"}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {retainer && (
                <div>
                  <div className="flex flex-col rounded-lg mt-2  bg-whiteColor">
                    <ul>
                      {Retainer?.map((item, index) => {
                        return (
                          <>
                            <li
                              onClick={() => getRetainerText(item)}
                              key={index}
                              className="block px-4 py-2 hover:bg-[#F9FAFB]text-[14px] text-gray-700 rounded-t-lg hover:cursor-pointer hover:text-blue-500 focus:outline-none focus:text-blue-500 transition duration-150 ease-in-out font-montseorrat w-full"
                            >
                              {item?.name}
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="w-[300px] md:w-full mx-auto mt-5">
              <label
                htmlFor="address"
                className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"
              >
                Headquarters Address
              </label>
              <Autocomplete
                onLoad={onLocationLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  id="address"
                  value={address}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    if (!isGeoLocationValid) {
                      setLocationValid(false);
                    } else {
                      setIsGeoLocationValid(false);
                      setLocationValid(false);
                    }
                    handleFormDataChange("address", e.target.value);
                  }}
                  className="block px-2 py-3 w-full text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </Autocomplete>
              {!locationValid && (
                <p style={{ color: "#F04438" }} className="text-xs mt-1">
                  Please enter your valid location
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Section2;
