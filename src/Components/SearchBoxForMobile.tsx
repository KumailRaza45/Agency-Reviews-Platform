import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ReactComponent as SearchIcon } from "../assets/Icons/search.svg"
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useFocusWithin } from "@react-aria/interactions";
import { stringToSlug } from '../Utilities/utilities';

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


export function SearchBoxForMoblie(props) {

	const [searchText, setSearchText] = useState<string>("");

	const [isSearchOpenonMobile, setisSearchOpenonMobile] = useState(false)

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

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if ((searchedData?.searchAgencies?.agencies || loading) && searchText?.length > 0 && DropdownOpen) {
			props?.isSearchResultOpened(true)
		}
		else {
			props?.isSearchResultOpened(false)
		}
	}, [searchedData?.searchAgencies?.agencies, loading, searchText, DropdownOpen])


	const searchBar = useMemo(() => {
		return (
			<div ref={dropdownRef} style={{ position: 'relative', width: '320px', marginLeft: '10px', marginRight: '10px' }}>
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
							setSearchText(e.target.value)
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
				{
					((searchedData?.searchAgencies?.agencies || loading) && searchText?.length > 0 && DropdownOpen) &&

					<div className='custom-scroll-bar' style={{ zIndex: "10", margin: "5px  0px 0px 0px", border: '0.5px solid #e1e1e1', borderRadius: '2px', position: 'absolute', width: '100%', background: '#ffffff', maxHeight: '288px', overflowY: "auto" }}>
						{
							loading ? (
								<div className='w-100 flex' style={{ height: "285px", alignItems: "center", justifyContent: "center" }}>
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
														setDropdownOpen(false)
														if (window.innerWidth > 767) {
															window.open(`AgencyDetails/${agency.id}/${stringToSlug(agency.name)}`, '_blank')
														}
														else {
															navigate(`AgencyDetails/${agency.id}/${stringToSlug(agency.name)}`);
														}
													}}
												>
													{agency.name}
												</div>
											)
										})
									) :
									<div className='w-100 flex' style={{ lineHeight: '40px', alignItems: "center", justifyContent: "center" }}>
										No agency found
									</div>

						}
					</div>
				}
			</div>
		)
	}, [searchText, loading, searchedData, dropdownRef, DropdownOpen])

	return (
		<>

			<>
				{searchBar}
			</>
		</>

	)
}
