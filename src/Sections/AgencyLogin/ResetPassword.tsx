import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth0JS from "auth0-js";
import AgencyLogo from "../../assets/Icons/AgencyLogo.svg";
import ErrorIcon from '../../assets/Icons/ErrorIcon.svg';
import ToastContext from "../../Context/ToastContext";

const ResetPassword = () => {
  const auth0 = new auth0JS.WebAuth({
    domain: process.env.REACT_APP_AUTH_DOMAIN || "",
    clientID: process.env.REACT_APP_AUTH_CLIENT_ID || "",
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [emailValidation, setemailValidation] = useState("")
  const { showToast, hideToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event: any) => {
    if (emailValidation) {
      if (emailRegex.test(email)) {
        setemailValidation("")
      }
    }
    setEmail(event.target.value);
  };


  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


  const handleResetPassword = async () => {

    if (!emailRegex.test(email)) {
      setemailValidation("Email is required.")
      return
    }
    setLoading(true);
    await auth0.changePassword(
      {
        connection: "Username-Password-Authentication",
        email,
      },
      (err, res) => {
        if (err) {
          showToast("The email address you entered is incorrect!", "warn");
          setTimeout(() => {
            hideToast();
          }, 3000);
          setLoading(false);
        }
        if (res) {
          showToast("We've sent you an email to reset your password.", "warn");
          setTimeout(() => {
            hideToast();
          }, 3000);
          setLoading(false);
        }
        navigate("/agency-login");
      }
    );
  };

  return (
    <>
      <div className="w-screen h-screen lg:mx-0">
        <div className="grid grid-cols-2">
          <div className="col-span-1 hidden lg:block">
            <img
              alt=""
              className="object-center h-screen w-full"
              src={require("../../assets/images/loginimage.png")}
            />
          </div>
          <div className="col-span-2 lg:col-span-1 h-screen flex items-center justify-center">
            <div className="w-full ">
              <div className="flex items-center justify-center mb-10 w-[400px] sm:w-[450px] mx-auto">
                <Link to={"/"}>
                  <img alt="" src={AgencyLogo} />
                </Link>
              </div>
              <h5 className="text-[24px] font-montserrat font-semibold mb-2 flex items-center justify-center text-center text-[#101828] min-w-[400px]">
                Reset Your Password
              </h5>

              <div className="grid grid-cols-1">
                <div className="col-span-1">
                  <div className="w-[350px]  sm:w-[450px] mx-auto mt-5" style={{ position: "relative" }}>
                    <label
                      htmlFor="email"
                      className="block mb-1 text-[14px]  font-normal text-black dark:text-white font-montserrat"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      style={{
                        border: `1px solid ${emailValidation ? '#F04438' : '#D0D5DD'}`,
                        outline: "none"
                      }}
                      placeholder="Enter your email"
                      className="block w-full px-2 py-3 text-gray-900 border border-[#D0D5DD] rounded-[8px] sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    {emailValidation && (
                      <div className='absolute top-9 right-2'>
                        <img alt='Error' src={ErrorIcon} />
                      </div>
                    )}
                    {emailValidation && (
                      <p
                        className='text-red-500 text-xs mt-1'
                        style={{ color: '#F04438', textAlign: "left" }}
                      >
                        {emailValidation}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center justify-start w-[350px] sm:w-[450px] mx-auto mt-3'
                  // style={screenWidth > 600 ? {} : { marginLeft: "42px", width: "320px" }}

                  >
                    <label
                      htmlFor='remember-checkbox'
                      className='flex items-center text-[14px] text-[#344054] font-medium text-black dark:text-white font-montserrat'
                    >
                      Go back to
                    </label>
                    <Link to='/agency-login' className='text-[14px] font-montserrat font-semibold text-[#329BFA]' style={{ marginLeft: "4px" }}>
                      {` Login`}
                    </Link>
                  </div>

                  <div className="flex items-center w-[350px]  sm:w-[450px] mx-auto mt-6">
                    <button
                      onClick={handleResetPassword}
                      className="text-[14px] text-[#FFFFFF] w-full font-montserrat font-semibold bg-[#329BFA] flex items-center justify-center rounded-lg px-[18px] py-2"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
