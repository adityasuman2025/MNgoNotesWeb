import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";

import { getCookieValue } from '../utils';

export default function LandingPage() {
    //hooks variables
    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const [redirectToUsersHome, setRedirectToUsersHome] = useState(false);

    //componentDidMount
    useEffect(() => {
        //checking if someone is logged or not
        const mngoNotesLoggedUserToken = getCookieValue("mngoNotesLoggedUserToken");
        if (mngoNotesLoggedUserToken) {
            //redirect to user's home page
            setRedirectToUsersHome(true);
            return;
        } else {
            //redirect to login page
            setRedirectToLoginPage(true);
            return;
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
                redirectToUsersHome ? <Redirect to="/home" /> : null
            }

            <br /><br />
            <center>
                Welcome to MNgo Notes! Please wait...
            </center>
            <br />
            <LoadingAnimation loading={true} />
        </>
    )
}