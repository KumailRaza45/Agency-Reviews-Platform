export interface AgencyDetailsInterface {
  totalLeads: number;
  totalVerifiedReviews: number;
  totalReviews: number;
  averageRating: number;
  totalValueRating: number;
  totalDomainRating: number;
  totalRecommendRating: number;
  totalCommunicationRating: number;
  totalViews: number;
  totalVisits: number;
  total_review_rating: number;
  agency: AgencyDetailsType;
}
export interface AgencyDetailsType {
  id: number;
  name: string;
  bio: string;
  address2: string;
  retainer_size: number;
  logo_url: string;
  headquarter_address: string;
  logo: string;
  tagline: string;
  employees: number;
  status: string;
  is_verified: boolean;
  total_ratings: number;
  total_views: number;
  total_visits: number;
  updated_at: string;
  services: Services[];
  industries: Industries[];
  portfolio: Portfolio[];
  agencyReview: Reviews[];
  ResponseDate: Date;
  ResponseMessage: string;
  website: string;
}

export interface AgencyListing {
  id: number;
  name: string;
  bio: string;
  address2: string;
  retainer_size: number;
  logo_url: string;
  headquarter_address: string;
  logo: string;
  tagline: string;
  employees: number;
  status: string;
  is_verified: boolean;
  total_ratings: number;
  total_views: number;
  total_visits: number;
  updated_at: string;
  services: Services[];
  industries: Industries[];
  portfolio: Portfolio[];
  agencyReview: Reviews[];
  ResponseDate: Date;
  ResponseMessage: string;
  website: string;
}
export interface ReviewsResponse {
  id: number;
  comment: string;
  status: string;
  agency_id: number;
  user_id: string;
  created_by: string;
  updated_by: string;
  created_on: Date;
  updated_on: Date;
  review_id: number;
}
export interface Services {
  service: {
    id: number;
    name: string;
  };
}
export interface Industries {
  id: number;
  name: string;
}
export interface Portfolio {
  title: string;
  image_url_1: string;
  image_url_2: string;
}
export interface Reviews {
  id: number;
  created_at: string;
  pros: string;
  status: string;
  cons: string;
  location: string;
  rating: number;
  value_rating: number;
  communication_rating: number;
  domain_rating: number;
  recommend_rating: number;
  ReviewsResponse: ReviewsResponse[];
}

export interface ServicesFilter {
  selectedCheckboxes: [];
  handleCheckboxChange: () => void;
}

export interface SortingProps {
  sort: boolean;
  setServices: (value: boolean) => void;
  setSort: (value: boolean) => void;
  setMoreFilter: (value: boolean) => void;
  handleSort: (value: string) => void;
}
export interface ForAgencyProps {
  ForAgency: boolean;
  setForAgency: (value: boolean) => void;
}

export interface LoadingProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface Option {
  value: string;
  label: string;
}
export interface ToastProps {
  ShowToast: (type: string, Message: string) => {};
}
export interface DynamicToastProps {
  type: string;
  Message: string;
}

export interface LoadingAndTastProps extends LoadingProps, ToastProps { }

export interface FormData {
  companyName: string;
  companyWebsite: string;
  numEmployees: string;
  tagline: string;
  bio: string;
  logo_url: string;
  salesEmail: string;
  typicalRetainerSize: string;
  address: string;
  examplesOfWork: {
    title: string;
    image_url_1: File | null;
    image_url_2: File | null;
  }[];
  email: string;
  password: string;
  confirmPassword: string;
  selectedServices: number[];
  selectedIndustries: string[];
  selectedMinorities: string[];
}

export interface UpdatedFormData {
  companyName: string;
  companyWebsite: string;
  numEmployees: any;
  tagline: string;
  bio: string;
  logo_url: string;
  salesEmail: string;
  typicalRetainerSize: any;
  address: string;
  examplesOfWork: {
    title: string;
    image_url_1: File | null;
    image_url_2: File | null;
  }[];
  email: string;
  password: string;
  is_verified: boolean;
  status: string;
  confirmPassword: string;
  selectedServices: number[];
  selectedIndustries: string[];
  selectedMinorities: string[];
}
