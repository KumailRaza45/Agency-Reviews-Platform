import React, { useEffect, useState } from "react";
import LayoutWithHeaderLogoOnly from "../Components/Layouts/LayoutWithHeaderLogoOnly";
import Footer from "../Sections/Footer/Footer";

const Terms: React.FC = () => {
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
    fontSize: windowWidth > 768 ? "16px" : "14px", // Adjust font sizes
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
    lineHeight: "32px",
    letterSpacing: "0em",
    textAlign: "justify",
    paddingBottom: "22px",
    color: "#667085",
  };

  return (
    <div>
      <LayoutWithHeaderLogoOnly />
      <div className="xl:mx-auto grid grid-cols-[auto] items-center justify-between gap-1 sm:gap-0 max-w-[1216px] h-[100px] mx-[5%] ">

        <h1 style={headingStyle}>TERMS AND CONDITIONS</h1>

        <div className="content">
          <p style={paragraphStyle}>
            Agency Reviews IO (“Agency Reviews” or the “Company”) is a division of Growth Daily LLC, headquartered in Newport Beach, California, USA.  Agency Reviews owns and operates the website www.agencyreviewsio.com (“Website”)
          </p>

          <p style={paragraphStyle}>
            Use of the Website in any case, and other services or platforms provided by Agency Reviews or its affiliates, by any persons, advertising agencies or similar companies (“Agencies”), persons who submit reviews of Agencies, persons who submit potential leads to Agencies, and anyone else, is governed by the Terms and Conditions set forth below.
          </p>
          <p style={paragraphStyle}>
            1. All information and copy submitted to the Website and/or the Company must be true, accurate, and not misleading. <br />
            2. All information and copy submitted to the Agencies and/or the Company must be true, accurate, and not misleading.<br />
            3. All reviews and leads must include an accurate statement as (a) to any affiliation or experience the person submitting the review or lead has with the Agency (such as employee or client, former employee or client, etc.), and (b) any compensation or discount received or to be received for submitting the review or lead.<br />
            4. The Website, reviews and leads must not be used for any illegal or improper purpose.<br />
            5. Each person who submits information or copy to the Website, or otherwise utilizes the Company’s services, agrees to do so in compliance with all applicable laws, including those relating to privacy, intellectual property, taxes and fair business practices.<br />
            6. Each person who submits information or copy to the Website, the Company, or the Agencies represents and warrants that he or she is duly authorized to do so , he or she that owns or otherwise has the right to use and publish such information and copy, and that the use and publication of such information and copy does not violate the intellectual property or other rights of any other person or company.<br />
            7.  Each person who submits information or copy to the Website, the Company, or the Agencies hereby grants to the Company and its affiliates a non-exclusive, perpetual, royalty-free license to use and publish such information and copy on the Website and otherwise.<br />
            8. All trade names, trademarks, logos, service marks and other proprietary designations of the Company are owned by the Company and may not be copied or used without the prior written consent of the Company.<br />
            9. Unless specifically requested not to do so in writing, the Agencies and each person who submits a review or lead hereby authorizes the Company to utilize their contact information to offer other products and services provided by the Company and its affiliates.<br />
            10. The Company does not conduct any investigation as to any Agency or any person who submits any review or lead.  The Company does not verify the accuracy of the information and copy submitted to the Website or contained in any review or lead.  All persons utilizing the Website and the Company’s services should conduct such comprehensive investigation and due diligence as they and their advisors deem to be appropriate.  Use of the Website and the Company’s services is at the user’s own risk.  In other words, the Company is not responsible if an Agency hires a client or a client hires an Agency and it does not work out.<br />
            11. The Company provides the Website and other services on an AS IS basis, without express or implied warranty of any kind, all of which are expressly disclaimed.<br />
            12. Under no circumstances shall the Company or its affiliates, or their members or agents, be responsible for any lost profits, loss of goodwill, special damages, consequential damages or punitive damages.<br />
            13. The Company is not responsible for any negative reviews and will not refuse to publish a review merely because it is negative in nature.<br />
            14. The Company does not guarantee that any Agency will obtain any client(s) as a result of the Website or the Company’s services.  The Agencies and potential clients are to negotiate and determine the terms of any agreement between them, without involvement of the Company.<br />
            15. As to any review submitted, the Company reserves the right in its sole and absolute discretion to suspend the publication, to not publish, to edit, or to revise such review.<br />
            16. As to any lead submitted, the Company reserves the right in its sole and absolute discretion not to forward the lead to some or all of the Agencies.<br />
            17. The Company does not guarantee that the Website and the services it provides will not be interrupted or affected by causes beyond the reasonable control of the Company.<br />
            18. Company reserves the right to alter the algorithm of how each agency is listed / ranked at any time for any reason and makes no promise as to the amount of listing visits, views, or impressions, to any such agency<br />
            19. These Terms and Conditions may be modified from time to time, and the modified Terms and Conditions will be binding on all users of the Website and the Company’s services.   Notice of such modifications will not be provided, so that all users of the Website and the Company’s services are encouraged to check the website for updates on a regular basis.<br />
            20. Each person or company who uses the Website, and/or other services or platforms provided by the Company or its affiliates, Agencies, persons who submit reviews of Agencies, persons who submit potential leads to Agencies,  and anyone else, hereby agrees to indemnity, defend and hold harmless the Company, Growth Daily LLC, their affiliates and their respective members, managers, agents, employees and representatives from and against any claim, liability, demand, damages, and costs (including reasonable attorney’s fees) arising out of or relating to any violation or alleged violation of any of these Terms and Conditions.<br />
            21. These Terms and Conditions are governed by the laws of the State of California.  Any legal proceeding against the Company, Growth Daily LLC, their affiliates and/or their respective members, managers, agents, employees and representatives, or to interpret or enforce any of these Terms and Conditions, shall be brought and heard only in a State or Federal Court located in Orange County, California, and if commenced in any other jurisdiction shall be stayed pending transfer to a State or Federal Court located in Orange County, California.  No such action shall be filed unless and until the parties have first participated in a mediation in Orange County, California, under the JAMS rules, before a retired Judge on the JAMS panel.<br />
          </p>
        </div>
        <div className="w-full">

          <Footer />

        </div>
      </div>

    </div>
  );
};

export default Terms;
