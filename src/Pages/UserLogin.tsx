import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import SpinnerContext from '../Context/SpinnerContext';
import auth0JS from 'auth0-js';
import { gql, useQuery } from '@apollo/client';

const GET_AGENCY_ID = gql`
  query getAgencyIdByEmail($email: String!) {
    getAgencyIdByEmail(email: $email)
  }
`;

const UserLogin: React.FC = () => {
  const { isLoading, showSpinner, hideSpinner } = useContext(SpinnerContext);
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { updateSession, user } = useContext(UserContext);

  const { data } = useQuery(GET_AGENCY_ID, {
    variables: {
      email: sessionStorage.getItem('loginuserwithemail')
    },
  });

  // console.log(data,"data123")
  const auth0 = new auth0JS.WebAuth({
    domain: process.env.REACT_APP_AUTH_DOMAIN || '',
    clientID: process.env.REACT_APP_AUTH_CLIENT_ID || '',
  });

  useEffect(() => {
    if (data) {
      showSpinner();

      const access_token = hash.split('=')[1].split('&')[0];
      auth0.client.userInfo(access_token, (err, user) => {
        if (err) {
          updateSession(null, null);
          console.log(err);

        } else {
          updateSession(access_token, user);
          const agencyId = data.getAgencyIdByEmail; 
  // Extract the agency ID
          navigate(`/agency-listing/${agencyId}`); // Navigate using the agency ID
        }

        setTimeout(() => {
          hideSpinner();
        }, 3000);
      });
    }
  }, [data]); // Run the effect whenever data changes

  return null; // Return null or your desired JSX here
};

export default UserLogin;
