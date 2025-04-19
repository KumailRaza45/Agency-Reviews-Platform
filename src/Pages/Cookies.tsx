import React, { useState, useEffect } from "react";
import LayoutWithHeaderLogoOnly from "../Components/Layouts/LayoutWithHeaderLogoOnly";
import Footer from "../Sections/Footer/Footer";

const Cookies: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const headingStyle: React.CSSProperties = {
    fontFamily: "Montserrat",
    fontSize: windowWidth > 768 ? "24px" : "18px", // Adjust font size
    fontWeight: 600,
    lineHeight: "30px",
    letterSpacing: "0em",
    textAlign: "left",
    paddingBottom: "20px",
    color: "#344054",
  };

  const subheadingStyle: React.CSSProperties = {
    fontFamily: "Montserrat",
    fontSize: windowWidth > 768 ? "16px" : "14px", // Adjust font size
    fontWeight: 600,
    lineHeight: "20px",
    letterSpacing: "0em",
    textAlign: "left",
    paddingBottom: "5px",
    color: "#344054",
  };

  const paragraphStyle: React.CSSProperties = {
    fontFamily: "Montserrat",
    fontSize: windowWidth > 768 ? "14px" : "12px", // Adjust font size
    fontWeight: 500,
    lineHeight: "20px",
    letterSpacing: "0em",
    textAlign: "justify",
    paddingBottom: "22px",
    color: "#667085",
  };
  return (
    <div>
      <LayoutWithHeaderLogoOnly />
      <div className="xl:mx-auto grid grid-cols-[auto] items-center justify-between gap-1 sm:gap-0 max-w-[1216px] h-[100px] mx-[5%] ">
        <h1 style={headingStyle}>Cookies policy</h1>
        <div className="content">
          <h2 style={subheadingStyle}>
            Lorem ipsum dolor sit amet consectetur.
          </h2>
          <p style={paragraphStyle}>
            Lorem ipsum dolor sit amet consectetur. Id lorem eget magna risus
            sit. Nibh vulputate nullam proin risus magna nulla. Ultrices s
            uspendisse elementum nibh nibh nulla tortor. Quis sit dictum pretium
            congue et blandit. Augue pretium quis ac adipiscing in. Sed in
            maecenas scelerisque vestibulum adipiscing non. Eu pellentesque sit
            molestie donec. Lorem ipsum dolor sit amet consectetur. Id lorem
            eget magna risus sit. Nibh vulputate nullam proin risus magna nulla.
            Ultrices s uspendisse elementum nibh nibh nulla tortor. Quis sit
            dictum pretium congue et blandit. Augue pretium quis ac adipiscing
            in. Sed in maecenas scelerisque vestibulum adipiscing non. Eu
            pellentesque sit molestie donec.Lorem ipsum dolor sit amet
            consectetur. Id lorem eget magna risus sit. Nibh vulputate nullam
            proin risus magna nulla. Ultrices s uspendisse elementum nibh nibh
            nulla tortor. Quis sit dictum pretium congue et blandit. Augue
            pretium quis ac adipiscing in. Sed in maecenas scelerisque
            vestibulum adipiscing non. Eu pellentesque sit molestie donec.
          </p>

          <h2 style={subheadingStyle}>
            Lorem ipsum dolor sit amet consectetur.
          </h2>
          <p style={paragraphStyle}>
            Lorem ipsum dolor sit amet consectetur. Id lorem eget magna risus
            sit. Nibh vulputate nullam proin risus magna nulla. Ultrices s
            uspendisse elementum nibh nibh nulla tortor. Quis sit dictum pretium
            congue et blandit. Augue pretium quis ac adipiscing in. Sed in
            maecenas scelerisque vestibulum adipiscing non. Eu pellentesque sit
            molestie donec. Lorem ipsum dolor sit amet consectetur. Id lorem
            eget magna risus sit. Nibh vulputate nullam proin risus magna nulla.
            Ultrices s uspendisse elementum nibh nibh nulla tortor. Quis sit
            dictum pretium congue et blandit. Augue pretium quis ac adipiscing
            in. Sed in maecenas scelerisque vestibulum adipiscing non. Eu
            pellentesque sit molestie donec.Lorem ipsum dolor sit amet
            consectetur. Id lorem eget magna risus sit. Nibh vulputate nullam
            proin risus magna nulla. Ultrices s uspendisse elementum nibh nibh
            nulla tortor. Quis sit dictum pretium congue et blandit. Augue
            pretium quis ac adipiscing in. Sed in maecenas scelerisque
            vestibulum adipiscing non. Eu pellentesque sit molestie donec.
          </p>
          <h2 style={subheadingStyle}>
            Lorem ipsum dolor sit amet consectetur.
          </h2>
          <p style={paragraphStyle}>
            Lorem ipsum dolor sit amet consectetur. Id lorem eget magna risus
            sit. Nibh vulputate nullam proin risus magna nulla. Ultrices s
            uspendisse elementum nibh nibh nulla tortor. Quis sit dictum pretium
            congue et blandit. Augue pretium quis ac adipiscing in. Sed in
            maecenas scelerisque vestibulum adipiscing non. Eu pellentesque sit
            molestie donec. Lorem ipsum dolor sit amet consectetur. Id lorem
            eget magna risus sit. Nibh vulputate nullam proin risus magna nulla.
            Ultrices s uspendisse elementum nibh nibh nulla tortor. Quis sit
            dictum pretium congue et blandit. Augue pretium quis ac adipiscing
            in. Sed in maecenas scelerisque vestibulum adipiscing non. Eu
            pellentesque sit molestie donec.Lorem ipsum dolor sit amet
            consectetur. Id lorem eget magna risus sit. Nibh vulputate nullam
            proin risus magna nulla. Ultrices s uspendisse elementum nibh nibh
            nulla tortor. Quis sit dictum pretium congue et blandit. Augue
            pretium quis ac adipiscing in. Sed in maecenas scelerisque
            vestibulum adipiscing non. Eu pellentesque sit molestie donec.
          </p>
          <h2 style={subheadingStyle}>
            Lorem ipsum dolor sit amet consectetur.
          </h2>
          <p style={paragraphStyle}>
            Lorem ipsum dolor sit amet consectetur. Id lorem eget magna risus
            sit. Nibh vulputate nullam proin risus magna nulla. Ultrices s
            uspendisse elementum nibh nibh nulla tortor. Quis sit dictum pretium
            congue et blandit. Augue pretium quis ac adipiscing in. Sed in
            maecenas scelerisque vestibulum adipiscing non. Eu pellentesque sit
            molestie donec. Lorem ipsum dolor sit amet consectetur. Id lorem
            eget magna risus sit. Nibh vulputate nullam proin risus magna nulla.
            Ultrices s uspendisse elementum nibh nibh nulla tortor. Quis sit
            dictum pretium congue et blandit. Augue pretium quis ac adipiscing
            in. Sed in maecenas scelerisque vestibulum adipiscing non. Eu
            pellentesque sit molestie donec.Lorem ipsum dolor sit amet
            consectetur. Id lorem eget magna risus sit. Nibh vulputate nullam
            proin risus magna nulla. Ultrices s uspendisse elementum nibh nibh
            nulla tortor. Quis sit dictum pretium congue et blandit. Augue
            pretium quis ac adipiscing in. Sed in maecenas scelerisque
            vestibulum adipiscing non. Eu pellentesque sit molestie donec.
          </p>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Cookies;
