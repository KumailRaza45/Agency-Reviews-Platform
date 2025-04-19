import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import ToastContext from '../../Context/ToastContext';
import { AgencyDetailsType } from '../../Interface';
import CollapseButton from '../../Components/CollapseButton/CollapseButton';
import GoogleAnalyticsContext from '../../Context/GoogleAnalyticsContext';
import Get2MoreAgencies from '../../Components/Modal/Get2MoreAgencies';
import {
	GET_PERFECT_MATCHED,
	SEND_BULK_LEADS,
} from '../../Components/GetMatchedFlow';
import { ServicesData } from '../../Utilities/utilities';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { ReactComponent as MailIcon } from '../../assets/Icons/mail-01.svg';
import { ReactComponent as WebsiteIcon } from '../../assets/Icons/link-02.svg';
import ContactUsModal from '../../Components/Modal/ContactUs';

interface AgencyDetailsProps {
	pageContent: AgencyDetailsType;
}

interface FormState {
	email: string;
	contact: string;
	website: string;
	description: string;
}

export const CREATE_LEAD = gql`
	mutation createLead($data: CreateLeadInput!) {
		createLead(data: $data) {
			id
			email
			contact
			website
			description
		}
	}
`;

const Section3: React.FC<AgencyDetailsProps> = ({ pageContent }) => {
	const { id } = useParams();
	const tempId: any = id;
	const [createLeadMutation, { loading }] = useMutation(CREATE_LEAD);
	const { toastMessage, showToast, hideToast } = useContext(ToastContext);
	const { sendGoogleAnalytics } = useContext(GoogleAnalyticsContext);
	const [show2MoreAgenciesModal, setShow2MoreAgenciesModal] = useState(false);
	const [sendingLeadsLoading, setSendingLeadsLoading] = useState(false);

	const initialFormState: FormState = {
		email: '',
		contact: '',
		website: '',
		description: '',
	};
	const [form, setForm] = useState<FormState>(initialFormState);
	const [validationErrors, setValidationErrors] = useState<Partial<FormState>>(
		{},
	);
	const [openGetInTouchModal, setOpenGetInTouchModal] = useState(false);

	const MAX_PHONE_LENGTH = 12; // Including dashes

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phoneRegex = /^\+?[ 1-9][0-9]{7,14}$/;
	const websiteRegex =
		/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}([/?].*)?$/;

	const [
		getPerfectMatched,
		{
			loading: getMatchedAgenciesLoading,
			data: perfectMactchedAgencies,
			error,
		},
	] = useLazyQuery(GET_PERFECT_MATCHED);
	const [sendBulkLeads] = useMutation(SEND_BULK_LEADS);

	const formatPhoneNumber = (phoneNumber: string) => {
		const cleaned = ('' + phoneNumber).replace(/\D/g, '');
		const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

		if (match) {
			const formattedPhoneNumber = [match[1], match[2], match[3]]
				.filter((group) => !!group)
				.join('-');

			return formattedPhoneNumber;
		}
		return phoneNumber;
	};

	const handleChange = (event: any) => {
		const { name, value } = event?.target
			? event.target
			: { name: 'contact', value: event };
		let errors: Partial<FormState> = { ...validationErrors };

		if (name === 'email') {
			if (!value) {
				errors.email = 'Please enter an email.';
			} else if (!emailRegex.test(value)) {
				errors.email = 'Please enter a valid email address.';
			} else {
				delete errors.email;
			}
		} else if (name === 'website') {
			if (!value) {
				errors.website = 'Please enter a website URL.';
			} else if (!websiteRegex.test(value)) {
				errors.website = 'Please enter a valid website URL.';
			} else {
				delete errors.website;
			}
		} else if (name === 'description') {
			if (!value) {
				errors.description = 'Please enter a description.';
			} else {
				delete errors.description;
			}
		}  else if (name === 'contact') {
			if (value && !phoneRegex.test(value)) {
				errors.contact = 'Please enter a valid phone number.';
			} else {
				delete errors.contact;
			}
		}

		setValidationErrors(errors);

		setForm({
			...form,
			[name]: value,
		});
	};

	const handleSubmitForm = async (e: any) => {
		e.preventDefault();

		// Clear previous validation errors
		setValidationErrors({});

		const errors: Partial<FormState> = {};

		if (!form.email) {
			errors.email = 'Please enter an email.';
		} else if (!emailRegex.test(form.email)) {
			errors.email = 'Please enter a valid email address.';
		}

		if (form.contact && !phoneRegex.test(form.contact)) {
			errors.contact = 'Please enter a valid phone number.';
		}
		
		if (!form.website) {
			errors.website = 'Please enter a website URL.';
		} else if (!websiteRegex.test(form.website)) {
			errors.website = 'Please enter a valid website URL.';
		}

		if (!form.description) {
			errors.description = 'Please enter a description.';
		}

		if (Object.keys(errors).length > 0) {
			// Display all validation errors together
			setValidationErrors(errors);
			return;
		}

		try {
			const result = await createLeadMutation({
				variables: {
					data: {
						email: form.email,
						contact: form.contact,
						website: form.website,
						description: form.description,
						agency_id: parseFloat(tempId),
						status: 'received',
					},
				},
			});
			showToast('Inquiry submitted successfully!', 'success');
			sendGoogleAnalytics({ capturedAction: 'submit_lead' });

			// const servicesIds = ServicesData.filter((_service, _) => { return (_service.buttonText === pageContent.services[0].service.name) })
			const servicesIds = pageContent.services.map((srvc, _) => {
				// console.log(ServicesData.filter((_service, _) => { return (_service.buttonText === srvc.service.name) }), "####");

				if (
					ServicesData.filter((_service, _) => {
						return _service.buttonText === srvc.service.name;
					}).length > 0
				) {
					return ServicesData.filter((_service, _) => {
						return _service.buttonText === srvc.service.name;
					})[0].id;
				}
			});
			// console.log(servicesIds, "#####");

			const res = await getPerfectMatched({
				variables: {
					services: servicesIds,
					count: 2,
					agency: parseInt(`${id}`),
				},
			});

			if (
				!res.error ||
				res.data ||
				res?.data?.getTopMatchedAgencies?.agencies.length > 0
			) {
				setShow2MoreAgenciesModal(true);
			}

			setTimeout(() => {
				hideToast();
			}, 2000);
		} catch (error) {
			// Handle error here
			console.error(error);
		}
	};

	const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
	const handleResize = () => {
		setScreenWidth(window.innerWidth);
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const sendLeads = async (agencies) => {
		setSendingLeadsLoading(true);
		try {
			await sendBulkLeads({
				variables: {
					// data: _data.filter((ag, _) => { return (ag !== undefined) })
					data: agencies.map((_agency: any, key) => {
						return {
							email: form?.email,
							contact: form.contact,
							website: form?.website,
							description: form?.description,
							agency_id: _agency.id,
							status: 'received',
						};
					}),
				},
			});
			setSendingLeadsLoading(false);
			setShow2MoreAgenciesModal(false);
			setForm(initialFormState);
			showToast('Lead submitted successfully!', 'success');

			setTimeout(() => {
				hideToast();
			}, 2000);
		} catch {
			//
		}
	};

	const get2UniqueAgency = (agencies) => {
		let tempAgencies = agencies?.filter((ag, _) => {
			return ag.id !== parseInt(tempId);
		});
		console.log(tempAgencies, tempId, 'tempAgencies');

		if (tempAgencies && tempAgencies.length > 2) {
			return [tempAgencies[0], tempAgencies[1]];
		} else {
			return tempAgencies;
		}
	};

	return (
		<>
			{perfectMactchedAgencies?.getTopMatchedAgencies?.agencies?.length > 0 && (
				<Get2MoreAgencies
					agencies={
						get2UniqueAgency(
							perfectMactchedAgencies?.getTopMatchedAgencies?.agencies,
						) || []
					}
					isOpen={show2MoreAgenciesModal}
					onClose={() => {
						setShow2MoreAgenciesModal(false);
						setForm(initialFormState);
					}}
					onSubmit={(agencies) => {
						sendLeads(agencies);
					}}
					loading={sendingLeadsLoading}
					agencyName={pageContent?.name}
					btnTitle='Add These 2'
				/>
			)}

			<div id='highlights' className='mx-[5%] xl:mx-auto  max-w-[1216px] mt-10'>
				<div
					className={
						screenWidth < 600
							? 'text-center'
							: 'flex flex-wrap lg:flex-nowrap justify-between gap-20 lg:gap-[10%]'
					}
				>
					<div className='w-full lg:w-[45%]'>
						<h6 className='text-[24px] font-semibold  font-inter tracking-[0.44px] mb-2'>
							About {pageContent?.name}
						</h6>
						<p className='text-[14px] font-normal font-montserrat leading-[20px] text-black mt-5'>
							{/* {pageContent?.bio ?? ""} */}
							{screenWidth > 600 ? (
								pageContent?.bio ?? ''
							) : (
								<CollapseButton
									desc={pageContent?.bio ?? ''}
									length={160}
									label='See'
								/>
							)}
						</p>
						<div className='grid grid-cols-1 mt-6 gap-1'>
							<span className='font-montserrat text-sm not-italic font-semibold leading-5 mb-1'>
								Services
							</span>
							<div
								className='flex items-center gap-[8px]'
								style={screenWidth < 600 ? { margin: '0px auto' } : {}}
							>
								{pageContent?.services?.map((service, index) => (
									<div
										key={index}
										className='flex justify-center items-center gap-[8px] h-[26px] pr-[9px] max-w-fit relative'
										style={{
											backgroundColor: '#3364F7',
											transform: 'skewX(-12deg)',
											borderRadius: '8px',
										}}
									>
										<p className='text-[18px] uppercase text-[#FFF] font-babas flex items-center justify-between pl-2'>
											{service?.service?.name}{' '}
										</p>
									</div>
								))}
							</div>
						</div>
						<div className='grid grid-cols-1 mt-6 gap-1'>
							<span className='font-montserrat text-sm not-italic font-semibold leading-5 mb-1'>
								Industry Expertise
							</span>
							<div
								className='flex items-center gap-[8px]'
								style={screenWidth < 600 ? { margin: '10px auto' } : {}}
							>
								{pageContent?.industries?.map((industry, index) => (
									<div
										key={index}
										className='py-1 px-[10px] border border-ExpertiseTag bg-checkbox shadow-sm bg-customShadow rounded-lg'
									>
										<p className='text-DolorsColor text-center font-inter text-sm not-italic font-medium leading-5'>
											{industry.name}
										</p>
									</div>
								))}
							</div>
						</div>
						{screenWidth < 600 && (
							<div className='flex items-center justify-center pt-5'>
							<button
								className='w-[244px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold'
								type='submit'
								onClick={() => {
									setOpenGetInTouchModal(true);
								}}
								style={{
									opacity: 1,
									cursor: 'pointer',
								}}
							>
								Start a convo
							</button>
							</div>
						)}
					</div>
					{pageContent?.status == 'unverified' ? (
						<div
							className='bg-[#F2F4F7] rounded-[8px] border border-[#EAECF0] mt-5'
							style={{
								height: '80px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '0px 25px',
							}}
						>
							<h6 className='text-[16px] font-semibold  font-inter tracking-[0.44px] mb-2 text-[#344054]'>
								Is this your Agency?
								<button
									className='button w-[200px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF]  text-[14px] font-montserrat font-semibold ml-5'
									style={{ marginTop: '6px' }}
								>
									<Link
										to={
											'https://calendly.com/diego-agency-reviews/30min?utm_source=site_listing&utm_medium=site_listing&utm_campaign=site_listing'
										}
										target='_blank'
									>
										Click here to verify
									</Link>
								</button>
							</h6>
						</div>
					) : (
						<>
							{screenWidth < 600 ? (
								<ContactUsModal
									isOpen={openGetInTouchModal}
									onClose={() => {
										setOpenGetInTouchModal(false);
									}}
									onSubmit={handleSubmitForm}
									loading={loading || sendingLeadsLoading}
									agencyName={''}
								/>
							) : (
								<div
									className='w-full flex lg:w-[53%]'
									style={{
										backgroundColor: '#F9FAFB',
										border: '1px solid #EAECF0',
										borderRadius: '8px',
										padding: '24px',
										gap: '16px',
										flexDirection: 'column',
									}}
								>
									<h6
										className='text-[24px] font-semibold  font-inter tracking-[0.44px] mb-2'
										style={{ color: '#344054' }}
									>
										Start a conversation!
									</h6>
									<form>
										<div className='flex items-center gap-[4%]'>
											<div
												className='w-full'
												style={{ marginTop: validationErrors.email && '18px' }}
											>
												<label
													style={{ color: '#344054' }}
													htmlFor='email'
													className='block mb-1 text-[14px] font-montserrat font-semibold text-gray-700 dark:text-white text-left'
												>
													Work Email <span className='text-[#F04438]'>*</span>
												</label>
												<div
													className={`flex items-center w-full pl-2 bg-whiteColor rounded-[8px] sm:text-xs  dark-bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark-focus-ring-blue-500 dark-focus-border-blue-500`}
													style={{
														border: validationErrors.email
															? '1px solid #F04438'
															: '1px solid #D0D5DD',
													}}
												>
													<MailIcon />
													<input
														type='email'
														id='email'
														name='email'
														value={form?.email}
														onChange={handleChange}
														placeholder='e.g, john@company.com'
														style={{
															outline: 'none',
															border: 'none',
														}}
													/>
												</div>

												{validationErrors.email && (
													<p className=' text-sm' style={{ color: '#F04438' }}>
														{validationErrors.email}
													</p>
												)}
											</div>

											<div className='w-full'>
												<label
													htmlFor='phone'
													style={{ color: '#344054' }}
													className='block mb-1 text-[14px] font-montserrat font-semibold text-gray-700 dark:text-white text-left'
												>
													Phone
												</label>
												<div
													className='relative'
													style={{
														verticalAlign: 'middle',
														display: 'inline-block !important',
													}}
												>
													<PhoneInput
														onChange={handleChange}
														value={form?.contact}
														required={false}
														name='contact'
														defaultCountry='US'
														placeholder='+1 (555) 000-0000'
														style={{ outline: 'none', background: 'white' }}
														className='flex w-full text-gray-900 border border-[#D0D5DD] rounded-[8px] pl-2 sm:text-xs dark-bg-gray-700 dark-border-gray-600 dark-text-white'
													/>
													{validationErrors.contact && (
														<p
															className=' text-sm'
															style={{ color: '#F04438' }}
														>
															{validationErrors.contact}
														</p>
													)}
												</div>
											</div>
										</div>

										<div className='w-full mt-5'>
											<label
												htmlFor='website'
												style={{ color: '#344054' }}
												className='block mb-1 text-[14px] font-montserrat font-semibold text-gray-700 dark:text-white text-left'
											>
												Website <span className='text-[#F04438]'>*</span>
											</label>
											<div
												className={`flex items-center w-full pl-2 bg-whiteColor rounded-[8px] sm:text-xs  dark-bg-gray-700 `}
												style={{
													border: validationErrors.website
														? '1px solid #F04438'
														: '1px solid #D0D5DD',
												}}
											>
												<WebsiteIcon />

												<input
													type='text'
													id='website'
													name='website'
													value={form?.website}
													onChange={handleChange}
													placeholder='e.g, https://www.yourwebsite.com'
													style={{
														outline: 'none',
														border: 'none',
													}}
												/>
											</div>
											{validationErrors.website && (
												<p className=' text-sm' style={{ color: '#F04438' }}>
													{validationErrors.website}
												</p>
											)}
										</div>
										<div
											className='w-full mt-5'
											style={{ position: 'relative' }}
										>
											<label
												htmlFor='website'
												style={{ color: '#344054' }}
												className='block mb-1 text-[14px] font-montserrat font-semibold text-gray-700 dark:text-white text-left'
											>
												What are you looking for help with?{' '}
												<span className='text-[#F04438]'>*</span>
											</label>
											<textarea
												maxLength={500}
												typeof='text'
												id='description'
												name='description'
												value={form?.description}
												placeholder='Enter details here...'
												onChange={handleChange}
												style={{
													resize: 'none',
													outline: 'none',
													borderColor: validationErrors.description
														? '#F04438'
														: '#D0D5DD',
												}}
												className='block w-full p-2 text-gray-900 border rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus-ring-blue-500 dark-focus-border-blue-500'
											></textarea>
											<span
												className='block text-[14px] font-montserrat font-normal dark:text-white text-left'
												style={{
													position: 'absolute',
													right: '6px',
													top: '150px',
													color: '#667085',
												}}
											>{`${form?.description.length}/500`}</span>
											{validationErrors.description && (
												<p className=' text-sm' style={{ color: '#F04438' }}>
													{validationErrors.description}
												</p>
											)}
										</div>
										<div className='flex items-center justify-end mt-10'>
											<button
												className='w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold'
												type='submit'
												onClick={handleSubmitForm}
												disabled={loading}
												style={{
													opacity:
														loading || Object.keys(validationErrors).length > 0
															? 0.5
															: 1,
													cursor: 'pointer',
												}}
											>
												Submit
											</button>
										</div>
									</form>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Section3;
