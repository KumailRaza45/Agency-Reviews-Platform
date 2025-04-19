import React, { useEffect, useState } from 'react';
import Sorting from './Dropdowns/Sorting';
// import useClickOutside from "../../Hooks/useClickOutside";
import ServiceSlider from "./ServiceSlider";
import MoreFilters from './Dropdowns/MoreFilters';
import { SearchBox } from '../../Components/SearchBox';
import GetMatchedFlow from '../../Components/GetMatchedFlow';
// import Filter from '../../assets/Icons/filter.svg'

const Section2 = ({
	handleCheckboxChange,
	handleServiceChange,
	resetServices,
	services,
	setServices,
	setMoreFilter,
	setSort,
	selectedCheckboxes,
	handleClearServicesSelectedFilter,
	handleSubmit,
	handleRemoveClick,
	moreFilter,
	industryCheckboxes,
	IndustryExpertCheckboxChange,
	IndustryExpertReset,
	OwnershipExpertCheckboxChange,
	OwnerShipReset,
	handleCostSelected,
	ownerShipCheckboxes,
	Costselected,
	CostReset,
	HeadCountselected,
	handleHeadCountSelected,
	HeadCountReset,
	Rattingselected,
	handleRattingSelected,
	RattingReset,
	handleClearSelectedFilter,
	handleClearAllFilterSubmit,
	sort,
	handleSort,
	dataCount,
	totalCount,
	onSearch,
	onSearchTextChange
}) => {

	const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
	const [showComponent, setShowComponent] = useState<boolean>(false);
	const handleResize = () => {
		setScreenWidth(window.innerWidth);
		if (window.innerWidth > 576) {
			setShowComponent(false);
		} else {
			setShowComponent(true);
		}
	};

	useEffect(() => {

		window.addEventListener("resize", handleResize);
		if (window.innerWidth > 576) {
			setShowComponent(false);
		} else {
			setShowComponent(true);
		}
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<div className='grid grid-cols-1 mx-[5%] xl:mx-auto max-w-[1216px] sticky top-0 z-50 bg-whiteColor pb-2 border-b border-[#EAECF0]'>


				<div className='relative flex justify-end md:gap-4 gap-3 justify-items-end my-[28px]' >

					{/* {showComponent &&
						<Services
							services={services}
							setServices={setServices}
							setMoreFilter={setMoreFilter}
							setSort={setSort}
							selectedCheckboxes={selectedCheckboxes}
							handleCheckboxChange={handleCheckboxChange}
							clearSelectedFilter={handleClearServicesSelectedFilter}
							handleSubmit={handleSubmit}
						/>
					} */}
					{
						showComponent &&
						<div style={{ position: 'absolute', left: '0' }}>
							<GetMatchedFlow />
						</div>
					}

					<SearchBox
						placeholder={'Search for an agency'}
						onSearchTextChange={(value: string) => {
							onSearchTextChange(value);
						}}
						agencieyNotListied={false}
						onSearchConfirm={onSearch}
					/>

					<MoreFilters
						moreFilter={moreFilter}
						setServices={setServices}
						setMoreFilter={setMoreFilter}
						setSort={setSort}
						industryCheckboxes={industryCheckboxes}
						IndustryExpertCheckboxChange={IndustryExpertCheckboxChange}
						IndustryExpertReset={IndustryExpertReset}
						OwnershipExpertCheckboxChange={OwnershipExpertCheckboxChange}
						OwnerShipReset={OwnerShipReset}
						handleCostSelected={handleCostSelected}
						ownerShipCheckboxes={ownerShipCheckboxes}
						Costselected={Costselected}
						CostReset={CostReset}
						HeadCountselected={HeadCountselected}
						handleHeadCountSelected={handleHeadCountSelected}
						HeadCountReset={HeadCountReset}
						Rattingselected={Rattingselected}
						handleRattingSelected={handleRattingSelected}
						RattingReset={RattingReset}
						handleClearSelectedFilter={handleClearSelectedFilter}
						handleClearAllFilterSubmit={handleClearAllFilterSubmit}
						handleSubmit={handleSubmit}
						handleServiceChange={handleServiceChange}
						selectedCheckboxes={selectedCheckboxes}
						resetServices={resetServices}
					/>
					<Sorting
						sort={sort}
						setServices={setServices}
						setMoreFilter={setMoreFilter}
						setSort={setSort}
						handleSort={handleSort}
					/>
				</div>
				<div style={{ display: screenWidth < 768 ? 'none' : 'flex', marginTop: screenWidth < 514 ? '20px' : '-50px' }}>
					<span className='text-[16px] font-inter'>Showing <b>{totalCount.toLocaleString()}</b> agencies</span>
				</div>
				{!showComponent &&
					<ServiceSlider
						selectedCheckboxes={selectedCheckboxes}
						handleCheckboxChange={handleServiceChange}
						handleRemoveClick={handleRemoveClick}
					/>
				}
			</div>

		</>
	);
};

export default Section2;
