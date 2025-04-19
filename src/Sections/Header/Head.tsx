import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/Icons/Logo.svg";
import { ReactComponent as Check } from "../../assets/Icons/check-square.svg";
import { ReactComponent as CheckCircle } from "../../assets/Icons/CheckVarify.svg";
import { ReactComponent as Logout } from "../../assets/Icons/log-out-01.svg";

import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	Modal,
	useMediaQuery,
} from "@mui/material";
import { UserContext } from "../../Context/UserContext";
import GetMatchedFlow from "../../Components/GetMatchedFlow";

const Head: React.FC = () => {
	const isMobile = useMediaQuery("(max-width:786px)");
	const [showSideMenu, setShowSideMenu] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const navigate = useNavigate()
	const { setIsGetMatchedBtnClicked } = useContext(UserContext);

	const menus = [
		{
			label: "Get Matched",
			link: ""
		},
		{
			label: "Agencies",
			link: "/listing"
		},
		{
			label: "Agency Login",
			link: "/agency-login"
		},
	];

	return (
		<>
			<div style={{ display: "none" }}>
				<GetMatchedFlow onClick={() => { }} />
			</div>
			<div
				className={`grid grid-cols-[auto_auto] items-center justify-between gap-1 sm:gap-0 max-w-[1216px] h-[62px] px-[5%] xl:mx-auto relative`}
				style={{ backgroundColor: "#F9Fafb", borderBottom: "1px solid #EAECF0" }}
			>
				<div style={{ marginLeft: "0px" }} className="grid grid-cols-1">
					<Link to={"/"}>
						<Logo width={165} />
					</Link>
				</div>
				<img
					onClick={() => setShowSideMenu(true)}
					alt=""
					src={require("../../assets/images/hamburger.png")}
					height={20}
					width={20}
				/>
			</div>
			{isMobile ? (
				<Modal open={showSideMenu}>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Drawer
							sx={{
								width: window.outerWidth - 64,
								flexShrink: 0,
								"& .MuiDrawer-paper": {
									width: window.outerWidth - 64,
									boxSizing: "border-box",
								},
							}}
							variant="persistent"
							anchor="left"
							open
						>
							<Link style={{ marginTop: 6 }} to={"/"}>
								<Logo width={165} />
							</Link>
							<List>
								{menus.map((menu, index) => (
									<ListItem
										onClick={() => {
											setSelectedIndex(index);

											if (index === 0) {
												// 
											}
											else {
												navigate(`${menu.link}`)
												setShowSideMenu(false);
											}

										}}
										key={menu.label}
										disablePadding
									>
										<ListItemButton className="w-full " style={{ display: "flex" }}>
											{
												index === 0
													?
													<GetMatchedFlow isInMenuBar={true} selectedIndex={selectedIndex === index} onClick={() => { setShowSideMenu(false); }} />
													:
													<>
														{
															index === 1 ?
																<CheckCircle
																	height={24}
																	width={24}
																	style={{ marginRight: "12px", stroke: selectedIndex === index ? "#17B26A" : "#344054" }}
																/>
																:
																<Logout
																	height={24}
																	width={24}
																	style={{ marginRight: "12px", stroke: selectedIndex === index ? "#17B26A" : "#344054" }}
																/>
														}
														<span
															style={{
																fontFamily: "Inter",
																fontSize: "16px",
																fontWeight: "500",
																color:
																	selectedIndex === index ? "#17B26A" : "#344054",
															}}
														>
															{menu.label}
														</span>
													</>
											}

										</ListItemButton>
									</ListItem>
								))}
							</List>
						</Drawer>
						<img
							onClick={() => setShowSideMenu(false)}
							alt=""
							src={require("../../assets/images/crossWhite.png")}
							height={40}
							width={40}
						/>
					</div>
				</Modal>
			) : null}
			{!isMobile ? (
				<div className="border-t mb-8 max-w-[1216px] border-[#EAECF0] mx-[5%] xl:mx-auto "></div>
			) : null}
		</>
	);
};

export default Head;
