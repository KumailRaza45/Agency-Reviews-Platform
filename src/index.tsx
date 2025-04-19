import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { LoadScript } from "@react-google-maps/api";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PaginationProvider } from "./Context/PaginationContext";
import { SpinnerProvider } from "./Context/SpinnerContext";
import { ToastProvider } from "./Context/ToastContext";
import { UserProvider } from "./Context/UserContext";
import "./index.css";
import { MiscProvider } from "./Context/MiscContext";
import TagManager from 'react-gtm-module';
import { GoogleAnalyticsProvider } from "./Context/GoogleAnalyticsContext";
import { HelmetProvider } from 'react-helmet-async';
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new ApolloClient({
  uri:
    process.env.REACT_APP_BASE_URL ||
    "https://agencyreviews-api-dev.powerhouse.so/graphql", //'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
});


const tagManagerArgs = {
  gtmId: 'GTM-WLSTG9DC'
}

TagManager.initialize(tagManagerArgs)

const googleMapsApiKey = "AIzaSyA1Efom7xZ9wBPtQO4505DLguEcQ3i20xs";

const domain = "dev-2unca0cad4nbvc7u.us.auth0.com";
const clientId = "UJXi3400AIeQfte2MlfwIdpw6ppImyqh";


root.render(
  <React.StrictMode>
    <HelmetProvider>
    <GoogleAnalyticsProvider>
      <PaginationProvider>
        {/* <MiscProvider> */}
        <SpinnerProvider>
          <ToastProvider>
            <UserProvider>
              <Auth0Provider
                domain={domain}
                clientId={clientId}
                authorizationParams={{
                  redirect_uri: window.location.origin,
                }}
              >
                <ApolloProvider client={client}>
                  <LoadScript
                    libraries={["places"]}
                    googleMapsApiKey={googleMapsApiKey}
                  >
                    <App />
                  </LoadScript>
                </ApolloProvider>
              </Auth0Provider>
            </UserProvider>
          </ToastProvider>
        </SpinnerProvider>

        {/* </MiscProvider> */}
      </PaginationProvider>
    </GoogleAnalyticsProvider>
    </HelmetProvider>
  </React.StrictMode>
);