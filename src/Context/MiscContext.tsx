import React, { createContext, Dispatch, SetStateAction, ReactNode, useState, useEffect } from 'react';

interface AgencyFilters {
    industryCheckboxes: string[] | any;
    Costselected: number | null | any;
    Rattingselected: number | null | any;
    HeadCountselected: number | null | any;
    ownerShipCheckboxes: string[] | any;
}

interface MiscContextType {
    agencyFilters?: AgencyFilters | any;
    setAgencyFilters: Dispatch<SetStateAction<any>>;
    selectedBaronHomePage?: string;
    setSelectedBaronHomePage: Dispatch<SetStateAction<string>>;
}

const MiscContext = createContext<MiscContextType>({
    agencyFilters: {
        industryCheckboxes: [],
        Costselected: null,
        Rattingselected: null,
        HeadCountselected: null,
        ownerShipCheckboxes: [],
    },
    setAgencyFilters: () => { },
    selectedBaronHomePage: "",
    setSelectedBaronHomePage: () => { }
});

interface MiscProviderProps {
    children: ReactNode;
}

export const MiscProvider: React.FC<MiscProviderProps> = ({ children }) => {
    const [agencyFilters, setAgencyFilters] = useState<AgencyFilters | any>({
        industryCheckboxes: [],
        Costselected: null,
        Rattingselected: null,
        HeadCountselected: null,
        ownerShipCheckboxes: [],

    });

    const [selectedBaronHomePage, setSelectedBaronHomePage] = useState<string>("");

    useEffect(() => {
        if (selectedBaronHomePage === "") {
            setSelectedBaronHomePage(localStorage.getItem("selectedBaronHomePage") || "agency")
        }
        else {
            localStorage.setItem("selectedBaronHomePage", `${selectedBaronHomePage}`)
        }
    }, [selectedBaronHomePage])


    return (
        <MiscContext.Provider value={{ agencyFilters, setAgencyFilters, selectedBaronHomePage, setSelectedBaronHomePage }}>
            {children}
        </MiscContext.Provider>
    );
};

export default MiscContext;
