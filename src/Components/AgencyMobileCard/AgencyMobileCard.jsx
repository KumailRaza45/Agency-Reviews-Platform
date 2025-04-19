import React from 'react';
import './AgencyMobileCard.css';
import { Employees, stringToSlug } from '../../Utilities/utilities';
import { FiUsers as Users } from 'react-icons/fi';
import ArrowRight from '../../assets/Icons/arrow-right-icon.svg';
import LinkExternal from '../../assets/Icons/link-external-01.svg';
import RatingStars from '../RatingStars';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AgencyMobileCard({
	agencyData,
	incrementAgencyViews,
	style,
	disableOpenCardOnClick,
  onVisitWebsite
}) {
	const location = useLocation();
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);

	return (
		<div
			className='agency-mobile-card'
			onClick={() => {
				if (!disableOpenCardOnClick) {
					incrementAgencyViews();
					navigate(
						`/AgencyDetails/${agencyData?.id}/${stringToSlug(
							agencyData?.name,
						)}`,
					);
				}
			}}
			style={style}
		>
			<div className='agency-mobile-header'>
				<div
					className='w-full flex'
					style={{ alignItems: 'center', justifyContent: 'space-between' }}
				>
					<div
						className='flex agency-mobile-head'
						style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}
					>
						<img
							className='w-[52px] h-[52px] object-contain'
							style={{ marginRight: '8px' }}
							alt=''
							src={
								agencyData?.logo ||
								require('../../assets/Icons/logo-placeholder.jpg')
							}
						/>

						<div
							className='flex'
							style={{ flexDirection: 'column', width: 'calc(100% - 68px)' }}
						>
							<span
								className='text-[20px] font-bold uppercase font-babas tracking-[0.44px] text-[#344054]'
								style={{
									display: 'inline-block',
									maxWidth: '100%',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									minHeight: '20px',
									letterSpacing: '0.4px',
								}}
							>
								{agencyData?.name}
							</span>
							<div className=' flex items-center justify-start'>
								<RatingStars rating={agencyData?.total_ratings} />{' '}
								<span
									className='text-[12px] font-montserrat'
									style={{ fontWeight: '600', marginLeft: '2px' }}
								>
									{(() => {
										let total_ratings = agencyData?.total_ratings || 0;
										let roundedValue = Math.floor(total_ratings * 10) / 10;
										let result = roundedValue.toFixed(1);
										return result;
									})()}
									<span
										className='text-[9px] font-montserrat'
										style={{ fontWeight: '500', color: '#667085' }}
									>{` (${agencyData.total_reviews} Reviews)`}</span>
								</span>
							</div>
						</div>
					</div>
					{agencyData?.status === 'verified' && (
						<img
							className='w-[42px] h-[42px] object-contain'
							alt=''
							src={require('../../assets/images/layer.png')}
						/>
					)}
					{agencyData?.status === 'unverified' && (
						<img
							className='w-[42px] h-[42px] object-contain'
							alt=''
							src={require('../../assets/Icons/Notverified.png')}
						/>
					)}
				</div>

				<h6
					style={{
						display: 'inline-block',
						maxWidth: '100%',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						minHeight: '18px',
					}}
					className='text-[16px] font-bold uppercase font-babas tracking-[0.32px] text-[#344054] group-hover:translate-y-1 duration-200 ease-in-out'
				>
					{agencyData?.tagline}
				</h6>

				<div className='flex items-center flex-wrap lg:flex-nowrap gap-[8px]'>
					{agencyData?.services.map((serviceItem, serviceIndex) => {
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
								<p
									className='text-[14px] uppercase text-[#FFF] font-babas flex items-center justify-between pl-2 '
									style={{ letterSpacing: '0.28px', lineHeight: 'normal' }}
								>
									{serviceItem.service.name}
								</p>
							</div>
						);
					})}
				</div>
        <Link to={agencyData.website} target='_blank' className='flex items-center justify-center gap-2'>
				<div className='w-full flex'>
					<button
						onClick={onVisitWebsite}
            className='w-[100%] bg-[#FF59E9] px-[14px] py-[8px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-inter font-semibold'
					>
						Visit Website
            <img src={LinkExternal} className='w-4 h-4 ml-2' alt='Icon' />
						
					</button>
				</div>
        </Link>
			</div>
			<div className='agency-mobile-options'>
				<div
					className='agency-mobile-option'
					style={{ borderRight: '1px solid #EAECF0' }}
				>
					<div className='flex gap-2'>
						{[1, 2, 3, 4, 5].map((value, index) => (
							<React.Fragment key={index}>
								{value <= agencyData?.retainer_size ? (
									<span
										className='font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 text-BlackColor'
										style={{
											color: '#3364F7',
											height: '28px',
											width: '12px',
											fontSize: '18px',
										}}
									>
										$
									</span>
								) : (
									<span
										className='font-inter text-xl xl:text-2xl not-italic font-semibold leading-8 text-grayBorder'
										style={{ height: '28px', width: '12px', fontSize: '18px' }}
									>
										$
									</span>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
				<div className='agency-mobile-option'>
					<div className='col-span-6 lg:col-span-2 flex justify-center items-center px-2 py-2 h-[56px]'>
						<p className='text-[12px] xl:text-[14px] font-bold font-montserrat flex justify-center items-center gap-1'>
							<Users
								style={{ width: '20px', height: '20px', marginRight: '3px' }}
							/>
							{Employees.find((d) => d.value === agencyData?.employees)?.name}
						</p>
					</div>
				</div>
				<div
					className='agency-mobile-option'
					style={{ borderRight: '1px solid #EAECF0' }}
				>
					<div
						className='flex items-center justify-center'
						style={{
							cursor: 'pointer',
							maxWidth: '100%',
							overflow: 'hidden',
						}}
					>
						<img
							alt=''
							className='w-[20px] h-[20px]'
							src={require('../../assets/images/location.svg').default}
						/>
						<span
							style={{
								display: 'inline-block',
								maxWidth: '100%',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								fontWeight: 500,
							}}
							className='font-montserrat text-[14px]'
							title={agencyData?.headquarter_address}
						>
							{/* {agencyData?.headquarter_address} */}
							{agencyData?.abbreviatedLocation}
						</span>
					</div>
				</div>
				<div className='agency-mobile-option'>
					{disableOpenCardOnClick ? (
						<Link
							// target={window.innerWidth > 767 ? "_blank" : ""}
							aria-disabled={disableOpenCardOnClick}
							target={'_blank'}
							onClick={incrementAgencyViews}
							to={{
								pathname: `/AgencyDetails/${agencyData?.id}/${stringToSlug(
									agencyData?.name,
								)}`,
								search: `?${new URLSearchParams(queryParams)}`,
							}}
						>
							<div className='flex items-center gap-2'>
								<span
									className='text-[14px]'
									style={{
										color: '#3364F7',
										cursor: 'pointer',
										fontWeight: '600',
									}}
								>
									Learn more
								</span>
								<img
									style={{ height: '18px', width: '18px' }}
									src={ArrowRight}
									className='w-5  duration-200 ease-in-out'
									alt='Arrow Right'
								/>
							</div>
						</Link>
					) : (
						<div className='flex items-center gap-2'>
							<span
								className='text-[14px]'
								style={{
									color: '#3364F7',
									cursor: 'pointer',
									fontWeight: '600',
								}}
							>
								Learn more
							</span>
							<img
								style={{ height: '18px', width: '18px' }}
								src={ArrowRight}
								className='w-5  duration-200 ease-in-out'
								alt='Arrow Right'
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
