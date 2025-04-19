import { useEffect, useState } from "react";
import "./getmatchedmodal.css";
import { Modal } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { ReactComponent as CrossBtnIcon } from "../../assets/Icons/x-btn.svg";
import "./getmatchedmodal.css";
import circle from "../../assets/Icons/step-circle.png";
import circlelight from "../../assets/Icons/step-circle-light.png";
import check from "../../assets/Icons/step-check.png";
import { CostData, ExpertiesData, ServicesData } from "../../Utilities/utilities";
import PerfectMatchModal from "../Modal/PerfectMatchModal/Modal";
import { BeatLoader } from "react-spinners";
interface ModalProps {
	isOpen?: any;
	onClose?: any;
	onSubmitQuizz?: any;
	loading?: any;
}


interface FormState {
	email: string;
	// contact: string;
	website: string;
	description: string;
}

const GetMatched = ({ isOpen, onClose, onSubmitQuizz, loading }: ModalProps) => {


	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phoneRegex = /^\+?[ 1-9][0-9]{7,14}$/;
	const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}([/?].*)?$/;

	const steps = ["Service", "Expertise", "Budget", "Last step"];
	const [activeStep, setActiveStep] = useState(0);
	const [userQuizSelectedData, setUserQuizSelectedData] = useState({
		services: null,
		industry: null,
		budget: null,
		email: "",
		website: "",
		description: ""
	})
	const [validationErrors, setValidationErrors] = useState<Partial<FormState>>({});
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768 ? true : false)

	const data = [
		{
			description: "What do you need help with most?",
			tags: ServicesData,
		},
		{
			description: "What industry are you in?",
			tags: ExpertiesData,
		},
		{
			description: "What's your monthly agency budget?",
			tags: CostData,
		},
	];

	const lastStepData = [
		"What's your work email?",
		"What's your company's website?",
		"What are you looking for help with?",
	];

	const handleButtonColor = (selectedItem) => {
		if (activeStep === 0) {
			setUserQuizSelectedData({ ...userQuizSelectedData, services: selectedItem })
		}
		else if (activeStep === 1) {
			setUserQuizSelectedData({ ...userQuizSelectedData, industry: selectedItem })
		}
		else if (activeStep === 2) {
			setUserQuizSelectedData({ ...userQuizSelectedData, budget: selectedItem })
		}
		setActiveStep(activeStep + 1);
	};

	const CustomStepIcon = ({ active, completed }) => {
		console.log(active, completed, "123");

		if (active) {
			return <img src={circle} alt="circle-icon" />;
		} else if (completed) {
			return <img src={check} alt="check-icon" />;
		}
		else {
			return <img src={circlelight} alt="circle-icon" />;
		}
	};

	const get3Matches = (e) => {
		e.preventDefault();

		// Clear previous validation errors
		setValidationErrors({});

		const errors: Partial<FormState> = {};

		if (!userQuizSelectedData.email) {
			errors.email = "Please enter an email.";
		} else if (!emailRegex.test(userQuizSelectedData.email)) {
			errors.email = "Please enter a valid email address.";
		}

		if (!userQuizSelectedData.website) {
			errors.website = "Please enter a website URL.";
		} else if (!websiteRegex.test(userQuizSelectedData.website)) {
			errors.website = "Please enter a valid website URL.";
		}

		if (!userQuizSelectedData.description) {
			errors.description = "Please enter a description.";
		}

		if (Object.keys(errors).length > 0) {
			// Display all validation errors together
			setValidationErrors(errors);
			return;
		}

		onSubmitQuizz(userQuizSelectedData)

	}

	useEffect(() => {
		if (!isOpen) {
			setActiveStep(0)
			setUserQuizSelectedData({
				services: null,
				industry: null,
				budget: null,
				email: "",
				website: "",
				description: ""
			})
			setValidationErrors({})

		}
	}, [isOpen])

	const debouncedHandleResize = () => {

		if (window.innerWidth < 768) {
			setIsMobile(true)
		}
		else {
			setIsMobile(false)
		}
	}

	useEffect(() => {

		window.addEventListener('resize', debouncedHandleResize)

		return () => {
			window.removeEventListener('resize', debouncedHandleResize)
		}
	}, [])


	return (
		<>
			<Modal
				open={isOpen}
				onClose={onClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				className="custom-modal"
			>
				<div className="lg:w-[848px] px-[24px] py-[24px]  bg-whiteColor get-matched-modal-container" style={{ minHeight: "600px", height: "min-content" }}>
					<div className="flex flex-col gap-[32px]">
						<div className="relative">
							<div className={`text-center font-semibold leading-8 ${isMobile ? " text-[18px] " : " text-[24px] "} text-[#344054] font-inter`}>
								Get Matched
							</div>
							{
								isMobile &&
								<div className="text-center font-semibold leading-8 text-[14px] text-[#344054] font-inter">
									{`(60 sec, completely free)`}
								</div>
							}
							<div
								role="button"
								onClick={onClose}
								className="absolute right-[-6px] top-[-6px]"
							>
								<CrossBtnIcon />
							</div>
						</div>
						<div style={{ width: "100%", maxWidth: "800px", alignSelf: "center" }}>
							<Stepper
								activeStep={activeStep}
								alternativeLabel
								sx={{
									width: "100%",
									"& .MuiStepConnector-line": {
										display: "none"
									},
								}}
							>
								{

									<>
										{steps.map((label, index) => (
											<Step key={label}>
												<StepLabel
													StepIconComponent={({ active, completed }) => {
														if (index === activeStep) {
															return <img src={circle} alt="circle-icon" style={{ zIndex: 2, backgroundColor: "white" }} />;
														} else if (index < activeStep) {
															return <img src={check} alt="check-icon" style={{ zIndex: 2, backgroundColor: "white" }} />;
														}
														else {
															return <img src={circlelight} alt="circle-icon" style={{ zIndex: 2, backgroundColor: "white" }} />;
														}
													}} style={{ position: "relative" }}>
													{
														!isMobile &&

														<span
															style={{
																color: index === activeStep ? "#3364F7" : "#344054",
																fontSize: "16px",
																fontWeight: "600",
																lineHeight: "20px",
															}}
														>
															{label}
														</span>
													}
													{
														index !== 0 &&
														<div style={{ height: "2px", width: "100%", background: index <= activeStep ? "#3364f7" : "#EAECF0", position: "absolute", top: "10px", left: "-55%", zIndex: 1 }}></div>
													}

												</StepLabel>
											</Step>
										))}

									</>
								}

							</Stepper>
							{
								isMobile &&
								<div className="w-full flex" style={{ alignItems: "center", justifyContent: "center" }}>
									<span
										style={{
											color: "#3364F7",
											fontSize: "16px",
											fontWeight: "600",
											lineHeight: "20px",
										}}
									>
										{steps[activeStep]}
									</span>
								</div>
							}
						</div>
					</div>
					<div
						className={`flex flex-col gap-[16px] items-center justify-center ${isMobile ? "pt-[16px]" : activeStep === 3 ? "pt-[24px]" : "pt-[44px]"
							}  px-[0px] pb-[0px]`}
					>
						{activeStep === 3 ? (
							<>
								{lastStepData.map((des, index) => (
									<div className="flex flex-col items-center justify-center gap-[8px]" style={{ width: "calc(100% - 32px)", maxWidth: "400px" }}>
										<p className="font-inter text-[18px] font-semibold leading-[28px] text-[#344054]" style={{ textAlign: "left", alignSelf: "flex-start" }}>
											{des}
										</p>
										<div className="flex flex-col items-start gap-[6px] self-stretch">
											{
												index !== 2
													?
													<input
														className={`flex ${index === 2 ? "h-[100px] self-start pt-0" : "h-[40px]"
															} w-full px-[8px] py-[12px] self-stretch rounded-[8px]`}
														type="text"

														name={index === 0 ? "email" : index === 1 ? "website" : "description"}
														value={index === 0 ? userQuizSelectedData.email : index === 1 ? userQuizSelectedData.website : userQuizSelectedData.description}
														onChange={(e) => {
															setUserQuizSelectedData({
																...userQuizSelectedData,
																[e.target.name]: e.target.value
															})

															if (validationErrors?.email && e.target.name === "email") {
																if (!e.target.value) {
																	setValidationErrors({ ...validationErrors, email: "Please enter an email." })
																} else if (!emailRegex.test(e.target.value)) {
																	setValidationErrors({ ...validationErrors, email: "Please enter a valid email address." })
																} else {
																	setValidationErrors({ ...validationErrors, email: "" })
																}
															} else if (validationErrors?.website && e.target.name === "website") {
																if (!e.target.value) {
																	setValidationErrors({ ...validationErrors, website: "Please enter a website URL." })
																} else if (!websiteRegex.test(e.target.value)) {
																	setValidationErrors({ ...validationErrors, website: "Please enter a valid website URL." })
																} else {
																	setValidationErrors({ ...validationErrors, website: "" })
																}
															}

														}}
														style={{
															outline: "none",
															borderColor: validationErrors[index === 0 ? "email" : index === 1 ? "website" : "description"]
																? "#F04438"
																: "#D0D5DD",
														}}
													/>
													:
													<textarea
														className={` self-start pt-0 w-full px-[8px] py-[12px] self-stretch rounded-[8px]`}
														style={{
															height: "100px", maxHeight: "100px", minHeight: "100px", outline: "none",
															borderColor: validationErrors["description"]
																? "#F04438"
																: "#D0D5DD",
														}}
														name={"description"}
														value={userQuizSelectedData.description}
														onChange={(e) => {
															setUserQuizSelectedData({
																...userQuizSelectedData,
																[e.target.name]: e.target.value
															})

															if (validationErrors?.description) {
																if (!userQuizSelectedData.description) {
																	setValidationErrors({ ...validationErrors, description: "Please enter a description." })
																} else {
																	setValidationErrors({ ...validationErrors, description: "" })
																}
															}
														}}
													/>
											}
											{validationErrors[index === 0 ? "email" : index === 1 ? "website" : "description"] && (
												<p className=" text-sm" style={{ color: "#F04438" }}>
													{validationErrors[index === 0 ? "email" : index === 1 ? "website" : "description"]}
												</p>
											)}
										</div>
									</div>
								))}
								<div className="flex pt-[24px]">
									{
										loading
											?
											<BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
											:
											<button className="flex py-[10px] px-[18px] justify-center rounded-[8px] bg-[#329BFA] text-whiteColor text-[16px] font-semibold leading-[24px]" onClick={(e) => { get3Matches(e) }}>
												View 3 Matches
											</button>
									}

								</div>
							</>
						) : (
							<>
								<p className="text-center text-[18px] font-semibold leading-[28px] text-color">
									{data[activeStep].description}
								</p>
								<div className="flex gap-x-[4px] gap-y-[8px] items-start justify-center" style={{ width: "100%", maxWidth: "632px", flexWrap: "wrap" }}>
									{data[activeStep]?.tags.map((item, index) => (
										<div
											key={index}
											className="flex justify-center items-center gap-[8px] h-[26px] px-[12px] py-[12px] max-w-fit relative getMacthedTab"
											style={{
												transform: "skewX(-12deg)",
												border: "1px solid #EAECF0",
												borderRadius: "8px",
												// fontStyle: "italic",
												color: "#344054"
											}}
											role="button"
											onClick={() => { handleButtonColor(activeStep === 0 ? item.id : activeStep === 1 ? item.buttonText : item.value) }}
										>
											<p
												className="flex items-center justify-between hover:cursor-pointer text-[16px] rounded-2xl  font-bold font-['Bebas Neue Pro'] uppercase tracking-tight"
											>
												{activeStep === 2 ? (item.value === 1 ? "under $3k" : item.value === 2 ? "under $10k" : item.value === 3 ? "under $30k" : item.value === 4 ? "under $60k" : "over $60k") : item.buttonText}
											</p>
										</div>
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</Modal>


		</>
	);
};
export default GetMatched;
