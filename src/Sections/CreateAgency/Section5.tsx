
import { useState } from "react";

const Section5 = ({
  formData,
  handleFormDataChange,
  passwordMatch,
  setPasswordMatch,
  error,
  emailError,
  setEmailError,
  passwordValidationError,
  setPasswordValidationError,
}) => {


  const [passwordError, setPasswordError] = useState("");

  const passwordPattern = /^(?=.*[!@#$%^&*(),.?":{}|<>[\]=\-_+;'/\s])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;


  const handleInputChange = (event: any, field: any) => {
    const value = event.target.value;

    if (field === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setEmailError("Invalid email format");
        handleFormDataChange(field, value);
        return;
      }
      setEmailError("");
    }

    handleFormDataChange(field, value);

    if (field === "password" || field === "confirmPassword") {
      const newPassword = field === "password" ? value : formData.password;
      const confirmPassword =
        field === "confirmPassword" ? value : formData.confirmPassword;

      if (newPassword === confirmPassword) {
        setPasswordMatch(true);
        setPasswordError("");
      } else {
        setPasswordMatch(false);
        setPasswordError("Passwords do not match");
      }
    }

    if (field === "password") {
      const newPassword = field === "password" ? value : formData.password;
      if (!passwordPattern.test(newPassword)) {
        setPasswordValidationError("Password must have at least 1 special character, 1 uppercase letter, 1 number, and be at least 8 characters long.")
      }
      else {
        setPasswordValidationError("")
      }
    }

  };

  return (
    <>
      <div className="mx-[5%] xl:mx-auto max-w-[1216px] mt-10">
        <h5 className="text-[16px] font-montserrat font-semibold mb-2 flex items-center justify-center text-center min-w-[400px]">
          Create Account Login
        </h5>
        <p className="text-[14px] font-medium text-[#667085] font-montserrat flex items-center justify-center text-center min-w-[400px]">
          This email address and password will be used to login to your account
        </p>
        <div className="flex flex-col mx-auto min-w-[350px] sm:w-[450px]">
          <div className="w-[400px] sm:w-[450px] mx-auto mt-5">
            <label
              htmlFor="email"
              className="block mb-1 text-[14px] font-normal text-black dark:text-white font-montserrat"
            >
              Email <span className="text-[#F04438]">*</span>
            </label>
            <input
              id="email"
              placeholder="Enter your primary email"
              className="block w-full px-2 py-3 text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
            />
            {emailError && <p style={{ color: "#F04438", fontSize: '12px' }}>{emailError}</p>}
            {error && <p style={{ color: "#F04438" }}>{error}</p>}
          </div>
          <div className="w-[400px] sm:w-[450px] mx-auto mt-5">
            <label
              htmlFor="password"
              className="block mb-1 text-[14px] font-normal text-black dark:text-white font-montserrat"
            >
              Password <span className="text-[#F04438]">*</span>
            </label>
            <input
              id="password"
              placeholder="********"
              type="password"
              className="block w-full px-2 py-3 text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
            />
            {passwordValidationError && (
              <p style={{ color: 'red', fontSize: '12px' }}>{passwordValidationError}</p>
            )}
          </div>
          <div className="w-[400px] sm:w-[450px] mx-auto mt-5">
            <label
              htmlFor="cpassword"
              className="block mb-1 text-[14px] font-normal text-black dark:text-white font-montserrat"
            >
              Confirm Password <span className="text-[#F04438]">*</span>
            </label>
            <input
              id="cpassword"
              placeholder="********"
              type="password"
              className="block w-full px-2 py-3 text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange(e, "confirmPassword")}
            />
            {!passwordMatch && (
              <p style={{ color: 'red', fontSize: '12px' }}>{passwordError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Section5;
