import { Link } from 'react-router-dom';
const Section1 = (props) => {
  return (
    <>
     <div className={`w-full h-[60px] ${props.verified === 'true' ? 'bg-[#edfcef] border-[#119c02]' : 'bg-[#FFFCF5] border-[#FEC84B]'} border-b-2  -mt-5`}>
        <div className="flex items-center gap-3 ml-[5%] pt-5 max-w-[1216px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g clip-path="url(#clip0_2439_4780)">
              <path
                d="M9.99935 6.66699V10.0003M9.99935 13.3337H10.0077M18.3327 10.0003C18.3327 14.6027 14.6017 18.3337 9.99935 18.3337C5.39698 18.3337 1.66602 14.6027 1.66602 10.0003C1.66602 5.39795 5.39698 1.66699 9.99935 1.66699C14.6017 1.66699 18.3327 5.39795 18.3327 10.0003Z"
                stroke={props.verified  === 'true' ? '#119c02' : '#DC6803'}
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_2439_4780">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="text-[#DC6803] text-[14px] font-medium font-montserrat">
            <span className={`text-[14px] font-montserrat font-semibold ${props.verified  === 'true' ? 'text-[#119c02]' : 'text-[##B54708]}'}`}>
               <Link to={""}>
                Listing Page Status: {props.message}
              </Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Section1;
