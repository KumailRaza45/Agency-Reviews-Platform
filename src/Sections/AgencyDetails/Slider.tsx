import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RatingStars from '../../Components/RatingStars';
import Logomark from "../../assets/Icons/Logomark.svg"
import layer from "../../assets/images/layer.png"
import { AgencyDetailsType } from "../../Interface";
import { Link } from 'react-router-dom'; // Import the Link component

interface Slide {
  id: number;
  logoSrc: string;
  heading: string;
  text: string;
  link: string; // Add a 'link' property to each slide
}

interface SliderComponentProps {
  slides: Slide[];
}

const Section8: React.FC<SliderComponentProps> = ({ slides }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  const data = [
    { "firstName": "John", "lastName": "Doe" },
    { "firstName": "Anna", "lastName": "Smith" },
    { "firstName": "Peter", "lastName": "Jones" }

  ]

  return (
    <>
      <div id='snapshot' className='mx-[5%] xl:mx-auto max-w-[1216px] mt-10'>
        <h6 className='text-[24px] font-semibold font-inter tracking-[0.44px] mb-2'>
          Similar Verified Listings 
        </h6>
        <h6 className='text-[20px] font-semibold font-inter tracking-[0.44px] mb-2' style={{textAlign:"end",marginTop:"-42px",color:"#329BFA"}}>
          Explore verified agencies
        </h6>
        
        <Slider {...settings}>
          {slides?.map((slide) => (
            <div key={slide.id} className='col-span-12 md:col-span-6 lg:col-span-4 bg-[#F2F4F7] rounded-[8px] flex justify-center py-10' style={{ width: "90%" }}>
            <Link to={`/AgencyDetails/${93}`} className="slide-link">
             
                <div className='flex flex-col gap-2'>
                  <img style={{ margin: "-28px 0px 0px 300px" }} src={layer} width={40} />
                  <img style={{ margin: "0px auto" }} src={Logomark} width={80} />
                  <span className='text-[14px] capitalize font-montserrat font-semibold tracking-[0.44px] flex justify-center'>
                    Overall rating
                  </span>
                  <div className='text-[14px] capitalize font-montserrat font-normal tracking-[0.44px] flex justify-center text-center ml-3 mr-3'>
                    <p>{slide.text}</p>
                  </div>
                  <div className="flex items-center flex-wrap gap-[8px]" style={{ margin: "0px auto" }}>
                    {data?.map((service, index) => (
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
                          {service.firstName}
                        </p>
                      </div>
                    ))}
                  </div>
                  <hr style={{ color: "#EAECF0" }} />
                  <div className='flex items-center justify-center gap-1 h-[24px] pt-5'>
                    <RatingStars rating={5} />
                    <span className='text-[24px] font-inter font-semibold tracking-[0.44px] flex justify-center'>
                      4.5
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Section8;
