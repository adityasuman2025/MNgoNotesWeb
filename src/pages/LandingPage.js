import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { getCookieValue } from "mngo-project-tools/utils";
import Loader from "mngo-project-tools/comps/Loader";
import { LOGGED_USER_TOKEN_COOKIE_NAME } from '../constants';

export default function LandingPage() {
    //hooks variables
    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const [redirectToUsersHome, setRedirectToUsersHome] = useState(false);

    //componentDidMount
    useEffect(() => {
        //checking if someone is logged or not
        if (getCookieValue(LOGGED_USER_TOKEN_COOKIE_NAME)) {
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
            <center>Welcome to MNgo Notes! Please wait...</center>
            <br />
            <Loader loading={true} />
        </>
    )
}