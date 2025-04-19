import { gql, useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import ToastContext from '../Context/ToastContext';

const SEND_EMAIL = gql`
	mutation ContactUs($data: ContactUsInput!) {
		ContactUs(data: $data) {
			status
		}
	}
`;

export default function ContactForm() {
	const [description, setDescription] = useState('');
	const [textAreaL, settextAreaL] = useState(0);
	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle the form submission logic here
	};

	// State to hold the selected option
	const [selectedOption, setSelectedOption] = useState('');
	const [userAgency, setUserAgency] = useState<any>(null);
	const [sendMail] = useMutation(SEND_EMAIL);
	const { showToast, hideToast } = useContext(ToastContext);
	const [ticketError, setTicketError] = useState<any>(false);
	const [descriptionError, setDescriptionError] = useState<any>(false);

	// Handler to update state when an option is selected
	const handleSelectChange = (event) => {
    if(event.target.name == 'ticket'){
      if(event.target.value !== ''){
        setTicketError(false);
      }
    }
		setSelectedOption(event.target.value);
	};

	const sendContactUsMail = async (ticketType, description) => {
		if (ticketType !== '' && description !== '') {
			const data = {
				agencyId: parseInt(userAgency?.id),
				ticketType: ticketType,
				details: description,
			};
			try {
				const result = await sendMail({
					variables: { data: data },
				});
        setDescription('')
        setSelectedOption('')
				showToast('Email sent successfully!', 'success');
				setTimeout(() => {
					hideToast();
				}, 3000);
			} catch (error) {
				showToast('Unable to send email. Please try again!', 'warn');
				setTimeout(() => {
					hideToast();
				}, 3000);
			}
		} else {
			if (ticketType === '') {
				setTicketError(true);
			}if (description === '') {
				setDescriptionError(true);
			}
		}
	};

	const userAgencyData = localStorage.getItem('user_agency');

	useEffect(() => {
		if (
			userAgencyData !== undefined &&
			userAgencyData !== 'undefined' &&
			JSON.parse(`${userAgencyData}`)
		) {
			let agency = JSON.parse(`${userAgencyData}`);
			setUserAgency(agency?.agency || null);
		}
	}, [userAgencyData]);

	return (
		<div className='p-[12px]' style={{ width: '100%' }}>
			<p
				style={{ fontFamily: 'Montserrat' }}
				className='font-semibold text-[24px] leading-[30px] text-[#344054]'
			>
				Contact Us
			</p>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4 my-[32px]'>
				<div className='flex flex-col gap-[4px]'>
					<p
						style={{ fontFamily: 'Montserrat' }}
						className='text-[14px] leading-[20px]  text-[#344054]'
					>
						Type of ticket
						<span className='text-[#D92D20]'>*</span>
					</p>
					<div
						className='w-[100%] relative'
						style={{ border: ticketError ? '1px solid red' : '', borderRadius: '8px' }}
					>
						<input
							style={{ fontFamily: 'Montserrat' }}
							className='w-[100%] h-[40px] bg-[#F2F4F7] px-[14px] py-[10px]  rounded-[8px] text-[#667085] text-[14px] leading-[20px]'
							type='text'
							placeholder='Import Reviews'
						/>
						<select
							style={{ background: 'white' }}
							className=' w-[100%] h-[40px] outline-0 border border-[#D0D5DD] bg-[#F2F4F7] py-[10px] px-[14px] rounded-[8px] text-[#667085] text-[14px] leading-[20px]  absolute top-0 left-0 z-2'
							value={selectedOption}
              name='ticket'
							onChange={handleSelectChange}
						>
              <option value=''>Please select a ticket</option>
							<option value={'Report a Bug'}>Report a Bug</option>
							<option value={'Request a feature'}>Request a feature</option>
							<option value={'Billing & subscription'}>
								Billing & subscription
							</option>
							<option value={'Other'}>Other</option>
						</select>
					</div>
				</div>
				<div className='flex flex-col gap-[4px]'>
					<p
						style={{ fontFamily: 'Inter' }}
						className='text-[14px] leading-[20px]  text-[#344054]'
					>
						Description
						<span className='text-[#D92D20]'>*</span>
					</p>
					<div
						className='relative py-[12px] px-[14px]  border border-[#D0D5DD]  rounded-[8px]'
						style={{ border: descriptionError ?'1px solid red': '' }}
					>
						<textarea
							style={{ fontFamily: 'Inter', padding: '12px 14px' }}
							className='w-[100%] outline-0 border-0 resize-none font-normal text-[#667085] text-[16px] leading-[20px] '
							placeholder='Enter detailed description'
							value={description}
							required
              name='description'
							onChange={(e) => {
								if (e.target.value.length <= 1000) {
									setDescription(e.target.value);
									settextAreaL(e.target.value.length);
								}
                if(e.target.value.length > 0){
                  setDescriptionError(false);
                }
							}}
						/>
						<p className='font-normal absolute bottom-[4px] right-[8px] text-[#667085] text-[16px] leading-[20px] '>
							{textAreaL}/1000
						</p>
					</div>
				</div>
			</form>
			<div className='flex gap-[12px] flex-wrap md:justify-end justify-center'>
				{/* <button className=" w-[194px] h-[44px] spy-[10px] px-[18px] font-semibold leading-[24px] text-[#344054] rounded-[8px] border border-[#D0D5DD]">
          Cancel
        </button> */}
				<button
					className=' w-[194px] bg-[#329BFA] h-[44px] spy-[10px] px-[18px] font-semibold leading-[24px] text-[#FFF] rounded-[8px] '
					onClick={() => {
						sendContactUsMail(selectedOption, description);
					}}
				>
					Submit
				</button>
			</div>
		</div>
	);
}
