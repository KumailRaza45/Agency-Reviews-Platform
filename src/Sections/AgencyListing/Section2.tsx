import { gql, useMutation } from '@apollo/client';
import { Box } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AgencyDetailsInterface } from '../../Interface';
import BannerIcon from '../../assets/Icons/banner.svg';
import EyeIcon from '../../assets/Icons/eye.svg';
import LinkExternal from '../../assets/Icons/link-external.svg';
import StarIcon from '../../assets/Icons/reviewStar.svg';

interface AgencyListingProps {
	pageContent: AgencyDetailsInterface;
}

const INCREMENT_AGENCY_VISITS = gql`
	mutation IncrementAgencyVisit($id: Float!) {
		incrementAgencyVisits(id: $id) {
			id
			name
			total_views
		}
	}
`;

const Section2: React.FC<AgencyListingProps> = ({
	pageContent,
}: AgencyListingProps) => {
	const Data = [
		{
			heading: 'Total Visits ',
			value: pageContent?.totalVisits,
		},
		{
			heading: 'Total Leads ',
			value: pageContent?.totalLeads,
		},
		{
			heading: 'Total Views ',
			value: pageContent?.totalViews,
		},
		{
			heading: 'Total Reviews ',
			value: pageContent?.totalReviews,
		},
	];
	const trackerData = [
		{
			title: 'Listing Is Live',
			image: EyeIcon,
		},
		{
			title: '5 Reviews Secured',
			image: StarIcon,
		},
		{
			title: 'Banner Bar Live On Site',
			image: BannerIcon,
		}
	]
	const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
	const handleResize = () => {
		setScreenWidth(window.innerWidth);
	};

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

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<>
			<div className='mx-[5%] xl:mx-auto  mt-2' style={{width:'100%'}}>
				<div className='flex flex-wrap items-center justify-between gap-1 sm:gap-4 mb-10'>
					<Box className='gap-1 sm:gap-4 ' sx={{
						display: "flex",
						alignItems: "center",
						flexWrap: "wrap",
						justifyContent: { xs: "center", sm: "space-between" }
					}}>
						<Box className='flex items-center' sx={{
							width: { xs: '55px', sm: '70px' },
							height: { xs: '55px', sm: '70px' },
						}}>
							<img
								src={
									pageContent?.agency?.logo_url
										? pageContent?.agency.logo_url
										: require('../../assets/images/Logomark.svg').default
								}
								alt=''
							/>
						</Box>

						<div>
							<h6 className='text-[22px] font-bold uppercase font-babas tracking-[0.44px]'>
								{pageContent?.agency?.name}
							</h6>
						</div>
						<div className='pl-2'>
							<Link
								target='_blank'
								to={pageContent?.agency?.website}
								className='flex self-start gap-2 ml-7 mr-2 sm:ml-0 sm:mr-0'
								onClick={handleIncrementViews}
							>
								<span
									className='text-activeColorBreadCrum font-montserrat text-sm not-italic font-semibold leading-5'
								>
									Website
								</span>
								<img src={LinkExternal} alt='' />
							</Link>
						</div>
					

					</Box>
					
					{screenWidth > 600 ? (
						<div className='w-[70px] h-[70px]'>
							{pageContent?.agency?.status === 'verified' && (
								<img src={require('../../assets/images/layer.png')} alt='' />
							)}
							{pageContent?.agency?.status === 'unverified' && (
								<img src={require('../../assets/Icons/Notverified.png')} alt='' className="w-[100px] h-[100px] object-contain" />
							)}
						</div>
					) : (
						<Box sx={{
							marginLeft: "auto",
							marginRight: { xs: "auto", sm: 0 }
						}}>
							{pageContent?.agency?.status === 'verified' && (
								<img
									src={require('../../assets/images/layer.png')}
									alt=''
									width={60}
								// style={{ marginTop: '-130px' }}
								/>
							)}
							{pageContent?.agency?.status === 'unverified' && (
								<img
									src={require('../../assets/Icons/Notverified.png')}
									alt=''
									width={60}
								// style={{ marginTop: '-130px' }}
								/>
							)}
						</Box>
					)}
					<h6 style={{paddingLeft:"83px", marginTop:"-35px"}} className='font-babas w-full text-gray700 text-[22px] not-italic leading-normal tracking-[0.44px] uppercase'>
						{pageContent?.agency?.tagline}
					</h6>
				</div>
				<div style={{ padding: "1rem" }} className='bg-[#F2F4F7] mb-[32px] border-2 rounded-lg border-[#EAECF0] p-4'>
					<div className="text-slate-700 text-lg font-semibold font-montserrat leading-7">Onboarding completion Tracker</div>
					<div className='flex gap-6 md:flex-row flex-col'>
						{
							trackerData.map((item) => (
								<div key={item.title} style={{ height: "126px" }} className="flex flex-1 mt-2 bg-[#FFF] relative rounded-lg py-4 md:py-0 border border-[#EAECF0] flex-col justify-center items-center gap-2">
									<div style={{ borderColor: "#FEDF89", background: "#FFFAEB" }} className="px-2 absolute right-3 top-3 py-0.5 rounded-2xl border-2 justify-start items-center inline-flex">
										<div style={{ color: "#B54708", fontWeight: 600 }} className="text-center text-xs  font-montserra] leading-[18px]">In Progress</div>
									</div>
									<img src={item.image} alt='Icon' />
									<div className="text-slate-700 text-xl font-semibold font-montserrat leading-[30px]">{item.title}</div>
								</div>
							))
						}
					</div>
				</div>
				<div className='grid grid-cols-12 gap-[20px]'>
					{Data?.map((item) => {
						return (
							<>
								<div className='col-span-12 md:col-span-6 lg:col-span-3 border border-[#EAECF0] bg-[#FFFFFF] rounded-[8px] flex justify-center py-10'>
									<div className='flex flex-col gap-2'>
										<span className='text-[14px] capitalize font-montserrat font-semibold tracking-[0.44px] flex justify-center'>
											{item?.heading}
										</span>
										<span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'>
											{item?.value}
										</span>
									</div>
								</div>
							</>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default Section2;
