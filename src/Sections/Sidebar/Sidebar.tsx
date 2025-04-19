import { useLocation, useNavigate } from "react-router-dom";
import InActiveContactUsIcon from "../../assets/Icons/contactUsIcon.svg";
import ActiveContactUsIcon from "../../assets/Icons/contactUsIconActive.svg";
import InActiveCustomizeBannerIcon from "../../assets/Icons/customizeBannerIcon.svg";
import ActiveCustomizeBannerIcon from "../../assets/Icons/customizeBannerIconActive.svg";
import InActiveEditIcon from "../../assets/Icons/editIcon.svg";
import ActiveEditIcon from "../../assets/Icons/editIconActive.svg";
import InActiveHomeIcon from "../../assets/Icons/homeIcon.svg";
import ActiveHomeIcon from "../../assets/Icons/homeIconActive.svg";
import InActiveImportReviewsIcon from "../../assets/Icons/importReviewsIcon.svg";
import ActiveImportReviewsIcon from "../../assets/Icons/importReviewsIconActive.svg";
import logoutIcon from "../../assets/Icons/log-out.svg";
import InActiveTrainingsIcon from "../../assets/Icons/trainingsIcon.svg";
import ActiveTrainingsIcon from "../../assets/Icons/trainingsIconActive.svg";
import InActiveWarmsLeadIcon from "../../assets/Icons/warmsLeadIcon.svg";
import ActiveWarmsLeadIcon from "../../assets/Icons/warmsLeadIconActive.svg";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import ToastContext from "../../Context/ToastContext";
const Sidebar = () => {


  const { token, user, updateSession } = useContext(UserContext);
  const { showToast, hideToast } = useContext(ToastContext);

  const routes = [
    {
      title: "Home",
      route: "",
      activeIcon: ActiveHomeIcon,
      inActiveicon: InActiveHomeIcon,
      id: 1,
    },
    {
      title: "Warm Leads",
      route: "warn-leads",
      activeIcon: ActiveWarmsLeadIcon,
      inActiveicon: InActiveWarmsLeadIcon,
      id: 2,
    },
    {
      title: "Hot Leads",
      route: "hot-leads",
      activeIcon: ActiveWarmsLeadIcon,
      inActiveicon: InActiveWarmsLeadIcon,
      id: 3,
    },
    {
      title: "Edit Listing",
      route: "edit-listing",
      activeIcon: ActiveEditIcon,
      inActiveicon: InActiveEditIcon,
      id: 4,
    },
    {
      title: "Customize Banner",
      route: "customize-banner",
      activeIcon: ActiveCustomizeBannerIcon,
      inActiveicon: InActiveCustomizeBannerIcon,
      id: 5,
    },
    // {
    //   title: "Trainings",
    //   route: "trainings",
    //   activeIcon: ActiveTrainingsIcon,
    //   inActiveicon: InActiveTrainingsIcon,
    //   id: 6,
    // },
    // {
    //   title: "Import Reviews",
    //   route: "import-reviews",
    //   activeIcon: ActiveImportReviewsIcon,
    //   inActiveicon: InActiveImportReviewsIcon,
    //   id: 7,
    // },
    {
      title: "Contact Us",
      route: "contact-us",
      activeIcon: ActiveContactUsIcon,
      inActiveicon: InActiveContactUsIcon,
      id: 8,
    },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = location.pathname.split("/")[3] || ''

  const onRouteClick = (item) => {
    navigate(item.route);
  };
  return (
    <div style={{ position: "sticky", top: '20px' }} className="bg-[#FFF] sticky top-5 border-r-2 border-[#F2F4F7] left-[0px] flex flex-col w-[258px] justify-between h-[100%]  py-[32px] px-[16px]  ">
      <div className="flex  flex-col bg-[#FFF] gap-[16px] ">
        {routes?.map((item) => (
          <div
            onClick={() => onRouteClick(item)}
            className={`flex w-[100%] px-[12px] gap-[12px] rounded-[6px] cursor-pointer ${activeRoute === item.route ? "bg-[#E9EFFF]" : "bg-[#FFF]"
              } py-[8px]`}
            key={item.route}
          >
            <img
              width={24}
              height={24}
              src={
                activeRoute === item.route ? item.activeIcon : item.inActiveicon
              }
              alt={item.title}
            />
            <p
              className={`font-inter font-semibold text-[16px] ${activeRoute === item.route ? "text-[#3364F7] " : "text-[#475467]"
                } leading-[24px]  `}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>
      <div
        style={{ position: "sticky", bottom: "22px" }}
        className={`flex w-[100%] px-[12px] gap-[12px] rounded-[6px] cursor-pointer py-[8px]`}
        onClick={() => {
          showToast("You have been successfully log out", "success");
          setTimeout(() => {
            hideToast();
          }, 1000);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.clear();
          updateSession(null, null);
          navigate("/");
        }}
      >
        <img width={24} height={24} src={logoutIcon} alt={"logoutIcon"} />
        <p
          className={`font-inter font-semibold text-[16px] text-[#475467] leading-[24px]  `}
        >
          Log out
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
