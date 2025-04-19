import { useJsApiLoader } from '@react-google-maps/api';
import React, { useContext, useEffect, useState } from 'react';
import { FiUsers as Users } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import RatingStars from '../../Components/RatingStars';
import {
	Employees,
	ServicesData,
	stringToSlug,
} from '../../Utilities/utilities';
import { ReactComponent as Logo } from '../../assets/Icons/VerifiedLogo.svg';
import { ReactComponent as NotVerifiedLogo } from '../../assets/Icons/Notverified.svg';
import PlaceHolderLogo from '../../assets/Icons/logo-placeholder.jpg';
import ArrowRight from '../../assets/Icons/arrow-right-icon.svg';
import MessageDots from '../../assets/Icons/message-dots-square.svg';
import Copy from '../../assets/Icons/copy.svg';

import AgencyMobileCard from '../../Components/AgencyMobileCard/AgencyMobileCard';
import { Modal } from '@mui/material';
import ContactUsModal from '../../Components/Modal/ContactUs';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { CREATE_LEAD } from '../AgencyDetails/Section3';
import ToastContext from '../../Context/ToastContext';
import GoogleAnalyticsContext from '../../Context/GoogleAnalyticsContext';
import Get2MoreAgencies from '../../Components/Modal/Get2MoreAgencies';
import {
	GET_PERFECT_MATCHED,
	SEND_BULK_LEADS,
} from '../../Components/GetMatchedFlow';
import LinkExternal from '../../assets/Icons/link-external.svg';

const INCREMENT_AGENCY_VISITS = gql`
	mutation IncrementAgencyVisit($id: Float!) {
		incrementAgencyVisits(id: $id) {
			id
			name
			total_views
		}
	}
`;
const Sections3 = ({ agencyData, incrementAgencyViews }) => {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyA1Efom7xZ9wBPtQO4505DLguEcQ3i20xs',
	});
	const [isMobile, setIsMobile] = useState(
		window.innerWidth < 768 ? true : false,
	);
	const [openGetInTouchModal, setOpenGetInTouchModal] = useState(false);
	const [openPerfectLeadModal, setOpenPerfectLeadModal] = useState(false);
	const [sendMultipleLeads, setSendMultipleLeads] = useState(false);
	const [selectedAgency, setSelectedAgency] = useState<any>();
	const [selectedAgencies, setSelectedAgencies] = useState<any>();
	const [createLeadMutation, { loading }] = useMutation(CREATE_LEAD);
	const { toastMessage, showToast, hideToast } = useContext(ToastContext);
	const { sendGoogleAnalytics } = useContext(GoogleAnalyticsContext);
	const [sendBulkLeads] = useMutation(SEND_BULK_LEADS);

	const [sendingLeadsLoading, setSendingLeadsLoading] = useState(false);

	const [
		getPerfectMatched,
		{
			loading: getMatchedAgenciesLoading,
			data: perfectMactchedAgencies,
			error,
		},
	] = useLazyQuery(GET_PERFECT_MATCHED);
	// const [sendBulkLeads] = useMutation(SEND_BULK_LEADS);

	const [incrementAgencyVisit] = useMutation(INCREMENT_AGENCY_VISITS);

	const handleIncrementViews = async (id: any) => {
		try {
			const result = await incrementAgencyVisit({
				variables: { id: id },
			});
			console.log('Mutation Result:', result);
		} catch (error) {
			console.error('Mutation Error:', error);
		}
	};

	const [screenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const [maxDescriptionText, setaxDescriptionText] = useState(() => {
		// if (window.innerWidth > 1024) {
		// 	return 10000000000;
		// }
		if (window.innerWidth > 850) {
			return 210;
		} else if (window.innerWidth > 550) {
			return 150;
		} else {
			return 60;
		}
	});

	const debouncedHandleResize = () => {
		if (window.innerWidth < 768) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
		if (window.innerWidth > 850) {
			setaxDescriptionText(210);
		} else if (window.innerWidth > 600) {
			setaxDescriptionText(130);
		} else {
			setaxDescriptionText(60);
		}
	};

	useEffect(() => {
		window.addEventListener('resize', debouncedHandleResize);

		return () => {
			window.removeEventListener('resize', debouncedHandleResize);
		};
	}, []);

	const [seeMore, setSeeMore] = useState({});

	//get abbrevated location
	const getAbbreviatedLocationUsingGeocoder = async (
		fullLocation: string,
	): Promise<string> => {
		const geocoder = new google.maps.Geocoder();

		return new Promise<string>((resolve, reject) => {
			geocoder.geocode({ address: fullLocation }, (results, status) => {
				if (
					status === google.maps.GeocoderStatus.OK &&
					results &&
					results?.length > 0
				) {
					const countryAbbreviation = results[0]?.address_components.find(
						(component) => component.types.includes('country'),
					)?.short_name;

					const countryFullname = results[0]?.address_components.find(
						(component) => component.types.includes('country'),
					)?.long_name;

					const stateAbbreviation = results[0]?.address_components.find(
						(component) =>
							component.types.includes('administrative_area_level_1'),
					)?.short_name;

					const cityAbbreviation = results[0]?.address_components.find(
						(component) => component.types.includes('locality'),
					)?.short_name;

					const cityFullname = results[0]?.address_components.find(
						(component) => component.types.includes('locality'),
					)?.long_name;

					//if location is within US
					if (countryAbbreviation && countryAbbreviation === 'US') {
						let abbreviatedLocation = '';

						if (stateAbbreviation && cityAbbreviation) {
							abbreviatedLocation = `${cityAbbreviation}, ${stateAbbreviation}`;
						} else {
							abbreviatedLocation = stateAbbreviation || '';
						}

						resolve(abbreviatedLocation);
					} else if (countryAbbreviation && countryAbbreviation !== 'US') {
						//if location is outside of US
						let abbreviatedLocation = '';

						if (countryFullname && cityFullname) {
							abbreviatedLocation = `${cityFullname}, ${countryFullname}`;
						} else {
							abbreviatedLocation = countryFullname || '';
						}

						resolve(abbreviatedLocation);
					} else {
						//if location is invalid
						resolve(fullLocation);
					}
				} else {
					resolve(fullLocation); // Geocoding request failed, return same as input
				}
			});
		});
	};

	const [hover, setHover] = useState(false);
	const [agencyDataUpdated, setAgenciesData] = useState<any[]>([]);
	// const [isLoaded, setIsLoaded] = useState(false);

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	function calculateAverageRating(item: any) {
		const averageRating = item.agencyReview?.length
			? Math.ceil(
					item.agencyReview
						.map(
							(review: any) =>
								(review.value_rating +
									review.communication_rating +
									review.domain_rating +
									review.recommend_rating) /
								4,
						)
						.reduce((sum: number, rating: number) => sum + rating, 0) /
						item.agencyReview?.length,
			  )
			: // item?.total_ratings
			  0;

		return averageRating.toFixed(2);
	}

	useEffect(() => {
		if (agencyData) {
			const updateAgenciesWithAbbreviation = async () => {
				// Convert headquarter_address to abbreviated form for each agency
				const agenciesWithAbbreviation = await Promise.all(
					agencyData?.agencies?.map(async (agency: any) => {
						if (
							agency.headquarter_address &&
							agency.headquarter_address !== ''
						) {
							const abbreviation = await getAbbreviatedLocationUsingGeocoder(
								agency.headquarter_address,
							);
							return { ...agency, abbreviatedLocation: abbreviation };
						}
						return agency;
					}),
				);
				setAgenciesData(agenciesWithAbbreviation);
			};
			updateAgenciesWithAbbreviation();
		}
	}, [agencyData]);

	const sendLeadToAgency = async (form) => {
		try {
			await createLeadMutation({
				variables: {
					data: {
						email: form.email,
						contact: form.contact,
						website: form.website,
						description: form.description,
						agency_id: parseFloat(selectedAgency.id),
						status: 'received',
					},
				},
			});
			showToast('Inquiry submitted successfully!', 'success');
			sendGoogleAnalytics({ capturedAction: 'submit_lead' });
			setOpenGetInTouchModal(false);

			setTimeout(() => {
				hideToast();
			}, 2000);
		} catch (error) {
			// Handle error here
			console.error(error);
		}
	};

	const sendLeadToMultipleAgencies = async (form) => {
		setSendingLeadsLoading(true);
		try {
			await sendBulkLeads({
				variables: {
					// data: _data.filter((ag, _) => { return (ag !== undefined) })
					data: selectedAgencies.map((_agency: any, key) => {
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
			setSelectedAgencies([]);
			setOpenGetInTouchModal(false);
			setSendMultipleLeads(false);
			showToast('Lead submitted successfully!', 'success');

			setTimeout(() => {
				hideToast();
			}, 2000);
		} catch {
			//
		}
	};

	const getPerfectMatchedAgencies = async (agency) => {
		// const servicesIds = ServicesData.filter((_service, _) => { return (_service.buttonText === pageContent.services[0].service.name) })
		const servicesIds = agency.services.map((srvc, _) => {
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
				count: 3,
				agency: parseInt(`${agency.id}`),
			},
		});

		if (
			!res.error ||
			res.data ||
			res?.data?.getTopMatchedAgencies?.agencies.length > 0
		) {
			setOpenPerfectLeadModal(true);
		}
	};

	return (
		<div
			className='flex mx-[5%]'
			style={{
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'flex-start',
				marginTop: '16px',
			}}
		>
			<ContactUsModal
				isOpen={openGetInTouchModal}
				onClose={() => {
					setOpenGetInTouchModal(false);
				}}
				onSubmit={(formData) => {
					if (sendMultipleLeads) {
						sendLeadToMultipleAgencies(formData);
					} else {
						sendLeadToAgency(formData);
					}
				}}
				loading={loading || sendingLeadsLoading}
				agencyName={
					sendMultipleLeads ? '' : selectedAgency ? selectedAgency.name : ''
				}
			/>

			{perfectMactchedAgencies?.getTopMatchedAgencies?.agencies?.length > 0 && (
				<Get2MoreAgencies
					agencies={perfectMactchedAgencies?.getTopMatchedAgencies?.agencies}
					isOpen={openPerfectLeadModal}
					onClose={() => {
						setOpenPerfectLeadModal(false);
					}}
					onSubmit={(agencies) => {
						setSelectedAgencies(agencies);
						setOpenPerfectLeadModal(false);
						setOpenGetInTouchModal(true);
						setSendMultipleLeads(true);
					}}
					loading={false}
					agencyName={''}
					btnTitle='Get in Touch'
				/>
			)}

			{agencyData &&
				agencyDataUpdated?.map((item: any, index: number) => {
					return (
						<>
							{isMobile ? (
								<AgencyMobileCard
									disableOpenCardOnClick={false}
									style={{}}
									agencyData={item}
									onVisitWebsite={() => handleIncrementViews(item?.id)}
									incrementAgencyViews={() => {
										incrementAgencyViews(item.id, item.name, item.total_views);
									}}
								/>
							) : (
								<div
									key={index}
									style={{ display: 'flex' }}
									className='mx-[5%] w-full xl:mx-auto bg-[#F9FAFB] rounded-[16px] border border-[#EAECF0] max-w-[1216px] my-[16px] hover:border-2 hover:border-[#3364f7] hover:bg-[#fff] !important hover:shadow-lg transition-all duration-100 ease-in-out  transform group'
								>
									<div style={{ width: '80%' }}>
										<Link
											target={window.innerWidth > 767 ? '_blank' : ''}
											to={{
												pathname: `/AgencyDetails/${item?.id}/${stringToSlug(
													item?.name,
												)}`,
												search: `?${new URLSearchParams(queryParams)}`,
											}}
											onClick={() =>
												incrementAgencyViews(
													item.id,
													item.name,
													item.total_views,
												)
											}
										>
											<div className='flex items-center justify-between mx-5 mt-5 lg:hidden'>
												<img
													className='w-[80px] h-[80px] object-contain'
													alt=''
													src={item?.logo}
												/>
												{item?.status === 'verified' && (
													<img
														className='w-[80px] h-[80px] object-contain'
														alt=''
														src={require('../../assets/images/layer.png')}
													/>
												)}
												{item?.status === 'unverified' && (
													<img
														className='w-[80px] h-[80px] object-contain'
														alt=''
														src={require('../../assets/Icons/Notverified.png')}
													/>
												)}
											</div>
											<div className='flex items-start justify-between gap-[24px] pt-5 pr-5 pb-5'>
												<div className='flex gap-[10px] lg:gap-[24px] -mt-[5%] lg:-mt-0'>
													<div className='pl-5 hidden lg:block'>
														<img
															className='w-[100px] h-[100px] maxwidth-auto object-contain'
															alt=''
															src={item?.logo || PlaceHolderLogo}
														/>
													</div>
													<div className='p-5 lg:p-0 mx-[10%] lg:mx-0'>
														<h6 className='text-[22px] font-bold uppercase font-babas tracking-[0.44px] text-[#344054]'>
															{item?.name}
														</h6>
														<h6 className='text-[16px] font-bold uppercase font-babas tracking-[0.44px] mb-2 text-[#344054] group-hover:translate-y-1 duration-200 ease-in-out'>
															{item?.tagline}
														</h6>
														<p className='text-[12px] xl:text-[14px] font-normal font-montserrat leading-[20px] text-black mb-3'>
															{item?.bio ? (
																item.bio.length <= maxDescriptionText ? (
																	item.bio
																) : (
																	<>
																		{seeMore[index]
																			? item?.bio
																			: `${item.bio
																					.substring(0, maxDescriptionText)
																					.trim()}. `}
																		<span
																			className='ml-1 font-bold'
																			style={{
																				color: '#3364F7',
																				fontWeight: '600',
																				cursor: 'pointer',
																			}}
																			onClick={(e) => {
																				e.preventDefault();
																				e.stopPropagation();
																				setSeeMore({
																					[index]: !seeMore[index],
																				});
																			}}
																		>
																			{seeMore[index] ? 'See less' : 'See more'}
																		</span>
																	</>
																)
															) : null}
														</p>
														<div className='flex items-center flex-wrap lg:flex-nowrap gap-[8px] mb-5'>
															{item?.services.map(
																(serviceItem: any, serviceIndex: number) => {
																	return (
																		<div
																			key={serviceIndex}
																			className='flex justify-center items-center gap-[8px] h-[26px] pr-[9px] max-w-fit relative'
																			style={{
																				backgroundColor: '#3364F7',
																				transform: 'skewX(-12deg)',
																				borderRadius: '8px',
																			}}
																		>
																			<p className='text-[18px] uppercase text-[#FFF] font-babas flex items-center justify-between pl-2 '>
																				{serviceItem.service.name}
																			</p>
																		</div>
																	);
																},
															)}
														</div>
													</div>
												</div>
												<div className='pl-4 hidden lg:block'>
													{item?.status === 'verified' ? (
														<Logo style={{ width: '56px', height: '56px' }} />
													) : (
														item?.status === 'unverified' && (
															<NotVerifiedLogo
																style={{ width: '56px', height: '56px' }}
															/>
														)
													)}
												</div>
											</div>
											<div className='border-t-[1px] border-[#EAECF0]'>
												<div className='grid grid-cols-10 justify-between'>
													<div className='flex items-center justify-center col-span-6 lg:col-span-2 px-3 py-3 h-[56px] border-b lg:border-b-0  border-r border-[#EAECF0] gap-2'>
														{[1, 2, 3, 4, 5].map((value, index) => (
															<React.Fragment key={index}>
																{value <= item?.retainer_size ? (
																	<span
																		className='font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 text-BlackColor'
																		style={{ color: '#3364F7' }}
																	>
																		$
																	</span>
																) : (
																	<span className='font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 text-grayBorder'>
																		$
																	</span>
																)}
															</React.Fragment>
														))}
													</div>
													<div className='col-span-6 lg:col-span-2 flex justify-center items-center border-b lg:border-b-0 lg:border-r border-[#EAECF0] px-2 py-2 h-[56px]'>
														<p className='text-[12px] xl:text-[14px] font-bold font-montserrat flex justify-center items-center gap-1'>
															<Users
																style={{ width: '24px', height: '24px' }}
															/>
															{
																Employees.find(
																	(d) => d.value === item?.employees,
																)?.name
															}
														</p>
													</div>
													<div
														className='flex items-center justify-center col-span-6 lg:col-span-2 border-b lg:border-b-0 border-r border-[#EAECF0] px-2 py-2 h-[56px]'
														style={{
															cursor: 'pointer',
															maxWidth: '100%',
															overflow: 'hidden',
														}}
													>
														<img
															alt=''
															className='w-[24px] h-[24px]'
															src={
																require('../../assets/images/location.svg')
																	.default
															}
														/>
														<span
															style={{
																display: 'inline-block',
																maxWidth: '100%',
																whiteSpace: 'nowrap',
																textOverflow: 'ellipsis',
																overflow: 'hidden',
																fontWeight: 600,
															}}
															className='font-montserrat text-[14px]'
															title={item?.headquarter_address}
														>
															{/* {item?.headquarter_address} */}
															{item?.abbreviatedLocation}
														</span>
													</div>

													<div className='flex items-center justify-center col-span-6 lg:col-span-2 border-b lg:border-b-0 border-r border-[#EAECF0] px-2 py-2 h-[56px]'>
														<p className='text-[12px] xl:text-[14px] font-bold font-montserrat'>
															Total Reviews : {item.total_reviews}
														</p>
													</div>
													<div className='flex items-center justify-center col-span-6 lg:col-span-2 border-b-0 border-r border-[#EAECF0] px-2 py-2 h-[56px]'>
														<RatingStars rating={item?.total_ratings} />{' '}
														<span className='text-[24px] font-bold font-montserrat'>
															{/* {item?.total_ratings.toFixed(1)} */}
															{(() => {
																let total_ratings = item?.total_ratings || 0;
																let roundedValue =
																	Math.floor(total_ratings * 10) / 10;
																let result = roundedValue.toFixed(1);
																return result;
															})()}
														</span>
													</div>
												</div>
											</div>
										</Link>
									</div>
									<div
										className='flex flex-col items-center justify-evenly border-l-[1px] border-[#EAECF0]'
										style={{ width: '20%' }}
									>
										<div
											className='flex items-center justify-center gap-2 border-b-[1px] border-[#EAECF0]'
											style={{
												width: '100%',
												padding: '16px 0px',
												height: '33.33%',
											}}
											onClick={() => handleIncrementViews(item?.id)}
										>
											<Link to={item?.website} target='_blank' className='flex items-center justify-center gap-2'>
												<span
													className='text-[18px] xl:text-[20px] font-semibold'
													style={{ color: '#3364F7', cursor: 'pointer' }}
												>
													Visit Website
												</span>
												<img
													src={LinkExternal}
													className='w-5 group-hover:translate-x-2 duration-200 ease-in-out'
													alt='LinkExternal'
												/>
											</Link>
										</div>
										<div
											className='flex items-center justify-center gap-2 border-b-[1px] border-[#EAECF0]'
											style={{
												width: '100%',
												padding: '16px 0px',
												height: '33.33%',
											}}
											onClick={() => {
												setOpenGetInTouchModal(true);
												setSelectedAgency(item);
											}}
										>
											<span
												className='text-[18px] xl:text-[20px] font-semibold'
												style={{ color: '#3364F7', cursor: 'pointer' }}
											>
												Contact Us
											</span>
											<img
												src={MessageDots}
												className='w-5 group-hover:translate-x-2 duration-200 ease-in-out'
												alt='Message Dots'
											/>
										</div>
										<div
											className='flex items-center justify-center gap-2'
											style={{
												width: '100%',
												padding: '16px 0px',
												height: '33.33%',
											}}
										>
											<Link
												className='w-full h-full flex items-center justify-center'
												target={window.innerWidth > 767 ? '_blank' : ''}
												to={{
													pathname: `/AgencyDetails/${item?.id}/${stringToSlug(
														item?.name,
													)}`,
													search: `?${new URLSearchParams(queryParams)}`,
												}}
											>
												<span
													className='text-[18px] xl:text-[20px] font-semibold'
													style={{ color: '#3364F7', cursor: 'pointer' }}
												>
													Learn more
												</span>
												<img
													src={ArrowRight}
													className='w-5 group-hover:translate-x-2 duration-200 ease-in-out'
													alt='Arrow Right'
												/>
											</Link>
										</div>
									</div>
								</div>
							)}
						</>
					);
				})}
		</div>
	);
};

export default Sections3;
