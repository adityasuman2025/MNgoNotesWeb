import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import ConfirmDialog from "./ConfirmDialog";

import { logout } from "../utils";
import { PROJECT_NAME } from "../constants";

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
        await logout();

        await setIsConfirmDialogOpen(false);
        await setRedirectToLandingPage(true);
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
                // dialogDetails=""
                onClose={handleConfirmDialogClose}
                onConfirm={handleConfirmDialogConfirm}
            />

            <nav className="navbar navbar-expand-md navbar-dark fixed-top navBar">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <div id="navbar-brand" className="navbar-brand">
                            <img
                                className="navLogoImg"
                                alt="logo"
                                src={require("../img/logo.png")}
                            />
                            <span className="navTitle">{PROJECT_NAME}</span>
                        </div>
                    </div>
                    <div 
                        className="nav navbar-nav navbar-right"
                        onClick={handleLogoutClick}
                    >
                        <img
                            className="logOutImg"
                            alt="logOutImg"
                            src={require("../img/logout.png")}
                        />
                    </div>
                </div>
            </nav>
        </>
    )
}