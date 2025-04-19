import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutWithHeaderAndFooter from "./Components/Layouts/LayoutWithHeaderAndFooter";
import LayoutWithOnlyHeader from "./Components/Layouts/LayoutWithOnlyHeader";
import LayoutWithoutHeaderAndFooter from "./Components/Layouts/LayoutWithoutHeaderAndFooter";
import LayoutWithHeaderLogoOnly from "./Components/Layouts/LayoutWithHeaderLogoOnly";
import SuccessToast from "./Components/Toast/SuccessToast";
import WarningToast from "./Components/Toast/WarningToast";
import SpinnerContext from "./Context/SpinnerContext";
import ToastContext from "./Context/ToastContext";
import Loading from "./Loading";
import AgencyList from "./Pages/AgencyList";
import AgencyListing from "./Pages/AgencyListing";
import AgencyLogin from "./Pages/AgencyLogin";
import CreateAgency from "./Pages/CreateAgency";
import UserReview from "./Pages/UserReview";
import ResetPassword from "./Sections/AgencyLogin/ResetPassword";
import UserLogin from "./Pages/UserLogin";
import UserLogout from "./Pages/UserLogout";
import PrivateRoute from "./Components/PrivateRoute";
import Blogs from "./Pages/Blogs";
import BlogView from "./Pages/BlogView/BlogEditView";
import BlogContentView from "./Pages/BlogView/BlogContentView";

import EditAgency from "./Pages/Edit_Agency";

import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import Cookies from "./Pages/Cookies";
import Blog from "./Pages/BlogView/Blog";
import BlogEditView from "./Pages/BlogView/BlogEditView";
import MiscContext from "./Context/MiscContext";
import { MixpanelProvider } from 'react-mixpanel-browser';
import SendEmail from "./Pages/SendEmail";
import { useMediaQuery } from "@mui/material";
import AgencyListMobileView from "./Pages/AgencyListMobileView";
import Sitemap from "./Utilities/Sitemap";
import WriteAReview from "./Pages/WriteAReview";
import AgencyDetails from "./Pages/AgencyDetails";
import SidebarLayout from "./Components/Layouts/SidebarLayout";
import WarmLeads from "./Sections/AgencyListing/WarmLeads";
import HotLeads from "./Pages/HotLeads";
import CustomizeBanner from "./Pages/CustomizeBanner";
import Trainings from "./Pages/Trainings";
import ImportReviews from "./Pages/ImportReviews";
import ContactUs from "./Pages/ContactUs";
import WidgetComponent from "./Pages/WidgetComponent";
import AgencyListingMobile from "./Pages/AgencyListingMobile";


const App: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:786px)');
  const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);
  const { toastMessage, toastType, showToast, hideToast } = useContext(ToastContext);

  const { selectedBaronHomePage, setSelectedBaronHomePage } = useContext(MiscContext);
  const [isComponentInIFrame, setIsComponentInIFrame] = useState(false)
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  // [OPTIONAL] Set your Mixpanel token. It is up to you how this token is obtained (e.g. via env
  // var). If `token` is `undefined` or otherwise falsey then `useMixpanel()` will return
  // `undefined` which can be useful for environments where Mixpanel integration is not desired.
  const MIXPANEL_TOKEN = '794cb1229d9dbe0d974080931747cc23';

  // [OPTIONAL] Custom options to pass to `mixpanel.init()`.
  const MIXPANEL_CONFIG = {
    track_pageview: true, // Set to `false` by default
  };


  useEffect(() => {
    if (window.self !== window.top) {
      // Component is inside an iframe
      setIsComponentInIFrame(true)
    } else {
      // Component is not in an iframe
      setIsComponentInIFrame(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <MixpanelProvider config={MIXPANEL_CONFIG} token={MIXPANEL_TOKEN}>
        <BrowserRouter>
          {isLoading && <Loading />}
          {toastMessage &&
            (toastType === "success" ? (
              <SuccessToast toastMessage={toastMessage} />
            ) : toastType === "warn" ? (
              <WarningToast toastMessage={toastMessage} />
            ) : (
              <WarningToast toastMessage={toastMessage} />
            ))}

          <Routes>
            {/* Pages with both Header and Footer  */}
            <Route path="/sitemap_index.xml" element={<Sitemap />}></Route>
            <Route
              path="/agency-listing/:id/*"
              element={
                screenWidth < 700
                  ?
                  <AgencyListingMobile />
                  :
                  <PrivateRoute>
                    <SidebarLayout>
                      <Routes>
                        <Route path="/" element={<AgencyListing />}></Route>
                        <Route path="/warn-leads" element={<WarmLeads pageContent />} />
                        <Route path="/hot-leads" element={<HotLeads />} />
                        <Route path="/edit-listing" element={<EditAgency />} />
                        <Route path="/customize-banner" element={<CustomizeBanner />} />
                        <Route path="/trainings" element={<Trainings />} />
                        <Route path="/import-reviews" element={<ImportReviews />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                      </Routes>
                    </SidebarLayout>
                  </PrivateRoute>
              }
            ></Route>


            <Route path="/" element={isMobile ? <LayoutWithHeaderLogoOnly /> : <LayoutWithHeaderAndFooter />}>
              <Route path="/" element={isMobile ? <AgencyListMobileView /> : <AgencyList />}></Route>
              <Route path="/listing" element={<AgencyList />}></Route>
              <Route path="/blogs" element={<Blogs />}></Route>
              <Route
                path="/AgencyDetails/:id/:slug"
                element={<AgencyDetails />}
              ></Route>
              <Route path="/blog/:id/:slug" element={<BlogContentView />}></Route>
              <Route path="/review/:id" element={<UserReview />}></Route>
              <Route path="/create-agency" element={<CreateAgency />}></Route>
              <Route path="/2e4ab6f7-1357-4c8e-bd7a-31dc587a1f94" element={<CreateAgency />}></Route>
              <Route path="/edit-agency/:id" element={<EditAgency />}></Route>

              <Route path="/write-a-review" element={<WriteAReview />} />
            </Route>
            <Route path="/terms" element={<Terms />} />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* Pages with only Header */}
            <Route path="/" element={<LayoutWithOnlyHeader />}>
              <Route path="/create-agency" element={<CreateAgency />}></Route>

            </Route>
            <Route path="/AgencyDetails/:id/:slug" element={<AgencyDetails />} />

            {/* Pages without Header and Footer */}
            <Route path="/" element={<LayoutWithoutHeaderAndFooter />}>
              <Route path="/agency-login" element={<AgencyLogin />}></Route>
              <Route path="/reset-password" element={<ResetPassword />}></Route>
            </Route>

            {/* Auth */}
            <Route path="/user-login" element={<UserLogin />}></Route>
            <Route path="/user-logout" element={<UserLogout />}></Route>
            <Route path="/widget-component" element={<WidgetComponent />}></Route>

            <Route path="/blogs" element={<Blogs />}></Route>
            <Route path="/blog/:id" element={<BlogContentView />}></Route>
            <Route path="/blog/edit/:id" element={<BlogEditView />}></Route>
            {
              isComponentInIFrame &&
              <Route path="/send-email" element={<SendEmail />} />
            }

          </Routes>



        </BrowserRouter>
      </MixpanelProvider>
    </>
  );
};

export default App;
