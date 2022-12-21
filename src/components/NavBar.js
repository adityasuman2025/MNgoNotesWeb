import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { utils, ConfirmDialog } from "mngo-project-tools";

import { PROJECT_NAME, LOGGED_USER_TOKEN_COOKIE_NAME, COOKIE_EXPIRATION_TIME } from "../constants";

export default function NavBar() {
    //hooks variable
    const [redirectToLandingPage, setRedirectToLandingPage] = useState(false);

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    //function to handle when logout icon is clicked
    function handleLogoutClick() {
        setIsConfirmDialogOpen(true);
    }

    //function to close confirm dialog box
    function handleConfirmDialogClose() {
        setIsConfirmDialogOpen(false);
    }

    //funtion to confirm the confirm dialog //when yes is pressed
    async function handleConfirmDialogConfirm() {
        await utils.logout(LOGGED_USER_TOKEN_COOKIE_NAME, COOKIE_EXPIRATION_TIME);
        localStorage.clear();
        setRedirectToLandingPage(true);
    }

    //component rendering
    return (
        <>
            {
                //redirecting to landing page
                redirectToLandingPage ? <Redirect to="/" /> : null
            }

            <ConfirmDialog
                isDialogOpen={isConfirmDialogOpen}
                dialogText="Are you sure to logout?"
                onClose={handleConfirmDialogClose}
                onConfirm={handleConfirmDialogConfirm}
            />

            <div className="navBar">
                <div className="navBarBrand">
                    <img className="navLogoImg" alt="logo" src={require("../img/logo.png")} />
                    <span className="navTitle">{PROJECT_NAME}</span>
                </div>

                <img
                    className="logOutImg"
                    alt="logOutImg"
                    src={require("../img/logout.png")}
                    onClick={handleLogoutClick}
                />
            </div>
        </>
    )
}