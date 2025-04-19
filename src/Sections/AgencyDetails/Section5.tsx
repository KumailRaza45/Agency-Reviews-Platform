import React from 'react';
import RatingStars from '../../Components/RatingStars';
import { AgencyDetailsInterface } from '../../Interface';
interface AgencyDetailsProps {
	pageContent: AgencyDetailsInterface;
}
const Section5: React.FC<AgencyDetailsProps> = ({ pageContent }) => {
	return (
		<>
			<div id='snapshot' className='mx-[5%] xl:mx-auto  max-w-[1216px] mt-10'>
				<h6 className='text-[24px] font-semibold  font-inter tracking-[0.44px] mb-2'>
					Snapshot
				</h6>
				<div className='grid grid-cols-12 gap-[15px]'>
					<div className='col-span-12 md:col-span-6 lg:col-span-3  bg-[#F2F4F7] rounded-[8px] flex justify-center py-10'>
						<div className='flex flex-col gap-2'>
							<span className='text-[14px] capitalize font-montserrat font-semibold tracking-[0.44px] flex justify-center'>
								Verified client reviews
							</span>
							<div className='flex items-center justify-center gap-1 h-[24px] pt-5'>
								<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'>
									{pageContent?.totalVerifiedReviews}
								</span>
							</div>
						</div>
					</div>
					<div className='col-span-12 md:col-span-6 lg:col-span-3  bg-[#F2F4F7] rounded-[8px] flex justify-center py-10'>
						<div className='flex flex-col gap-2'>
							<span className='text-[14px] capitalize font-montserrat font-semibold tracking-[0.44px] flex justify-center'>
								Overall rating
							</span>
							<div className='flex items-center justify-center gap-1 h-[24px] pt-5'>
								<RatingStars rating={pageContent?.total_review_rating} />
								<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'>
									{/* {pageContent?.total_review_rating.toFixed(1)} */}
									{
										(() => {
											let total_ratings = pageContent?.total_review_rating || 0;
											let roundedValue = Math.floor(total_ratings * 10) / 10;
											let result = roundedValue.toFixed(1);
											return result;
										})()
									}
								</span>{' '}
							</div>
							<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'></span>
						</div>
					</div>
					<div className='col-span-12 md:col-span-6 lg:col-span-3  bg-[#F2F4F7] rounded-[8px] flex justify-center py-10'>
						<div className='flex flex-col gap-2'>
							<span className='text-[14px] capitalize font-montserrat font-semibold tracking-[0.44px] flex justify-center'>
								Average Cost
							</span>
							<div className='flex items-center justify-center gap-1 h-[24px] pt-5'>
								<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'>
									<div className='flex items-center justify-center col-span-6 lg:col-span-3 px-6 py-3 h-[56px] border-b lg:border-b-0  border-r border-[#EAECF0] gap-2'>
										{[1, 2, 3, 4, 5].map((value, index) => (
											<React.Fragment key={index}>
												{value <= Number(pageContent?.agency?.retainer_size) ? (
													<span className='font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 ' style={{ color: "#3364F7" }}>
														$
													</span>
												) : (
													<span className='font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 text-grayBorder' >
														$
													</span>
												)}
											</React.Fragment>
										))}
									</div>
								</span>
							</div>
						</div>
					</div>
					<div className='col-span-12 md:col-span-6 lg:col-span-3  bg-[#F2F4F7] rounded-[8px] flex justify-center py-10'>
						<div className='flex flex-col gap-2'>
							<span className='text-[14px] capitalize font-montserrat font-semibold tracking-[0.44px] flex justify-center'>
								Last updated
							</span>
							<div className='flex items-center justify-center gap-1 h-[24px] pt-5'>
								<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'>
									{pageContent?.agency?.updated_at
										? new Date(pageContent?.agency?.updated_at).toLocaleDateString(
											'en-US',
											{
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											},
										)
										: ''}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Section5;
