import React, { useState } from 'react';
import cx from "classnames";

import CircularButton from "../components/CircularButton";
import LoadingAnimation from "../components/LoadingAnimation";
import SnackBar from "../components/SnackBar";

// import { VerifyLogin } from "../apis";
import { validateUsername, validateEmail, validateContactNo, makeEncryptedCookie } from "../utils";
import { PROJECT_NAME } from '../constants';

export default function RegisterPage(props) {
    //hooks variables
    const [displayLoader, setDisplayLoader] = useState(false);

    const [enteredUsername, setEnteredUsername] = useState("");
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
            const username      = enteredUsername.trim();
            const email         = enteredEmail.trim();
            
            const password      = enteredPassword.trim();
            const confPassword  = enteredConfPassword.trim();
      
            var passCode        = enteredPassCode.trim();
            var confPassCode    = enteredConfPassCode.trim();
            if (username !== "" && email !== "" && password !== "" && confPassword !== "" && passCode !== "" && confPassCode !== "") {
                if (!validateUsername(username)) {
                    setDisplayLoader(false);
                    makeSnackBar("Username cannot contain symbol and spaces", "error");
                    return;
                }
        
                if (!validateEmail(email)) {
                    setDisplayLoader(false);
                    makeSnackBar("Invalid email id format", "error");
                    return;
                }

                if (password !== confPassword) {
                    setDisplayLoader(false);
                    makeSnackBar("Password do not match", "error");
                    return;
                }

                if (passCode !== confPassCode) {
                    setDisplayLoader(false);
                    makeSnackBar("Pass code do not match", "error");
                    return;
                }
            
                if (passCode.length !== 4) {
                    setDisplayLoader(false);
                    makeSnackBar("Pass code must be 4 digits long", "error");
                    return;
                }

                if (!validateContactNo(passCode)) {
                    setDisplayLoader(false);
                    makeSnackBar("Pass code must be numeric", "error");
                    return;
                }

                //sending rqst to api
                // try {
                //     const response = parseInt(await VerifyLogin(username,  password));
                //     if (response === -1) {
                //         makeSnackBar("Something went wrong", "error");
                //     } else if ( response === 0 ) {
                //         makeSnackBar("Login credentials is not correct", "error");
                //     } else {
                //         //setting cookie and redirecting to user's dashboard
                        
                //     }
                // } catch {
                //     makeSnackBar("Something went wrong", "error");
                // }
            } else {
                makeSnackBar("Please fill all details", "error");
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

    //component rendering
    return (
        <>
            <form 
                className={cx("loginPageContent", "smallTopMargin")}
                onSubmit={handleRegisterClick} 
            >
                <img
                    className="logoIcon"
                    src={require("../img/logo.png")}
                />
                <div className="logoTitle">
                    {PROJECT_NAME}
                </div>
                {/* <br /> */}

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
                    maxLength={ 4 }
                    // inputmode="numeric"
                    value={enteredPassCode}
                    onChange={(e) => setEnteredPassCode(e.target.value)}
                />

                <input
                    className="inputBox"
                    type="password"
                    placeholder="Confirm Pass Code"
                    maxLength={ 4 }
                    // inputmode="numeric"
                    value={enteredConfPassCode}
                    onChange={(e) => setEnteredConfPassCode(e.target.value)}
                />

                <CircularButton >
                    <span className="buttonText">Register</span>
                </CircularButton>
                <br />

                <LoadingAnimation loading={displayLoader}/>

                <div className="signupText">
                    {"Already have an account? "}
                    <span 
                        className="signupButton" 
                        onClick={handleLoginClick}
                    > 
                    Login
                    </span>
                </div>
            </form>

            <SnackBar
                open={snackBarVisible}
                msg={snackBarMsg}
                type={snackBarType}
                handleClose={handleSnackBarClose}
            />
        </>
    )
}