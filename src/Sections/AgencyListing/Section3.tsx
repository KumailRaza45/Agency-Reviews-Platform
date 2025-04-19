import React from "react";

const Section3 = ({pageContent}) => {
  return (
    <>
      <div className="mx-[5%] xl:mx-auto mt-10" style={{width:'100%'}}>
        <div className="flex items-center justify-between">
          <h6 className="text-[24px] font-semibold font-montserrat">
            About {pageContent?.name}
          </h6>
          <div className="flex items-center flex-wrap gap-[8px]">
          {pageContent?.services?.map((service, index) => (
									<div
										key={index}
										className='flex justify-center items-center gap-[8px] h-[26px] pr-[9px] max-w-fit relative'
										style={{
											backgroundColor: '#3364F7',
											transform: 'skewX(-12deg)',
											borderRadius: '8px',
										}}
									>
										<p className='text-[18px] uppercase text-[#FFF] font-babas flex items-center justify-between pl-2'>
											{service?.service?.name}{' '}
										</p>
									</div>
								))}
          </div>
        </div>
        <p className="text-[16px] font-medium font-montserrat leading-[24px] mt-5 text-[#344054]">
          {pageContent?.bio}
        </p>
      </div>
    </>
  );
};

export default Section3;
