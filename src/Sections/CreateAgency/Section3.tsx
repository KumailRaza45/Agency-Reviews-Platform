import React, { useState } from 'react';
import { Listing_Data } from '../../Utilities/utilities';
import { FormData } from '../../Interface';

interface Section3Props {
	formData: FormData;
	handleSelectedItems: (category: string, selectedItems: any[]) => void;
}
const Section3: React.FC<Section3Props> = ({
	formData,
	handleSelectedItems,
}) => {
	const { selectedServices, selectedIndustries, selectedMinorities } = formData;

	const [selectedCount, setSelectedCount] = useState({
		Services: selectedServices.length,
		Industries: selectedIndustries.length,
		'Minority Owned (Optional)': selectedMinorities.length,
	});

	const handleButtonClick = (category: string, item: any) => {
		let selectedItems: any[] = [];

		if (isNotApplicableChecked && category === 'Minority Owned (Optional)') {
			return;
		}

		switch (category) {
			case 'Services':
				selectedItems = [...formData.selectedServices];
				break;
			case 'Industries':
				selectedItems = [...formData.selectedIndustries];
				break;
			case 'Minority Owned (Optional)':
				selectedItems = [...formData.selectedMinorities];
				break;
			default:
				break;
		}

		const itemIndex = selectedItems.indexOf(item);
		if (itemIndex !== -1) {
			selectedItems.splice(itemIndex, 1);
		} else {
			// if (
			// 	category === 'Minority Owned (Optional)' &&
			// 	selectedItems.length >= 3
			// ) {
			// 	return;
			// }
			selectedItems.push(item);
		}

		setSelectedCount((prevCounts) => ({
			...prevCounts,
			[category]: selectedItems.length,
		}));

		handleSelectedItems(category, selectedItems);
	};

	const [isNotApplicableChecked, setIsNotApplicableChecked] = useState(false);

	const handleCheckBox = () => {
		setIsNotApplicableChecked((prevValue) => !prevValue);

		if (!isNotApplicableChecked) {
			handleSelectedItems('Minority Owned (Optional)', ['Not Applicable']);
		} else {
			handleSelectedItems('Minority Owned (Optional)', []);
		}
	};

	return (
		<>
			<div className='mx-[5%] xl:mx-auto max-w-[1216px] mt-10'>
				<div className='grid grid-cols-12'>
					{Listing_Data?.map((item) => {
						return (
							<div
								key={item.heading}
								className='col-span-12 min-w-[400px] flex justify-center mx-auto '
							>
								<div className='my-5'>
									<h5 className='text-[16px] font-montserrat font-semibold mb-2 flex items-center justify-center text-center'>
										<span className='font-semibold'>
											{item?.heading.includes('(')
												? ` ${item?.heading.split('(')[0]}`
												: item?.heading}
										</span>
										{item?.heading.includes('(') && (
											<span className='font-normal'>
												{' \u00A0'}({item?.heading.split('(')[1]}
											</span>
										)}
										{item.heading === 'Services' ||
											item.heading === 'Industries' ? (
											<span className='text-[#F04438] ml-1'>*</span>
										) : null}
									</h5>
									<p className='text-[14px] font-medium text-[#667085] font-montserrat flex items-center justify-center text-center'>
										{item?.paragraph}
									</p>
									<div className='flex items-center justify-center flex-wrap gap-[8px] mt-[30px] mx-[5%] lg:mx-[12%]'>
										{item?.tags.map((tag) => {
											const isServiceSelected = selectedServices.includes(
												tag.id,
											);
											const isIndustrySelected = selectedIndustries.includes(
												tag.name,
											);
											const isMinoritySelected = selectedMinorities.includes(
												tag.name,
											);
											let isSelected = false;

											if (item.heading === 'Services') {
												isSelected = isServiceSelected;
											} else if (item.heading === 'Industries') {
												isSelected = isIndustrySelected;
											} else if (item.heading === 'Minority Owned (Optional)') {
												isSelected = isMinoritySelected;
											}
											const isDisabled =
												(item.heading === 'Services' &&
													selectedCount.Services === 3 &&
													!isSelected) ||
												(item.heading === 'Industries' &&
													selectedCount.Industries === 3 &&
													!isSelected);

											if (
												(item.heading === 'Industries') ||
												item.heading === 'Services' ||
												item.heading === 'Minority Owned (Optional)'
											) {
												return (
													<button
														key={tag.id}
														className={`text-[14px] font-inter font-medium px-2 py-1 border border-[#D0D5DD] rounded-[8px] hover:border-[#85A2FA] ${isSelected ? 'text-[#3364F7] bg-[#EFF3FF]' : ''
															}`}
														onClick={() =>
															handleButtonClick(
																item.heading,
																item.heading === 'Services' ? tag.id : tag.name,
															)
														}
														disabled={isDisabled}
													>
														{tag.name}
													</button>
												);
											}
										})}
									</div>
									{selectedCount[item.heading] === 3 && (
										<p className='text-[#F04438] font-montserrat text-[14px] font-medium text-center mt-2'>
											{item?.redline}
										</p>
									)}
									<div>
										{item?.checkbox && (
											<div className='flex items-center justify-center mt-5'>
												<input
													id='default-checkbox'
													type='checkbox'
													checked={isNotApplicableChecked}
													onChange={handleCheckBox}
													className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
												/>
												<label
													htmlFor='default-checkbox'
													className='ml-2 text-[14px]  font-normal text-black dark:text-white font-montserrat'
												>
													Not Applicable
												</label>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default Section3;
