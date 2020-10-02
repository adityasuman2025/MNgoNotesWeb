import React, { useState } from 'react';
import { Redirect } from "react-router-dom";

import CircularButton from "../components/CircularButton";
import LoadingAnimation from "../components/LoadingAnimation";

import { PROJECT_NAME } from '../constants';

export default function LoginPage(props) {
    //hooks variables
    const [displayLoader, setDisplayLoader] = useState(false);
    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    //function to handle when signup is clicked
    function handleSignUpClick() {
        props.history.push("/register");
    }

    //function to handle when login btn is clicked
    function handleLoginClick(e) {
        e.preventDefault();

        //hanling stuffs if login is not already clicked
        if (!displayLoader) {
            setDisplayLoader(true);
            console.log("enteredUsername", enteredUsername);
            console.log("enteredPassword", enteredPassword);
        }
    }

//component rendering
    return (
        <>
            <form 
                className="loginPageContent"
                onSubmit={handleLoginClick} 
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
                    type="password"
                    placeholder="Password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                />

                <CircularButton >
                    <span className="buttonText">Login</span>
                </CircularButton>
                <br />

                <LoadingAnimation loading={displayLoader}/>

                <div className="signupText">
                    {"Don't have an account yet? "}
                    <span 
                        className="signupButton" 
                        onClick={handleSignUpClick}
                    > 
                    Signup
                    </span>
                </div>
            </form>
        </>
    )
}