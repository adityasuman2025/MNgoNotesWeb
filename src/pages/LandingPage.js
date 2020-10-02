import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";

import { getDecryptedCookieValue } from '../utils';

function LandingPage(props) {
    //hooks variables
    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const [redirectToUserDashboard, setRedirectToUserDashboard] = useState(false);

    //componentDidMount
    useEffect(() => {
        const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
        if (mngoNotesLoggedUserId) {
            //redirect to user's dashboard
            console.log(mngoNotesLoggedUserId);
            setRedirectToUserDashboard(true);
        } else {
            //redirect to login page
            setRedirectToLoginPage(true);
        }
    }, []);

    //component rendering
    return (
        <div>
            {
                //redirecting to admin login page
                redirectToLoginPage ? <Redirect to="/login" /> : null
            }

            {
                //redirecting to admin login page
                redirectToUserDashboard ? <Redirect to="/dashboard" /> : null
            }

            <br /><br />
            <center>
                Welcome to MNgo Notes! Please wait...
            </center>
            <br />
            <LoadingAnimation loading={true}/>
        </div>
    )
}

export default LandingPage;