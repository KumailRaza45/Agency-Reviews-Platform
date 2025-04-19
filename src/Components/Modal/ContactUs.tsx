import React, { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Checkmark } from 'react-checkmark';

import Card from '../Card/Card';
import { ReactComponent as CrossBtnIcon } from '../../assets/Icons/x-btn.svg';
import { BeatLoader } from 'react-spinners';
import { useMutation } from '@apollo/client';
import { INCREMENT_AGENCY_VIEWS } from '../../Pages/AgencyList';
import { Checkbox } from '@mui/material';
import { Employees, stringToSlug } from '../../Utilities/utilities';
import RatingStars from '../RatingStars';

import { ReactComponent as Logo } from '../../assets/Icons/VerifiedLogo.svg';
import { ReactComponent as NotVerifiedLogo } from '../../assets/Icons/Notverified.svg';
import PlaceHolderLogo from '../../assets/Icons/logo-placeholder.jpg';
import ArrowRight from '../../assets/Icons/arrow-right-icon.svg';

import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { ReactComponent as MailIcon } from '../../assets/Icons/mail-01.svg';
import { ReactComponent as WebsiteIcon } from '../../assets/Icons/link-02.svg';
import { FiUsers as Users } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import GoogleAnalyticsContext from '../../Context/GoogleAnalyticsContext';

interface FormState {
	email: string;
	contact: string;
	website: string;
	description: string;
}

const ContactUsModal = ({
	isOpen,
	onClose,
	onSubmit,
	loading,
	agencyName,
}: {
	isOpen: any;
	onClose: any;
	onSubmit: any;
	loading: any;
	agencyName: any | never;
}) => {
	const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
	const [openSimilerAgenciesModal, setOpenSimilerAgenciesModal] =
		useState(false);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const debouncedHandleResize = () => {
		setScreenWidth(window.innerWidth);
	};

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

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phoneRegex = /^\+?[ 1-9][0-9]{7,14}$/;
	const websiteRegex =
		/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}([/?].*)?$/;

	const handleChange = (event) => {
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
		} else if (name === 'contact') {
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

		onSubmit(form);
	};

	useEffect(() => {
		window.addEventListener('resize', debouncedHandleResize);

		return () => {
			window.removeEventListener('resize', debouncedHandleResize);
		};
	}, []);

	useEffect(() => {
		if (!isOpen) {
			setForm(initialFormState);
		}
	}, [isOpen]);

	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box
				sx={screenWidth < 600 ? mobileStyle : style}
				className='custom-scroll-bar'
			>
				<p
					className={`text-gray-900 text-left font-inter font-semibold text-[${
						screenWidth < 600 ? '18px' : '24px'
					}]`}
				>
					{agencyName ? `Contact ${agencyName}` : 'Start a conversation'}
				</p>
				<div
					role='button'
					onClick={onClose}
					className='absolute right-[16px] top-[16px]'
				>
					<CrossBtnIcon />
				</div>
				<form className='mt-5'>
					{screenWidth < 600 ? (
						<>
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

							<div className='w-full pt-5'>
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
										<p className=' text-sm' style={{ color: '#F04438' }}>
											{validationErrors.contact}
										</p>
									)}
								</div>
							</div>
						</>
					) : (
						<div className='flex items-center gap-[10%]'>
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
										<p className=' text-sm' style={{ color: '#F04438' }}>
											{validationErrors.contact}
										</p>
									)}
								</div>
							</div>
						</div>
					)}

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
					<div className='w-full mt-5' style={{ position: 'relative' }}>
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
						{loading ? (
							<BeatLoader
								color='#3364F7'
								cssOverride={{}}
								loading
								speedMultiplier={0.5}
							/>
						) : (
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
						)}
					</div>
				</form>
			</Box>
		</Modal>
	);
};

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'calc(100vw - 36px)',
	maxWidth: '595px',
	bgcolor: 'background.paper',
	borderRadius: '8px',
	boxShadow: 24,
	p: '24px',
	maxHeight: '870px',
	display: 'flex',
	flexDirection: 'column',
};

const mobileStyle = {
	position: 'absolute',
	top: '18%',
	height: 'fit-content',
	width: 'calc(100vw - 36px)',
	bgcolor: 'background.paper',
	borderRadius: '8px',
	boxShadow: 24,
	padding: '24px',
	// padding: "16px",
	border: '1px solid var(--Gray-200, #EAECF0)',
	background: 'var(--Gray-50, #F9FAFB)',
	margin: '16px',
	display: 'flex',
	flexDirection: 'column',
};

export default ContactUsModal;
