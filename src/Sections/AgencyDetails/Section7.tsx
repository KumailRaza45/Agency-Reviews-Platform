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
import { CREATE_AGENCY, DELETE_AGENCY } from '../AgencyListing/Section6';
import CollapseButton from '../../Components/CollapseButton/CollapseButton';

interface AgencyDetailsProps {
	pageContent: any
}

const Section7: React.FC<AgencyDetailsProps> = ({ pageContent }) => {
 const { user, token } = useContext(UserContext);
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

  const deleteResponse = async (responseId: any) => {
		try {
			await deleteReviewResponse({
				variables: {
					id: responseId,
				},
			});
			window.location.reload();
		} catch (error) { }
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
  return (
    <>
			{pageContent && pageContent.map((review) => {
				let tempArr = review?.ReviewsResponse;

				const reviewResponseObj =
					tempArr?.length > 0 && tempArr[tempArr?.length - 1];

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
											{calculateRating(review).toFixed(1)}
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
								
								{screenWidth > 600 ?
										"" :
										<p className='text-[14px] font-semibold font-montserrat flex justify-center items-center gap-1 my-5 text-center'>
											<img
												alt=''
												className='w-[16px] h-[16px]'
												src={require('../../assets/images/location.svg').default}
											/>{' '}
											{review?.location}
										</p>
									}
									<div className='flex items-center justify-center gap-1 '>
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
								<div className={screenWidth > 600 ? 'p-3 pt-5' : 'text-center'}>
									<h6 className='text-[16px] font-semibold  font-montserrat tracking-[0.44px]'>
										Pros
									</h6>
									<p className='text-[14px] font-normal font-montserrat leading-[20px] text-black'>
										<CollapseButton desc={review?.pros} />
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
										<CollapseButton desc={review?.cons} />
									</p>
								</div>
							</div>
							<div className='col-span-12 lg:col-span-6 xl:col-span-4 p-3 mb-5'>
								{screenWidth > 600 ?
									<p className='text-[14px] font-semibold font-montserrat flex justify-center items-center gap-1 my-5 '>
										<img
											alt=''
											className='w-[16px] h-[16px]'
											src={require('../../assets/images/location.svg').default}
										/>{' '}
										{review?.location}
									</p> : ""
								}
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
							{reviewResponseObj && (
								<>
									<div
										className=' flex justify-between items-center'
										style={{ width: '100%' }}
									>
										<div className='flex'>
											<img src={ChatIcon} alt='Chat Icon' className='w-5' />
											<p className='text-gray700 font-montserrat text-base not-italic font-semibold leading-5 pl-1'>
												Response from {pageContent?.name}:{' '}
												<span className='text-gray700 font-montserrat text-sm not-italic font-medium leading-5'>
													{formatDate(new Date(reviewResponseObj?.created_on))}
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
							)}
						</div>
					</div>
				);
			})}
		</>
	);
};

export default Section7;
