const Step1 = ({update}) => {
  return (
    <>
      <div className="mx-[5%] xl:mx-auto  max-w-[1100px]">
        <div className="p-5">
          <div className="mx-4 p-4">
            <div className="flex items-center min-w-[300px] justify-center">
              <div className="flex items-center text-[#D0D5DD] relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="0.75"
                    y="0.75"
                    width="22.5"
                    height="22.5"
                    rx="11.25"
                    fill="#EFF3FF"
                  />
                  <circle cx="12" cy="12" r="4" fill="#3364F7" />
                  <rect
                    x="0.75"
                    y="0.75"
                    width="22.5"
                    height="22.5"
                    rx="11.25"
                    stroke="#3364F7"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute text-center -ml-16 mt-14 w-[150px] text-[10px] sm:text-[14px] font-medium text-[#3364F7]">
                  Company Details
                </div>
              </div>
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-[#D0D5DD]"></div>
              <div className="flex items-center text-white relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="4" fill="#EAECF0" />
                  <rect
                    x="0.75"
                    y="0.75"
                    width="22.5"
                    height="22.5"
                    rx="11.25"
                    stroke="#EAECF0"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute text-center -ml-16 mt-14 w-[150px] text-[10px] sm:text-[14px] font-medium text-[#000]">
                  Listing Details
                </div>
              </div>
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-[#D0D5DD]"></div>
              <div className="flex items-center text-[#000] relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="4" fill="#EAECF0" />
                  <rect
                    x="0.75"
                    y="0.75"
                    width="22.5"
                    height="22.5"
                    rx="11.25"
                    stroke="#EAECF0"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute text-center -ml-16 mt-14 w-[150px] text-[10px] sm:text-[14px] font-medium text-[#000]">
                  Work Spotlight
                </div>
              </div>
              {!update && <>
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-[#D0D5DD]"></div>
             <div className="flex items-center text-[#000] relative ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="4" fill="#EAECF0" />
                  <rect
                    x="0.75"
                    y="0.75"
                    width="22.5"
                    height="22.5"
                    rx="11.25"
                    stroke="#EAECF0"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute text-center -ml-16 mt-14 w-[150px] text-[10px] sm:text-[14px] font-medium text-[#000]">
                  Create Account Login
                </div>
              </div>
              </>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1;
