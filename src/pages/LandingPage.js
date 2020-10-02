import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";

import { getDecryptedCookieValue } from '../utils';

function LandingPage() {
    //hooks variables
    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const [redirectToUserDashboard, setRedirectToUserDashboard] = useState(false);

    //componentDidMount
    useEffect(() => {
        //checking if someone is logged or not
        const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
        if (mngoNotesLoggedUserId) {
            //redirect to user's dashboard
            console.log("mngoNotesLoggedUserId", mngoNotesLoggedUserId);
            setRedirectToUserDashboard(true);
        } else {
            //redirect to login page
            setRedirectToLoginPage(true);
        }
    }, []);

    //component rendering
    return (
        <>
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
        </>
    )
}

export default LandingPage;