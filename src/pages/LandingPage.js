import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";

import { getDecryptedCookieValue } from '../utils';

export default function LandingPage() {
    //hooks variables
    const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);
    const [redirectToUsersHome, setRedirectToUsersHome] = useState(false);

    //componentDidMount
    useEffect(() => {
        //checking if someone is logged or not
        const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
        if (mngoNotesLoggedUserId) {
            //redirect to user's home page
            console.log("mngoNotesLoggedUserId", mngoNotesLoggedUserId);
            setRedirectToUsersHome(true);
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
                redirectToUsersHome ? <Redirect to="/home" /> : null
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