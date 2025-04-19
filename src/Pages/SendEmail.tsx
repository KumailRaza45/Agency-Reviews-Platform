import React from "react";
import { useContext, useEffect, useState } from "react";
import SpinnerContext from "../Context/SpinnerContext";
import ToastContext from "../Context/ToastContext";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { gql, useMutation } from "@apollo/client";
export const SEND_EMAIL = gql`
  mutation ContactAllAgencies($subject: String!, $details: String!) {
    contactAllAgencies(data: { subject: $subject, details: $details }) {
      status
    }
  }
`;


const Font = Quill.import("formats/font");
const font = Quill.import('attributors/style/font');


Font.whitelist = ['Ubuntu', 'Raleway', 'Roboto', 'Inter', "Montserrat", "Lato", "Rubik"];
font.whitelist = ['asap', 'podkova'];
Quill.register(Font, true);


const toolbar = [
  [{ font: Font.whitelist }, { header: [1, 2, 3, false] }],
  ["bold", "italic", "link", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
];


const SendEmail = () => {
  const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);
  const { showToast, hideToast } = useContext(ToastContext);
  const [isSubjectValid, setIsSubjectValid] = useState(true);
  const [subject, setSubject] = useState("");
  const [value, setValue] = useState("");
  const [sendEmail, { data }] = useMutation(SEND_EMAIL);

  const handleSendEmail = async () => {

    if (!subject || !value.replace(/<[^>]+>/g, '')) {
      showToast("Please fill all the fields", "error");
      setTimeout(() => {
        hideToast();
      }, 3000);
      return;
    }
    try {
      showSpinner();
      const { data } = await sendEmail({
        variables: {
          subject,
          details: value,
        },
      });

      showToast(`Email Sent Successfully.`, "success");
      setTimeout(() => {
        hideToast();
      }, 3000);
      setSubject("");
      setValue("");
      hideSpinner();
    } catch (error) {
      alert("Something went wrong in sending email!");
      hideSpinner();
    }
  };




  return (
    <>
      {isLoading ? (
        showSpinner()
      ) : (
        <div className="w-full max-w-[1216px] mx-2 sm:mx-auto flex flex-col" style={{ padding: "32px", gap: "24px" }}>
          <h4 className="text-[24px] font-montserrat font-semibold min-w-[400px] ">
            Send email to verified agencies
          </h4>
          <hr className="text-grayBorder" />
          <input
            type="text"
            id="website"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "14px",
              border: `1px solid ${isSubjectValid ? "#D0D5DD" : "#F04438"}`,
              outline: "none",
            }}
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {!isSubjectValid && (
            <p className="text-xs mt-1" style={{ color: "#F04438" }}>
              Invalid website URL
            </p>
          )}
          <div className="w-full h-[50vh]">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              modules={{ toolbar }}
              bounds={".app"}
              style={{
                height: "43vh",
                borderRadius: "8px",
              }}
            />
          </div>
          <div className="w-full flex justify-center md:justify-end">
            <button
              className="w-[144px] bg-[#329BFA] px-[16px] py-[10px] rounded-[8px] text-[#FFFFFF] flex items-center justify-center text-[14px] font-montserrat font-semibold"
              //   onClick={() => setStep((state) => state + 1)}
              //   disabled={isNextDisabled}
              //   style={{ opacity: isNextDisabled ? 0.5 : 1 }}
              onClick={handleSendEmail}
            >
              Send email
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SendEmail;
