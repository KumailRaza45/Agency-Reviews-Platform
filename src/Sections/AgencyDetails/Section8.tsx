import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import RatingStars from '../../Components/RatingStars';
import layer from '../../assets/images/layer.png';
import { stringToSlug } from '../../Utilities/utilities';
//trigger
const Section8 = ({ pageContent }) => {
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
	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: screenWidth < 600 ? 1 : 3,
		slidesToScroll: 1,
	};

	return (
		<>
			<div id='snapshot' className='mx-[5%] xl:mx-auto  max-w-[1216px] mt-10'>
				<h6 className='text-[24px] font-semibold  font-inter tracking-[0.44px] mb-2'>
					View Similar Agencies
				</h6>

				<div className='bg-[#F2F4F7] rounded-[8px] border border-[#EAECF0] p-5'>
					<Slider {...settings}>
						{pageContent?.length &&
							pageContent
								?.sort((a, b) => b.total_review_rating - a.total_review_rating)
								.slice(0, 12)
								?.map((slide, index) => (
									<Link to={`/AgencyDetails/${slide?.id}/${stringToSlug(slide.name)}`}>
										<div
											className='col-span-12 md:col-span-6 lg:col-span-4 bg-[#fff] rounded-[8px] flex justify-center py-10'
											key={index}
											style={{ position: "relative" }}
										>
											<div
												className='flex flex-col gap-2'
												style={{ height: '300px' }}
											>
												<img
													style={{ position: "absolute", right: 0, top: 20 }}
													className='mr-3'
													src={layer}
													width={40}
													alt=''
												/>
												<img
													style={{ margin: '0px auto', height: '70px', marginTop: "30px" }}
													src={slide.logo}
													alt=''
												/>
												<span className='text-[14px] capitalize font-montserrat font-semibold tracking-[0.44px] flex justify-center'>
													{slide.name}
												</span>
												<div
													className='text-[14px] capitalize font-montserrat font-normal tracking-[0.44px] flex justify-center text-center m-4'
													style={{
														maxHeight: '67px',
														height: '67px',
														overflow: 'hidden',
														position: 'relative',
													}}
												>
													<p
														style={{
															overflow: 'auto',
															position: 'relative',
															paddingRight: '17px',
															marginRight: '-17px',
														}}
													>
														{slide.bio}
													</p>
												</div>

												<div
													className='flex items-center flex-wrap gap-[8px]'
													style={{ margin: '0px auto' }}
												>
													{slide?.services?.map((service, index) => (
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
																{service?.service?.name}
															</p>
														</div>
													))}
												</div>
												<hr style={{ color: '#EAECF0' }}></hr>
												<div className='flex items-center justify-center gap-1 h-[24px] pt-5'>
													<RatingStars
														rating={slide.total_review_rating}
													/>
													<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'>
														{Number(slide.total_review_rating) ===
															slide.total_review_rating &&
															slide.total_review_rating % 1 !== 0
															? slide.total_review_rating?.toFixed(1)
															: slide.total_review_rating}
													</span>
												</div>
												<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'></span>
											</div>
										</div>
									</Link>
								))}
					</Slider>
				</div>
			</div>
		</>
	);
};

export default Section8;
