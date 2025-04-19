import React, { createContext, Dispatch, SetStateAction, ReactNode, useState, useEffect } from 'react';
import ReactGA from 'react-ga';

interface GoogleAnalyticsContextType {

    states: string,
    setStates: Dispatch<SetStateAction<string>>,
    sendGoogleAnalytics: (data) => void;
}

const GoogleAnalyticsContext = createContext<GoogleAnalyticsContextType>({
    states: "",
    setStates: () => { },
    sendGoogleAnalytics: (data) => { },
});

interface GoogleAnalyticsProviderProps {
    children: ReactNode;
}

export const GoogleAnalyticsProvider: React.FC<GoogleAnalyticsProviderProps> = ({ children }) => {


    const [states, setStates] = useState<string>("");


    const sendGoogleAnalytics = (data) => {

        if (window.location.hostname !== "www.agencyreviews.io") {
            return;
        }

        const { capturedAction } = data
        if (capturedAction === "submit_lead") {
            ReactGA.event({
                category: 'Lead-Form',
                action: 'Submit',
                label: 'Lead-Form-Submitted'
            });
        }
        else if (capturedAction === "submit_anonymous_review") {
            // For "Submit Anonymous Review"
            ReactGA.event({
                category: 'Anonymous-Review',
                action: 'Submit-Anonymous-Review',
                label: 'Anonymous-Review-Submitted'
            });
        }
        else if (capturedAction === "submit_review") {
            // For "Submit" on Review Button
            ReactGA.event({
                category: 'Reviews',
                action: 'Submit-Review',
                label: 'Review-Button-Submitted'
            });
        }
        else if (capturedAction === "home_page") {
            // For "Submit" on Review Button
            ReactGA.event({
                category: 'Home-Page-View',
                action: 'Home-Page-View',
                label: 'Home-Page-View'
            });
        }
    };

    useEffect(() => {
        if (window.location.hostname === "www.agencyreviews.io") {
            ReactGA.initialize('AW-11111937234');
            ReactGA.pageview(window.location.pathname);
        }
    }, [])

    return (
        <GoogleAnalyticsContext.Provider value={{ states, setStates, sendGoogleAnalytics }}>
            {children}
        </GoogleAnalyticsContext.Provider>
    );
};

export default GoogleAnalyticsContext;
