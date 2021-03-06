import React, { useState } from 'react';
import cx from "classnames";

import CircularButton from "../components/CircularButton";
import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

import { registerNewUser } from "../apis";
import { validateUsername, validateEmail, validateContactNo } from "../utils";
import { PROJECT_NAME } from '../constants';

export default function RegisterPage(props) {
    //hooks variables
    const [displayLoader, setDisplayLoader] = useState(false);

    const [registerSuccess, setRegisterSuccess] = useState(false);

    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredName, setEnteredName] = useState("");
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [enteredConfPassword, setEnteredConfPassword] = useState("");
    const [enteredPassCode, setEnteredPassCode] = useState("");
    const [enteredConfPassCode, setEnteredConfPassCode] = useState("");

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState("");
    const [snackBarType, setSnackBarType] = useState("success");

    //function to handle when login is clicked
    function handleLoginClick() {
        props.history.push("/login");
    }

    //function to handle when register btn is clicked
    async function handleRegisterClick(e) {
        e.preventDefault();

        //hanling stuffs if login is not already clicked
        if (!displayLoader) {
            setDisplayLoader(true);

            //verifying the entered data
            const username = enteredUsername.trim();
            const name = enteredName.trim();
            const email = enteredEmail.trim();

            const password = enteredPassword.trim();
            const confPassword = enteredConfPassword.trim();

            var passCode = enteredPassCode.trim();
            var confPassCode = enteredConfPassCode.trim();
            if (username !== "" && name != "" && email !== "" && password !== "" && confPassword !== "" && passCode !== "" && confPassCode !== "") {
                if (!validateUsername(username)) {
                    setDisplayLoader(false);
                    makeSnackBar("Username cannot contain symbol and spaces");
                    return;
                }

                if (!validateEmail(email)) {
                    setDisplayLoader(false);
                    makeSnackBar("Invalid email id format");
                    return;
                }

                if (password !== confPassword) {
                    setDisplayLoader(false);
                    makeSnackBar("Password do not match");
                    return;
                }

                if (passCode !== confPassCode) {
                    setDisplayLoader(false);
                    makeSnackBar("Pass code do not match");
                    return;
                }

                if (passCode.length !== 4) {
                    setDisplayLoader(false);
                    makeSnackBar("Pass code must be 4 digits long");
                    return;
                }

                if (!validateContactNo(passCode)) {
                    setDisplayLoader(false);
                    makeSnackBar("Pass code must be numeric");
                    return;
                }

                //sending rqst to api
                const response = await registerNewUser(username, name, email, password, passCode);
                if (response.statusCode === 200) {
                    makeSnackBar("Sucessfully registered. Please Login to continue", "success");
                    setRegisterSuccess(true);
                } else {
                    makeSnackBar(response.msg);
                }
            } else {
                makeSnackBar("Please fill all details");
            }
        }

        setDisplayLoader(false);
    }

    //function to make a snack-bar
    function makeSnackBar(msg, type) {
        setSnackBarMsg(msg);
        setSnackBarType(type);

        setSnackBarVisible(true);
    }

    //function to close snack-bar
    function handleSnackBarClose() {
        setSnackBarVisible(false);
    }

    //function to render registration form
    function renderRegistrationForm() {
        return (
            <>
                <input
                    className="inputBox"
                    type="text"
                    placeholder="Username"
                    value={enteredUsername}
                    autoFocus
                    onChange={(e) => setEnteredUsername(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="text"
                    placeholder="Name"
                    value={enteredName}
                    autoFocus
                    onChange={(e) => setEnteredName(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="text"
                    placeholder="Email"
                    value={enteredEmail}
                    onChange={(e) => setEnteredEmail(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="password"
                    placeholder="Password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="password"
                    placeholder="Confirm Password"
                    value={enteredConfPassword}
                    onChange={(e) => setEnteredConfPassword(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="password"
                    placeholder="Pass Code"
                    maxLength={4}
                    value={enteredPassCode}
                    onChange={(e) => setEnteredPassCode(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="password"
                    placeholder="Confirm Pass Code"
                    maxLength={4}
                    value={enteredConfPassCode}
                    onChange={(e) => setEnteredConfPassCode(e.target.value)}
                />

                <CircularButton >
                    <span className="buttonText">Register</span>
                </CircularButton>
                <br />

                <LoadingAnimation loading={displayLoader} />
            </>
        )
    }

    //component rendering
    return (
        <>
            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={handleSnackBarClose}
            />

            <form
                className={cx("loginPageContent", "smallTopMargin")}
                onSubmit={handleRegisterClick}
            >
                <img
                    alt="logo img"
                    className="logoIcon"
                    src={require("../img/logo.png")}
                />
                <div className="logoTitle">
                    {PROJECT_NAME}
                </div>

                {
                    !registerSuccess ?
                        renderRegistrationForm()
                        :
                        <div className="successRegistrationText">
                            {"Successfully registered. Please "}
                            <span
                                className="signupButton"
                                onClick={handleLoginClick}
                            >
                                Login
                            </span>
                            {" to continue"}
                        </div>
                }
            </form>
        </>
    )
}