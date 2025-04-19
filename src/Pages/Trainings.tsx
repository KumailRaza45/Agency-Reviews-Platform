import dashedImg from "../assets/Icons/dashedFrame.svg";
function Trainings() {
  return (
    <div
      className=" flex flex-col w-[100%] h-[100%]">
      <p
        style={{ fontFamily: "Montserrat" }}
        className="font-semibold text-[24px] my-[32px] leading-[30px] text-[#344054]"
      >
        Trainings
      </p>
      <div
        className="px-[52px] relative"
      >

        <iframe
          src="https://www.google.com"
          title="trainings"
          className="w-[100%] h-[800px]"
        />

        {/* <img style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
        }} src={dashedImg} alt="" />
        <p
          style={{ fontFamily: "Montserrat" }}
          className="text-[24px] text-center mt-[140px]  leading-[30px] text-[#344054]"
        >
          Dev notes: This link need to be integrated within this screen
        </p>
        <p style={{ fontFamily: "Montserrat" }} className="font-semibold  text-center mt-[20px] text-[24px] leading-[30px] text-[#329BFA]">
          https://martycapital.notion.site/AR-Trainings-3dbb10e2d8c74e11a3ce1dac444e636c
        </p> */}
      </div>
    </div>
  );
}

export default Trainings;
