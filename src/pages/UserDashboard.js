import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import LoadingAnimation from "../components/LoadingAnimation";
import NavBar from "../components/NavBar";

import { getDecryptedCookieValue } from '../utils';

function UserDashboard(props) {
    //hooks variables
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [displayLoader, setDisplayLoader] = useState(true);

    //componentDidMount
    useEffect(() => {
        //checking if someone is logged or not
        const mngoNotesLoggedUserId = getDecryptedCookieValue("mngoNotesLoggedUserId");
        if (!mngoNotesLoggedUserId) {
            //no one is logged
            //redirecting to landing page
            setRedirectToLandingPage(true);
        }

        setDisplayLoader(false);
    }, []);

    //function to render page content
    function renderPageContent() {
        return (
            <>
                <NavBar />
                <br /><br /><br />
            </>
        )
    }

    //component rendering
    return (
        <>
            {
                //redirecting to landing page
                redirectToLandingPage ? <Redirect to="/" /> : null
            }

            {
                displayLoader ?
                    <LoadingAnimation loading={displayLoader}/>
                :
                    renderPageContent()
            }
        </>
    )
}

export default UserDashboard;