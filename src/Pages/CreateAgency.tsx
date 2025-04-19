import { gql, useMutation } from "@apollo/client";
import auth0JS from "auth0-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpinnerContext from "../Context/SpinnerContext";
import { FormData } from "../Interface";
import Section2 from "../Sections/CreateAgency/Section2";
import Section3 from "../Sections/CreateAgency/Section3";
import Section4 from "../Sections/CreateAgency/Section4";
import Section5 from "../Sections/CreateAgency/Section5";
import Step1 from "../Sections/CreateAgency/Steps/Step1";
import Step2 from "../Sections/CreateAgency/Steps/Step2";
import Step3 from "../Sections/CreateAgency/Steps/Step3";
import Step4 from "../Sections/CreateAgency/Steps/Step4";
import ToastContext from "../Context/ToastContext";

export const CREATE_AGENCY = gql`
  mutation CreateAgency($data: CreateAgencyInput!) {
    createAgency(data: $data) {
      id
      name
      website
      retainer_size
      email
      logo_url
      headquarter_address
      logo
      tagline
      employees
      bio
      status
      is_verified
    }
  }
`;

export const CREATE_INDUSTRY = gql`
  mutation createAgencyIndustry($data: CreateAgencyIndustryInput!) {
    createAgencyIndustry(data: $data) {
      id
      name
    }
  }
`;

export const CREATE_MINORITY = gql`
  mutation createAgencyMinority($data: CreateAgencyMinoritiesInput!) {
    createAgencyMinority(data: $data) {
      id
      name
    }
  }
`;

const CreateAgency: React.FC = () => {
	// Create instance of auth0 to manage webAuth
	const auth0 = new auth0JS.WebAuth({
		domain: process.env.REACT_APP_AUTH_DOMAIN || "",
		clientID: process.env.REACT_APP_AUTH_CLIENT_ID || "",
	});

	const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);

	const navigate = useNavigate();

	const [createAgency, { data }] = useMutation(CREATE_AGENCY);
	const [createAgencyIndustry] = useMutation(CREATE_INDUSTRY);
	const [createAgencyMinority] = useMutation(CREATE_MINORITY);

	const [disabled, setDisabled] = useState(false);
	const [step, setStep] = useState(1);
	const [isNextDisabled, setIsNextDisabled] = useState(false);
	const [isFirstDisabled, setIsFirstDisabled] = useState(false);
	const [passwordMatch, setPasswordMatch] = useState(false);
	const [passwordValidationError, setPasswordValidationError] = useState("");
	const [error, setError] = useState("");
	const [isWebsiteValid, setIsWebsiteValid] = useState(true);
	const [isContactEmailValid, setIsContactEmailValid] = useState(true);
	const [emailError, setEmailError] = useState("");
	const [imageUrls, setImageUrls] = useState<string[]>(Array(3).fill(""));
	const [validateExamplesWorkFields, setValidateExamplesWorkFields] =
		useState(false);
	const [thumbnailUrls, setThumbnailUrls] = useState<string[]>(
		Array(3).fill("")
	);
	const { showToast, hideToast } = useContext(ToastContext);

	const [formData, setFormData] = useState<FormData>({
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
		confirmPassword: "",
		selectedServices: [],
		selectedIndustries: [],
		selectedMinorities: [],
	});


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

	// Handle navigation between steps
	const onSubmit = async () => {
		if (step === 4) {
			try {
				setDisabled(true);
				setTimeout(() => {
					setDisabled(false);
				}, 3000);
				showSpinner();

				// Do Sign Up. All logic to create the agency is under the promise callback
				// for signup, following the logic to create the agency only if user is created

				await auth0.signup(
					{
						email: formData.email,
						password: formData.password,
						connection: "Username-Password-Authentication",
					},

					async (err) => {
						if (err) {
							if (err.statusCode === 400 || err.code === "inavlid_signup") {
								setError("Email is alreay taken");
							}
						} else {
							const { data: agencyData } = await createAgency({
								variables: {
									data: {
										name: formData?.companyName,
										address: "asda",
										address2: "dsadd",
										website:
											!formData?.companyWebsite.includes("https://") &&
												!formData?.companyWebsite.includes("http://")
												? "https://" + formData?.companyWebsite
												: formData?.companyWebsite,
										retainer_size: parseInt(formData?.typicalRetainerSize),
										email: formData?.email,
										logo_url: formData?.logo_url,
										headquarter_address: formData?.address,
										logo: formData?.logo_url,
										tagline: formData?.tagline,
										employees:
											formData?.numEmployees === ""
												? null
												: formData?.numEmployees,
										bio: formData?.bio,
										status: "hidden",
										is_verified: false,
										total_ratings: 0,
										total_views: 0,
										total_reviews: 0,
										total_visits: 0,
										services: servicesArr,
										portfolio: formData?.examplesOfWork,
										sales_email: formData?.salesEmail,
									},
								},
							});
							showToast(`Agency created successfully`, "success");
							setTimeout(() => {
								hideToast();
							}, 3000);

							localStorage.clear();

							const agencyId = agencyData?.createAgency?.id;

							await handleIndustryAndMinorityMutations(agencyId);


							// sessionStorage.setItem("agencyDataId", agencyId);

							sessionStorage.setItem("loginuserwithemail", formData?.email);

							await auth0.login(
								{
									email: formData?.email,
									password: formData?.password,
									redirectUri: process.env.REACT_APP_USER_LOGIN,
									responseType: 'token',
								},
								(err) => {
									if (err) console.log(err);
								},
							);

							setTimeout(() => {
								navigate(`/agency-listing/${agencyId}`);
							}, 3000)

						}
					}
				);

				hideSpinner();
			} catch (error) {
				console.log(error, "Email is Alreday taken");
				alert('Email is Already taken')
				hideSpinner();
				// Handle errors
			}
		} else {
			setStep((state) => state + 1);
		}
	};

	const handleIndustryAndMinorityMutations = async (agencyId) => {
		const industryPromises = formData?.selectedIndustries?.map((industry) => {
			return createAgencyIndustry({
				variables: {
					data: {
						name: industry,
						agency_id: agencyId,
					},
				},
			});
		});

		const minorityPromises = formData?.selectedMinorities?.map((minority) => {
			return createAgencyMinority({
				variables: {
					data: {
						name: minority,
						agency_id: agencyId,
					},
				},
			});
		});

		await Promise.all([...industryPromises, ...minorityPromises]);
	};

	const validateArrayObjects = (dataArray) => {
		for (const item of dataArray) {
			if (!item.title || !item.image_url_1 || !item.image_url_2) {
				return false;
			}
		}
		return true; // All objects are either empty or all fields are filled
	};

	useEffect(() => {
		const isServicesSelected = formData.selectedServices.length >= 1;
		const isIndustriesSelected = formData.selectedIndustries.length >= 1;
		setIsNextDisabled(!isServicesSelected || !isIndustriesSelected);
	}, [formData.selectedServices, formData.selectedIndustries]);

	useEffect(() => {
		console.log(formData?.companyName, formData?.companyWebsite, formData?.salesEmail, isWebsiteValid, isContactEmailValid, "###");

		if (
			formData?.companyName !== "" &&
			formData?.companyWebsite !== "" &&
			formData?.salesEmail !== "" &&
			isWebsiteValid &&
			isContactEmailValid
		) {
			setIsFirstDisabled(false);
		} else {
			setIsFirstDisabled(true);
		}
	}, [formData?.companyName, formData?.companyWebsite, formData?.salesEmail, isWebsiteValid, isContactEmailValid]);

	useEffect(() => {
		const isExamplesOfWorkStepDisabled = validateArrayObjects(
			formData.examplesOfWork
		);
		setValidateExamplesWorkFields(isExamplesOfWorkStepDisabled);
	}, [formData.examplesOfWork]);

	return (
		<>
			{isLoading ? (
				showSpinner()
			) : (
				<>
					<div className="mx-[5%] xl:mx-auto  max-w-[1100px]">
						<div className="grid grid-cols-12">
							<h4 className="text-[24px] font-montserrat font-semibold mb-5 min-w-[400px] col-span-12 flex justify-center">
								Create your Agency Listing
							</h4>
						</div>
					</div>
					{step === 1 && (
						<>
							<Step1 update={false} />
							<Section2
								update={false}
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
							<Step2 update={false} />
							<Section3
								formData={formData}
								handleSelectedItems={handleSelectedItems}
							/>
						</>
					)}
					{step === 3 && (
						<>
							<Step3 update={false} />
							<Section4
								formData={formData}
								handleFileUpload={handleFileUpload}
								imageUrls={imageUrls}
								setImageUrls={setImageUrls}
								thumbnailUrls={thumbnailUrls}
								setThumbnailUrls={setThumbnailUrls}
								showLabels={true}
								edit={false}
							/>
						</>
					)}
					{step === 4 && (
						<>
							<Step4 />
							<Section5
								formData={formData}
								handleFormDataChange={handleFormDataChange}
								passwordMatch={passwordMatch}
								setPasswordMatch={setPasswordMatch}
								error={error}
								setEmailError={setEmailError}
								emailError={emailError}
								passwordValidationError={passwordValidationError}
								setPasswordValidationError={setPasswordValidationError}
							/>
						</>
					)}
					<div className="border-t my-10 max-w-[1216px] border-[#EAECF0] mx-[5%] xl:mx-auto "></div>
					<div className="my-10 md:max-w-[1216px] sm:mx-[5%] xl:mx-auto min-w-[400px] col-span-12 flex justify-center items-center gap-20 sm:justify-between">
						{step <= 1 ? (
							<>
								{/* <button
                  className="w-[144px]  px-[16px] py-[10px] rounded-[8px] border border-[#EAECF0] flex items-center justify-center text-[14px] font-montserrat font-semibold"
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
						{step >= 4 ? (
							<>
								<button
									className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
									onClick={onSubmit}
									disabled={disabled || !passwordMatch || emailError || passwordValidationError !== "" ? true : false}
									style={{
										opacity:
											disabled || !passwordMatch || emailError || passwordValidationError !== "" ? 0.5 : 1,
										cursor: "pointer",
									}}
								>
									Save
								</button>
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
							<div className="flex" style={{ gap: "16px" }}>
								<button
									className="w-[144px] bg-[#F1F8FF] px-[16px] py-[10px] rounded-[8px] text-[#329BFA] flex items-center justify-center text-[14px] font-montserrat font-semibold"
									onClick={() => {
										setFormData({
											...formData,
											examplesOfWork: [{ title: "", image_url_1: null, image_url_2: null },
											{ title: "", image_url_1: null, image_url_2: null },
											{ title: "", image_url_1: null, image_url_2: null },]
										});
										setStep((state) => state + 1)
									}}
									style={{ border: "1px solid #329BFA" }}
								>
									Skip
								</button>
								<button
									className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
									onClick={() => setStep((state) => state + 1)}
									disabled={(!validateExamplesWorkFields || formData.examplesOfWork.filter((item, _) => { return (!item?.title && !item?.image_url_1 && !item?.image_url_2) }).length === 3)}
									style={{ opacity: (!validateExamplesWorkFields || formData.examplesOfWork.filter((item, _) => { return (!item?.title && !item?.image_url_1 && !item?.image_url_2) }).length === 3) ? 0.5 : 1 }}
								>
									Next
								</button>
							</div>
						) : (
							<div className="flex justify-center sm:justify-end w-[100%]">
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

export default CreateAgency;
