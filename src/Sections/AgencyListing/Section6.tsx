import { gql, useMutation } from '@apollo/client';
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Collapse from '../../Components/Collapse/Collapse';
import RatingStars from '../../Components/RatingStars';
import { AgencyDetailsType } from '../../Interface';
import ChatIcon from '../../assets/Icons/Chat.svg';
import EditIcon from '../../assets/Icons/Icon.svg';
import TrashIcon from '../../assets/Icons/Trash.svg';
import CalendarIcon from '../../assets/Icons/calendar.svg';
import { UserContext } from '../../Context/UserContext';
import { RatingCaluclate, calculateRating, formatDate } from '../../Utilities/utilities';
import CustomModal from '../../Components/Modal/CustomModal';
import ToastContext from '../../Context/ToastContext';

interface AgencyDetailsProps {
	pageContent: AgencyDetailsType;
}

export const CREATE_AGENCY = gql`
	mutation createReviewResponse($data: CreateReviewsResponseInput!) {
		createReviewResponse(data: $data) {
			id
			comment
			agency_id
			user_id
			created_by
			updated_by
			created_on
			updated_on
			review_id
		}
	}
`;

export const DELETE_AGENCY = gql`
	mutation DeleteReviewResponse($id: Float!) {
		deleteReviewResponse(id: $id) {
			id
			comment
			agency_id
			user_id
			created_by
			created_on
			updated_on
			review_id
		}
	}
`;

const Section6: React.FC<AgencyDetailsProps> = ({ pageContent }) => {
	const { user } = useContext(UserContext);
	const [createReviewResponse, { data }] = useMutation(CREATE_AGENCY);
	const [deleteReviewResponse, { data: deleteData }] =
		useMutation(DELETE_AGENCY);

	const { id } = useParams();

	const tempId: any = id;

	const [responses, setResponses] = useState<{ [key: string]: string }>({});

	const handleResponse = (
		event: React.ChangeEvent<HTMLInputElement>,
		reviewId: number,
	) => {
		const newResponses = { ...responses };
		newResponses[reviewId] = event.target.value;
		setResponses(newResponses);
	};


	const { showToast, hideToast } = useContext(ToastContext);

	const deleteResponse = async (responseId: any) => {
		try {
			await deleteReviewResponse({
				variables: {
					id: responseId,
				},
			});
			setisOpenModal(false)
			showToast(`Review delete successfully`, "success");
			setTimeout(() => {
				hideToast();
				window.location.reload();
			}, 500);


		} catch (error) {
			setisOpenModal(false)
			showToast(`Error deleting review`, "success");
			setTimeout(() => {
				hideToast();
			}, 3000);
		}
	};

	const submitResponse = async (id: any) => {
		try {
			const reviewResponse = responses[id];
			await createReviewResponse({
				variables: {
					data: {
						comment: reviewResponse,
						agency_id: parseFloat(tempId),
						user_id: "1024",
						created_by: 'admin',
						updated_by: 'admin',
						review_id: id,
					},
				},
			});
			window.location.reload();
		} catch (error) {
			//
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

	const [isOpenModal, setisOpenModal] = useState(false)
	const [selectedResponseId, setselectedResponseId] = useState<any>(null)
	return (
		<>
			<CustomModal isOpen={isOpenModal} title={"Delete Review?"} onClose={() => { setisOpenModal(false) }} onSubmit={() => { deleteResponse(selectedResponseId) }} type={"custom"} />
			<div className=' max-w-[1216px] mt-10'>
				<h6 className='text-[24px] font-semibold  font-inter tracking-[0.44px] '>
					Reviews
				</h6>
				{pageContent?.agencyReview?.length < 0 ? (
					<div className='w-full bg-[#FCFCFD] border border-[#D0D5DD] rounded-[12px]'>
						<p className='flex items-center justify-center py-28 gap-3'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='21'
								height='20'
								viewBox='0 0 21 20'
								fill='none'
							>
								<path
									d='M10.4993 13.3327V9.99935M10.4993 6.66602H10.5077M18.8327 9.99935C18.8327 14.6017 15.1017 18.3327 10.4993 18.3327C5.89698 18.3327 2.16602 14.6017 2.16602 9.99935C2.16602 5.39698 5.89698 1.66602 10.4993 1.66602C15.1017 1.66602 18.8327 5.39698 18.8327 9.99935Z'
									stroke='#475467'
									stroke-width='1.66667'
									stroke-linecap='round'
									stroke-linejoin='round'
								/>
							</svg>
							You don't have any reviews yet, invite your customers to leave a
							review!
						</p>
					</div>
				) : (
					<div>
						{pageContent?.agencyReview?.map((review) => {
							const reviewId = review?.id;
							const reviewResponse = responses[reviewId] || '';
							let tempArr = review?.ReviewsResponse;
							if (deleteData?.deleteReviewResponse) {
								tempArr = tempArr?.filter(
									(item) => item.id !== deleteData?.deleteReviewResponse?.id,
								);
							}
							const reviewResponseObj =
								tempArr?.length > 0 || deleteData?.deleteReviewResponse
									? tempArr[tempArr?.length - 1]
									: data && data?.createReviewResponse;

							if (review?.status !== 'verified') return '';
							return (
								<div className='mx-[5%] xl:mx-auto bg-[#F9FAFB] rounded-[8px] border border-[#EAECF0] max-w-[1216px] mt-10 mb-5'>
									{screenWidth > 600 ? (
										<div className='flex items-center justify-between h-[30px] p-3 mt-5 pl-8 pr-8'>
											<div className='flex items-center gap-2'>
												<div>
													<img alt='' src={CalendarIcon} />
												</div>
												<div>
													<h6 className='text-[16px] font-semibold  font-montserrat tracking-[0.44px]'>
														{formatDate(new Date(review?.created_at))}
													</h6>
												</div>
											</div>
											<div className='flex items-center gap-3 '>
												<div className='flex items-center justify-center gap-1 h-[24px]'>
													<RatingStars rating={RatingCaluclate(review)} />{' '}
													<span className='text-[24px] font-inter font-semibold'>
														{calculateRating(review)}
													</span>
												</div>
											</div>
										</div>
									) : (
										<div className='flex flex-col items-center justify-center p-3 mt-5'>
											<div className='flex items-center gap-2'>
												<div>
													<img alt='' src={CalendarIcon} />
												</div>
												<div>
													<h6 className='text-[16px] font-semibold font-montserrat tracking-[0.44px]'>
														{formatDate(new Date(review?.created_at))}
													</h6>
												</div>
											</div>
											<div className='flex items-center justify-center gap-1 mt-3'>
												<RatingStars rating={RatingCaluclate(review)} />
												<span className='text-[24px] font-inter font-semibold'>
													{calculateRating(review)}
												</span>
											</div>
										</div>
									)}

									<div className='border-t max-w-[1216px] mt-5 border-[#EAECF0] mx-[5%] xl:mx-auto '></div>
									<div className='grid grid-cols-12 pl-5 pr-5'>
										<div className='col-span-12 lg:col-span-6 xl:col-span-8 border-r border-[#EAECF0]'>
											<div
												className={
													screenWidth > 600 ? 'p-3 pt-5' : 'text-center'
												}
											>
												<h6 className='text-[16px] font-semibold  font-montserrat tracking-[0.44px]'>
													Pros
												</h6>
												<p className='text-[14px] font-normal font-montserrat leading-[20px] text-black'>
													<Collapse>{review?.pros}</Collapse>
												</p>
											</div>
											<div
												className={
													screenWidth > 600 ? 'p-3 pt-5' : 'text-center mt-2'
												}
											>
												<h6 className='text-[16px] font-semibold  font-montserrat tracking-[0.44px]'>
													Cons
												</h6>
												<p className='text-[14px] font-normal font-montserrat leading-[20px] text-black'>
													<Collapse>{review?.cons}</Collapse>
												</p>
											</div>
										</div>
										<div className='col-span-12 lg:col-span-6 xl:col-span-4 p-3 mb-5'>
											<p className='text-[14px] font-semibold font-montserrat flex justify-center items-center gap-1 my-5 '>
												<img
													alt=''
													className='w-[16px] h-[16px]'
													src={
														require('../../assets/images/location.svg').default
													}
												/>{' '}
												{review?.location}
											</p>
											<div className='flex items-center justify-between mt-3'>
												<span className='text-[14px] font-montserrat font-medium text-[#667085] '>
													Value
												</span>
												<RatingStars rating={review?.value_rating} />
											</div>
											<div className='flex items-center justify-between mt-3'>
												<span className='text-[14px] font-montserrat font-medium text-[#667085]'>
													Communication
												</span>
												<RatingStars rating={review?.communication_rating} />
											</div>
											<div className='flex items-center justify-between mt-3'>
												<span className='text-[14px] font-montserrat font-medium text-[#667085]'>
													Domain knowledge
												</span>
												<RatingStars rating={review?.domain_rating} />
											</div>
											<div className='flex items-center justify-between mt-3'>
												<span className='text-[14px] font-montserrat font-medium text-[#667085]'>
													Would Recommend
												</span>
												<RatingStars rating={review?.recommend_rating} />
											</div>
										</div>
									</div>
									<div className='border-t max-w-[1216px] border-[#EAECF0] mx-[5%] xl:mx-auto '></div>
									<div className='grid grid-cols-1 p-3 md:p-8 gap-2'>
										{user ? (
											reviewResponseObj &&
												review?.id === reviewResponseObj?.review_id ? (
												<>
													<div
														className=' flex justify-between items-center'
														style={{ width: '100%' }}
													>
														<div className='flex'>
															<img
																src={ChatIcon}
																alt='Chat Icon'
																className='w-5'
															/>
															<p className='text-gray700 font-montserrat text-base not-italic font-semibold leading-5'>
																Response:{' '}
																<span className='text-gray700 font-montserrat text-sm not-italic font-medium leading-5'>
																	{formatDate(
																		new Date(reviewResponseObj?.created_on),
																	)}
																</span>
															</p>
														</div>
														<div
															onClick={() => {
																setselectedResponseId(reviewResponseObj?.id)
																setisOpenModal(true)
															}}
															style={{ cursor: 'pointer' }}
														>
															<img src={TrashIcon} alt='ArrowDown' />
														</div>
													</div>
													<div className='grid grid-cols-1'>
														<p className='ml-5 text-gray700 font-montserrat text-sm not-italic font-medium leading-5'>
															{reviewResponseObj?.comment}
														</p>
													</div>
												</>
											) : (
												<div className='flex'>
													<input
														style={{
															width: '100%',
															border: '1px solid #D0D5DD',
															outline: 'none',
															borderRadius: '8px 0px 0px 8px',
															height: '40px',
															padding: '8px 12px',
														}}
														value={reviewResponse}
														onChange={(e) => handleResponse(e, reviewId)}
														placeholder='Add your comments'
													/>

													<button
														className='button sm:px-[16px] sm:py-[10px] bg-[#329BFA] text-[#FFFFFF] flex items-center justify-center text-[10px] font-inter font-semibold'
														type='submit'
														style={{
															height: '40px',
															borderRadius: '0px 8px 8px 0px',
															padding: '10px 16px',
															width: '178px',
															cursor: 'pointer',
														}}
														onClick={() => submitResponse(review?.id)}
													>
														<img src={EditIcon} alt='ArrowDown' />
														<span>Add Response</span>
													</button>
												</div>
											)
										) : (
											reviewResponseObj && (
												<>
													<div
														className=' flex justify-between items-center'
														style={{ width: '100%' }}
													>
														<div className='flex'>
															<img
																src={ChatIcon}
																alt='Chat Icon'
																className='w-5'
															/>
															<p className='text-gray700 font-montserrat text-base not-italic font-semibold leading-5 pl-1'>
																Response from {pageContent?.name}:{' '}
																<span className='text-gray700 font-montserrat text-sm not-italic font-medium leading-5'>
																	{formatDate(
																		new Date(reviewResponseObj?.created_on),
																	)}
																</span>
															</p>
														</div>
													</div>
													<div className='grid grid-cols-1'>
														<p className='ml-5 text-gray700 font-montserrat text-sm not-italic font-medium leading-5 pl-1'>
															{reviewResponseObj?.comment}
														</p>
													</div>
												</>
											)
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div >
		</>
	);
};

export default Section6;
