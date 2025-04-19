import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ReactComponent as SearchIcon } from "../assets/Icons/search.svg"
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useFocusWithin } from "@react-aria/interactions";
import { stringToSlug } from '../Utilities/utilities';
import { Modal } from '@mui/material';

const SEARCHED_AGENCIES = gql`
    query searchAgencies($searchText: String!) {
		searchAgencies(searchText: $searchText) {
			totalCount
			filteredCount
			agencies{
				id
				name
			}
		}
    }
`;


export function SearchBox(props) {

	const { onSearchConfirm, onSearchTextChange, deactiveMobileResponsive, onSelectAgency, agencieyNotListied } = props;
	const [searchText, setSearchText] = useState<string>("");
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [isSearchOpenonMobile, setisSearchOpenonMobile] = useState(false);

	const [DropdownOpen, setDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null);
	const handleClickOutside = (event) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target)
		) {
			setDropdownOpen(false);
		}
	};

	const isButtonClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement | null;
		return !!target?.closest(".button");
	};

	const [searchAgencies, { loading, data: searchedData, error },] = useLazyQuery(SEARCHED_AGENCIES);
	const timerRef = useRef({});
	const navigate = useNavigate();
	const handleSearch = async (_searchText: string) => {

		clearTimeout(timerRef.current as NodeJS.Timeout)

		timerRef.current = setTimeout(async () => {
			await searchAgencies({
				variables: { searchText: _searchText }
			})
		}, 1000)

	}

	const handleSearchSubmit = (e: any) => {
		e.preventDefault();
		setDropdownOpen(false);
		onSearchConfirm?.(searchText);
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth > 767) {
				setisSearchOpenonMobile(false)
			}
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const searchBar = useMemo(() => {
		return (
			<div ref={dropdownRef} style={{ position: 'relative', width: '320px' }}>
				<form onSubmit={handleSearchSubmit}>
					<div className='flex justify-center align-item-center'
						style={{ position: 'relative' }}
					>
						<input
							value={searchText}
							style={{ outline: "none" }}
							placeholder={props.placeholder || 'Type somthing'}
							onClick={() => { setDropdownOpen(true) }}
							onChange={(e) => {
								e.preventDefault();
								let value = e.target.value
								setSearchText(e.target.value);
								onSearchTextChange?.(e.target.value);
								setDropdownOpen(true);
								if (value.length > 0) {
									handleSearch(e.target.value)
								}
							}}
						/>

						<SearchIcon
							style={{ position: 'absolute', right: '0', display: 'flex', alignItems: 'center', alignSelf: "center" }}
							onClick={() => { }}
						/>
					</div>
				</form>
				{
					((searchedData?.searchAgencies?.agencies || loading) && searchText?.length > 0 && DropdownOpen) &&

					<div className='custom-scroll-bar' style={{ zIndex: "10", margin: "5px  0px 0px 0px", border: '0.5px solid #e1e1e1', borderRadius: '8px', position: 'absolute', width: '100%', background: '#ffffff', maxHeight: '288px', overflowY: "auto" }}>
						{
							loading ? (
								<div className='w-full flex' style={{ height: "285px", alignItems: "center", justifyContent: "center" }}>
									<BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5} />
								</div>

							) :

								searchedData?.searchAgencies?.agencies?.length > 0
									? (
										searchedData?.searchAgencies?.agencies?.map((agency, index) => {
											return (
												<div
													className='hover:bg-[#CCCCCC]'
													style={{ borderBottom: index === searchedData?.searchAgencies?.agencies?.length - 1 ? 'none' : "0.5px solid #e1e1e1", lineHeight: '40px', cursor: 'pointer', padding: '0 8px' }}
													onClick={() => {
														if (onSelectAgency) {
															onSelectAgency(agency)
														}
														else {
															if (window.innerWidth > 767) {
																window.open(`/AgencyDetails/${agency.id}/${stringToSlug(agency.name)}`, '_blank')
															}
															else {
																navigate(`/AgencyDetails/${agency.id}/${stringToSlug(agency.name)}`);
															}
														}
														setDropdownOpen(false)

													}}
												>
													{agency.name}
												</div>
											)
										})
									) :
									<div className='w-full flex' style={{ lineHeight: '40px', alignItems: "center", justifyContent: "center" }}>
										{
											agencieyNotListied
												?
												<div className='w-full flex' style={{ justifyContent: "space-between", padding: "5px 10px", cursor: "pointer" }} onClick={() => { onSelectAgency(searchText) }}>
													<span className="font-montserrat text-gray700 text-[14px] font-medium not-italic" style={{ fontWeight: "500" }}> Agency not listed!</span>
													<div>
														<span className="font-montserrat text-[#3364F7] text-[14px] font-medium not-italic" style={{ fontWeight: "600" }}>Submit</span>
													</div>
												</div>
												:
												"No agency found"
										}

									</div>

						}
					</div>
				}
			</div>
		)
	}, [searchText, loading, searchedData, dropdownRef, DropdownOpen])

	return (
		<>
			{
				(isMobile && !deactiveMobileResponsive)
					?
					<>

						<div className='rounded-lg border border-grayBorder bg-whiteColor' onClick={() => { setisSearchOpenonMobile(true); setSearchText('') }}>
							<SearchIcon
								style={{ display: 'flex', alignItems: 'center', alignSelf: "center" }}
							/>
						</div>

						{
							<Modal
								open={isSearchOpenonMobile}
								onClose={() => { setisSearchOpenonMobile(false); setSearchText(""); }}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
								className="custom-modal"
							>
								<div className='flex' style={{ marginTop: '90px', alignSelf: "flex-start" }}>
									{searchBar}
								</div>
							</Modal>
						}

					</>
					:
					<>
						{searchBar}
					</>
			}
		</>

	)
}
