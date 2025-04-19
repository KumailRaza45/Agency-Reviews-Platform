const Step2 = ({update}) => {
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
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.096 7.38967L9.93602 14.2997L8.03602 12.2697C7.68602 11.9397 7.13602 11.9197 6.73602 12.1997C6.34602 12.4897 6.23602 12.9997 6.47602 13.4097L8.72602 17.0697C8.94602 17.4097 9.32601 17.6197 9.75601 17.6197C10.166 17.6197 10.556 17.4097 10.776 17.0697C11.136 16.5997 18.006 8.40967 18.006 8.40967C18.906 7.48967 17.816 6.67967 17.096 7.37967V7.38967Z"
                    fill="#3364F7"
                  />
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

                <div className="absolute text-center -ml-16 mt-14 w-[150px] text-[10px] sm:text-[14px] font-medium text-[#000]">
                  Company Details
                </div>
              </div>
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-[#3364F7]"></div>
              <div className="flex items-center text-white relative">
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

export default Step2;
