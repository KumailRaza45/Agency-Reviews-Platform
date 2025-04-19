import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AgencyDetailsType } from '../../Interface';
import ArrowLeft from '../../assets/Icons/ArrowLeft.svg';
import LinkExternal from '../../assets/Icons/link-external.svg';
import { gql, useMutation } from '@apollo/client';

const INCREMENT_AGENCY_VISITS = gql`
	mutation IncrementAgencyVisit($id: Float!) {
		incrementAgencyVisits(id: $id) {
			id
			name
			total_views
		}
	}
`;
interface AgencyDetailsProps {
	pageContent: AgencyDetailsType;
}

const Section2: React.FC<AgencyDetailsProps> = ({ pageContent }) => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const { id } = useParams<{ id: any }>();
	const parsedId = parseFloat(id);
	const [incrementAgencyVisit] = useMutation(INCREMENT_AGENCY_VISITS);

	const handleIncrementViews = async () => {
		try {
			const result = await incrementAgencyVisit({
				variables: { id: parsedId },
			});
			console.log('Mutation Result:', result);
		} catch (error) {
			console.error('Mutation Error:', error);
		}
	};

	const [showScrollTopButton, setShowScrollTopButton] = useState(false);
	const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

	const handleResize = () => {
		setScreenWidth(window.innerWidth);
	};

	const checkScrollTop = useCallback(() => {
		if (!showScrollTopButton && window.scrollY > 300) {
			setShowScrollTopButton(true);
		} else if (showScrollTopButton && window.scrollY <= 300) {
			setShowScrollTopButton(false);
		}
	}, [showScrollTopButton]);

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', checkScrollTop);
		return () => {
			window.removeEventListener('scroll', checkScrollTop);
		};
	}, [checkScrollTop]);

	return (
		<>
			<div
				className='mx-[5%] xl:mx-auto  max-w-[1216px] mt-10'
				style={{
					position: 'sticky',
					top: 0,
					zIndex: 99,
					background: 'white',
					paddingBlock: '15px',
				}}
			>
				<div
					className={
						screenWidth > 600 ? 'flex items-center justify-between' : ''
					}
				>
					{screenWidth > 600 ? (
						<div className='flex flex-wrap items-center justify-start gap-1 sm:gap-4'>
							<div className='flex items-center'>
								<Link
									to={{
										pathname: '/',
										search: `?${new URLSearchParams(queryParams)}`,
									}}
								>
									<img src={ArrowLeft} alt='Arrow left' className='w-8' />
								</Link>
								<div
									className='w-[70px] h-[70px]'
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									{
										<img
											src={
												pageContent?.logo_url.includes(
													'agencyreviews-dev.s3.amazonaws.com',
												)
													? pageContent?.logo_url
													: require('../../assets/images/Logomark.svg').default
											}
											alt=''
										/>
									}
								</div>
							</div>
							<div>
								<div className='flex items-center'>
									<h6 className='text-[22px] font-bold uppercase font-babas tracking-[0.44px] pr-4'>
										{pageContent?.name ?? 'name'}
									</h6>
									<Link
										to={`${pageContent?.website}?utm+source=agencyreviews.io`}
										target='_blank'
										className='flex self-start gap-2 pt-2 ml-7 mr-2 sm:ml-0 sm:mr-0'
										onClick={handleIncrementViews}
									>
										<span className='text-activeColorBreadCrum font-montserrat text-sm not-italic font-semibold leading-5'>
											Website
										</span>
										<img src={LinkExternal} alt='Link' />
									</Link>
								</div>
								<div>
									<h6 className='font-babas text-gray700 text-[22px] not-italic leading-normal tracking-[0.44px] uppercase'>
										{pageContent?.tagline ?? 'tagline'}
									</h6>
								</div>
							</div>
						</div>
					) : (
						<div>
							{showScrollTopButton ? (
								<div className='flex flex-wrap items-center justify-start gap-1 sm:gap-4'>
									<div className='flex items-center'>
										<div
											className='w-[70px] h-[70px]'
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											{
												<img
													src={
														pageContent?.logo_url.includes(
															'agencyreviews-dev.s3.amazonaws.com',
														)
															? pageContent?.logo_url
															: require('../../assets/images/Logomark.svg')
																	.default
													}
													alt=''
												/>
											}
										</div>
									</div>
									<div>
										<div className='flex items-center'>
											<h6 className='text-[22px] font-bold uppercase font-babas tracking-[0.44px] pr-4'>
												{pageContent?.name ?? 'name'}
											</h6>

										</div>
										<div>
											<h6 className='font-babas text-gray700 text-[22px] not-italic leading-normal tracking-[0.44px] uppercase'>
												{pageContent?.tagline ?? 'tagline'}
											</h6>
										</div>
									</div>
								</div>
							) : (
								<div className=''>
									<Link to='/'>
										<img src={ArrowLeft} alt='Arrow left' className='w-8' />
									</Link>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<div
											className='d-flex justify-content-center'
											style={{ marginTop: '-30px' }}
										>
											<img
												src={
													pageContent?.logo_url.includes(
														'agencyreviews-dev.s3.amazonaws.com',
													)
														? pageContent?.logo_url
														: require('../../assets/images/Logomark.svg')
																.default
												}
												alt=''
												width={80}
											/>
										</div>

										<div style={{ textAlign: 'center' }}>
											<div>
												<h6 className='font-babas text-gray700 text-[22px] not-italic leading-normal tracking-[0.44px] uppercase'>
													{pageContent?.tagline ?? 'tagline'}
												</h6>
											</div>

											<h6 className='text-[22px] font-bold uppercase font-babas tracking-[0.44px] text-center'>
												{pageContent?.name ?? 'name'}
											</h6>
										</div>
										<Link
											style={{ margin: '20px auto -15px auto' }}
											to={pageContent?.website}
											target='_blank'
											className='flex self-start gap-2 pt-2 ml-12 mt-5'
										>
											<span
												className='text-activeColorBreadCrum font-montserrat text-sm not-italic font-semibold leading-5'
												onClick={handleIncrementViews}
											>
												Website
											</span>
											<img src={LinkExternal} alt='Link' />
										</Link>
									</div>
								</div>
							)}
						</div>
					)}

					{screenWidth > 600 ? (
						<div className='w-[70px] h-[70px]'>
							{showScrollTopButton ? (
								<button
									className='w-[142px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold'
									type='submit'
									style={{
										opacity: 1,
										cursor: 'pointer',
									}}
									onClick={scrollTop}
								>
									Start a Convo
								</button>
							) : (
								<>
									{pageContent?.status === 'verified' && (
										<img
											src={require('../../assets/images/layer.png')}
											alt=''
										/>
									)}
									{pageContent?.status === 'unverified' && (
										<img
											src={require('../../assets/Icons/Notverified.png')}
											alt=''
											className='w-[100px] h-[100px] object-contain'
										/>
									)}
								</>
							)}
						</div>
					) : (
						<div className=''>
							{showScrollTopButton ? (
								<button
									className='w-[142px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold'
									type='submit'
									style={{
										opacity: 1,
										cursor: 'pointer',
									}}
									onClick={scrollTop}
								>
									Start a Convo
								</button>
							) : (
								<>
									{pageContent?.status === 'verified' && (
										<img
											src={require('../../assets/images/layer.png')}
											alt=''
											width={60}
											style={{ marginTop: '-180px', float: 'right' }}
										/>
									)}
									{pageContent?.status === 'unverified' && (
										<img
											src={require('../../assets/Icons/Notverified.png')}
											alt=''
											width={60}
											style={{ marginTop: '-190px', float: 'right' }}
										/>
									)}
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Section2;
