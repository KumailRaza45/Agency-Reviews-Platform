import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import auth0JS from "auth0-js";
import AgencyLogo from "../../assets/Icons/AgencyLogo.svg";
import ErrorIcon from "../../assets/Icons/ErrorIcon.svg";
import { BeatLoader } from "react-spinners";
import ToastContext from "../../Context/ToastContext";

const Section1 = () => {
	const { loginWithRedirect } = useAuth0();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [attemptedSignIn, setAttemptedSignIn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const { showToast, hideToast } = useContext(ToastContext);

	const auth0 = new auth0JS.WebAuth({
		domain: process.env.REACT_APP_AUTH_DOMAIN || "",
		clientID: process.env.REACT_APP_AUTH_CLIENT_ID || "",
	});

	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	const validateEmail = () => {

		if (email === "") {
			setEmailError('Email is required');
		}
		else if (!emailRegex.test(email)) {
			setEmailError('Email is invalid.');

		} else {
			setEmailError('');
		}
	};

	const validatePassword = () => {
		if (!password) {
			setPasswordError("Password is required");
		} else {
			setPasswordError("");
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setAttemptedSignIn(true);
		validateEmail();
		validatePassword();

		if (email && password) {
			sessionStorage.setItem("loginuserwithemail", email);
			setLoading(true);
			await auth0.login(
				{
					email: email,
					password: password,
					redirectUri: process.env.REACT_APP_USER_LOGIN,
					responseType: "token",
				},
				(err) => {
					if (err) console.log(err);
					showToast(
						"The email address or password you entered is incorrect!",
						"warn"
					);
					setTimeout(() => {
						hideToast();
					}, 3000);
					setLoading(false);
				}
			);
		}
	};

	const hidePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleRememberMe = () => {
		setRememberMe(!rememberMe);
	};

	useEffect(() => {
		console.log(loading, "loading");
	}, [loading]);

	const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
	const handleResize = () => {
		setScreenWidth(window.innerWidth);
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<form className="w-screen lg:mx-0" onSubmit={handleLogin}>
				<div className="grid grid-cols-2">
					<div className="col-span-1 hidden lg:block">
						<img
							alt=""
							className="object-center h-screen w-full"
							src={require("../../assets/images/loginimage.png")}
						/>
					</div>
					<div className="col-span-2 lg:col-span-1 flex items-center justify-center min-h-screen lg:h-full">
						{/* Add a parent container */}
						<div className="flex items-center justify-center w-full">
							<div className="w-full">
								<div className="w-full ">
									<div className="flex items-center justify-center mb-10 w-[400px] sm:w-[450px] mx-auto">
										<Link to={"/"}>
											<img alt="" src={AgencyLogo} />
										</Link>
									</div>
									<h5 className="text-[24px] font-montserrat font-semibold mb-2 flex items-center justify-center text-center text-[#101828] min-w-[400px]">
										Welcome back
									</h5>
									<p className="text-[14px] font-medium text-[#667085] font-montserrat flex items-center justify-center text-center min-w-[400px] mb-[30px]">
										Welcome back! Please enter your details.
									</p>
									<div className="grid grid-cols-1 text-center">
										<div
											className="col-span-1 "
										// style={screenWidth > 600  ? {}: {marginLeft:"24px"}}

										// width: 320px;
										// margin-left: 45px;
										>
											<div
												className="w-[350px] sm:w-[450px] mx-auto mt-5"
												style={
													screenWidth > 600
														? {}
														: { width: "320px" }
												}
											>
												<label
													htmlFor="email"
													className="block text-left mb-1 text-[14px] font-normal text-black dark:text-white font-montserrat"
												>
													Email
												</label>
												<div className="relative">
													<input
														id="email"
														value={email}
														onChange={(e) => { setEmail(e.target.value) }}
														onBlur={validateEmail}
														placeholder="Enter your email"
														style={{
															border: `1px solid ${emailError
																? "#F04438"
																: "#D0D5DD"
																}`,
														}}
														className={`block w-full px-2 py-3 text-gray-900 ${emailError
															? "border-red-500"
															: "border-[#D0D5DD]"
															} rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
													/>
													{emailError && (
														<div className="absolute top-2 right-2">
															<img alt="Error" src={ErrorIcon} />
														</div>
													)}
												</div>
												{emailError && (
													<p
														className="text-red-500  text-xs mt-1"
														style={{ color: "#F04438", textAlign: "left" }}
													>
														{emailError}
													</p>
												)}
											</div>
											<div
												className="w-[350px] sm:w-[450px] mx-auto mt-5"
												style={
													screenWidth > 600
														? {}
														: { width: "320px" }
												}
											>
												<label
													htmlFor="password"
													className="block text-left mb-1 text-[14px] font-normal text-black dark:text-white font-montserrat"
												>
													Password
												</label>
												<div className="relative">
													<input
														id="password"
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														onBlur={validatePassword}
														placeholder="********"
														type={showPassword ? "text" : "password"}
														style={{
															border: `1px solid ${attemptedSignIn && emailError
																? "#F04438"
																: "#D0D5DD"
																}`,
														}}
														className={`block w-full px-2 py-3 text-gray-900 ${attemptedSignIn && emailError
															? "border-red-500"
															: "border-[#D0D5DD]"
															} rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
													/>
													{attemptedSignIn && passwordError && (
														<div className="absolute top-2 right-2">
															<img alt="Error" src={ErrorIcon} />
														</div>
													)}
												</div>
												{attemptedSignIn && passwordError && (
													<p
														className="text-red-500 text-xs mt-1"
														style={{ color: "#F04438", textAlign: "left" }}
													>
														{passwordError}
													</p>
												)}
											</div>
											<div
												className="flex items-center justify-between w-[350px] sm:w-[450px] mx-auto mt-3"
												style={
													screenWidth > 600
														? {}
														: { width: "320px" }
												}
											>
												<div className="flex items-center justify-center ">
													<input
														id="show-password-checkbox"
														type="checkbox"
														checked={showPassword}
														onChange={() => setShowPassword(!showPassword)}
														className="w-4 h-4 text-blue-600 bg-[#FFFFFF] border-[#D0D5DD] rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
													/>
													<label
														htmlFor="show-password-checkbox"
														className="ml-2 text-[14px] text-[#344054] font-medium text-black dark:text-white font-montserrat"
													>
														Show password
													</label>
												</div>
											</div>
											<div
												className="flex items-center justify-between w-[350px] sm:w-[450px] mx-auto mt-3"
												style={
													screenWidth > 600
														? {}
														: { width: "320px" }
												}
											>
												<div className="flex items-center justify-center ">
													<input
														id="remember-checkbox"
														type="checkbox"
														checked={rememberMe}
														onChange={handleRememberMe}
														className="w-4 h-4 text-blue-600 bg-[#FFFFFF] border-[#D0D5DD] rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
													/>
													<label
														htmlFor="remember-checkbox"
														className="flex items-center ml-2 text-[14px] text-[#344054] font-medium text-black dark:text-white font-montserrat"
													>
														Remember for 30 days
													</label>
												</div>
											</div>
											<div
												className="flex items-center justify-between w-[350px] sm:w-[450px] mx-auto mt-3"
												style={
													screenWidth > 600
														? {}
														: {  width: "320px" }
												}
											>
												<Link
													to="/reset-password"
													className="text-[14px] font-montserrat font-semibold text-[#329BFA]"
												>
													Forgot password
												</Link>
											</div>
											<div
												className="flex items-center w-[350px] sm:w-[450px] mx-auto mt-6"
												style={
													screenWidth > 600
														? {}
														: {  width: "320px" }
												}
											>
												{!loading ? (
													<button
														onClick={handleLogin}
														className={`text-[14px] text-[#FFFFFF] w-full font-montserrat font-semibold ${loading ? "bg-[#d3d3d3]" : "bg-[#329BFA]"
															} flex items-center justify-center rounded-lg px-[18px] py-2`}
													>
														{" "}
														Sign in
													</button>
												) : (
													<div
														className="h-[100%] w-[100%] flex justify-center"
														style={{ alignItems: "center" }}
													>
														<BeatLoader
															color="#3364F7"
															cssOverride={{}}
															loading
															speedMultiplier={0.5}
														/>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
};

export default Section1;
